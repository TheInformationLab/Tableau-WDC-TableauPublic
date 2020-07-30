const fetch = require("node-fetch");
const flatten = require("flat");

// CORS setting for Vercel
// Source: https://vercel.com/knowledge/how-to-enable-cors

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another option
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// index for looping

let index = 0;

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
    return result;
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

module.exports = allowCors(async (req, res) => {
  let returnedDataArr = [];

  const username = req.query.data;
  const usernameArray = username.split(",");
  const returnedData = await getAllUserData(usernameArray);

  returnedData.map((userdata) => {
    returnedDataArr.push(...userdata);
  });

  res.json(returnedDataArr);
});
