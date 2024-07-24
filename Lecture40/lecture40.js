// in app.js
require("./appMongoose");
const express =require("express");
const Task = require("./models/Task");
const app=express();
app.use(express.json());

app.get("/",(req, res)=>{
    res.send("this is response from my first node server");
})

app.get("/add",(req,res)=>{
    let{ a: firstNumber , b: secondNumber }=req.query;
    let sum=parseInt(firstNumber)+parseInt(secondNumber);
    res.send({sum});
})

app.post("/add-task",async(req,res)=>{
    const task=new Task({title:"Testtask",description:"Testtask description"});
    await task.save();
    return res.status(201).send({message:"saved"});
})

app.get("/get-tasks",async (req,res)=>{
    const taskList=await Task.find();
    return res.status(200).send(taskList);
})

app.put("/update-tasks/:taskId",async (req,res)=>{
    const{taskId}=req.params;
    const updateResult=await Task.updateOne({_id:taskId},{$set:{...req.body},});
    if(!updateResult.matchedCount){
        return res.status(404).send({message:"taskId was not found"})
    }
    return res.status(200).send({message: "update success"});
})

app.delete("/delete-task/:taskId",async(req,res)=>{
    const{taskId}=req.params;
    const deleteResult=await Task.deleteOne({_id:taskId});
    if(!deleteResult.deletedCount){
        return res.status(404).send({message:"taskId was not found"})
    }
    return res.status(200).send({message: "deleted successfully"});
})
app.listen(1309,()=>{
    console.log(`server is running`);
})