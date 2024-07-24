// in app.js creating api and learning express

const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("this is response from my first node server");
});

app.get("/add", (req, res) => {
  let { a: firstNumber, b: secondNumber } = req.query;
  let sum = parseInt(firstNumber) + parseInt(secondNumber);
  res.send({ sum });
});

app.listen(1309, () => {
  console.log(`server is running`);
});
