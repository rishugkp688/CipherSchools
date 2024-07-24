// in appjs

require("./appMongoose");
const express = require("express");
const Task = require("./models/Task");
const app = express();
app.get("/", (req, res) => {
  res.send("this is response from my first node server");
});

app.get("/add", (req, res) => {
  let { a: firstNumber, b: secondNumber } = req.query;
  let sum = parseInt(firstNumber) + parseInt(secondNumber);
  res.send({ sum });
});

app.post("/add-task", async (req, res) => {
  const task = new Task({
    title: "Testtask",
    description: "Testtask description",
  });
  await task.save();
  return res.status(201).send({ message: "saved" });
});

app.listen(1309, () => {
  console.log(`server is running`);
});
