const express = require("express");
const app = express();
const fetch = require("node-fetch");
const flatten = require("flat");
const cors = require("cors");

app.use(express.json());

let index = 0;

let whiteList = [
  "https://tableau-public-api.wdc.dev/",
  "https://tableau-public.wdc.dev",
];

//enable cors for only our WDC front-end
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// const corsOptions = {
//   origin: "https://tableau-public.wdc.dev",
//   optionsSuccessStatus: 200
// };

// get data
const getData = async (user, arr) => {
  try {
    let result = arr || [];
    const count = 100;
    const res = await fetch(
      `https://public.tableau.com/profile/api/${user}/workbooks?count=${count}&index=${index}`
    );
    const json = await res.json();
    json.map((viz) => {
      const flatViz = flatten(viz);
      let str = JSON.stringify(flatViz).replace(/\.\d\./g, "");
      newJson = JSON.parse(str);
      result.push(newJson);
    });
    console.log(`Initial JSON length: ${json.length}`);
    if (json.length >= count) {
      index += 100;
      console.log(`Got more data: ${index} - Count: ${count}`);
      await getData(user, result);
    }
    index = 0;
    return await result;
  } catch (err) {
    // logging errors if there are any
    console.log(err);
    return err;
  }
};

// function to loop over array with promise
const getAllUserData = async (array) => {
  return await Promise.all(array.map((user) => getData(user)));
};

// create route to get data
app.get("/data", cors(corsOptions), async (req, res) => {
  let returnedDataArr = [];

  const username = req.query.data;
  const usernameArray = username.split(",");
  const returnedData = await getAllUserData(usernameArray);

  returnedData.map((userdata) => {
    returnedDataArr.push(...userdata);
  });

  //   const usertoFetch = usernameArray[0];
  //   const data = await getData(usertoFetch);
  res.json(returnedDataArr);

  return;
});

app.listen();
