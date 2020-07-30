const fetch = require("node-fetch");
const flatten = require("flat");

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

module.exports = async (req, res) => {
  //   let returnedDataArr = [];

  //   const username = req.query.data;
  //   const usernameArray = username.split(",");
  //   const returnedData = await getAllUserData(usernameArray);

  //   returnedData.map((userdata) => {
  //     returnedDataArr.push(...userdata);
  //   });
  //   res.json(returnedDataArr);
  const todores = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const todojson = await todores.json();
  res.json(todojson);

  //   return;
  //   res.status(200).end("Yep this works");
};
