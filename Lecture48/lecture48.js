// in jwt.js

const jwt=require("jsonwebtoken");

const CS_SECRET_KEY="CSSecretKey";

const generateToken=(payload)=>{
    const token=jwt.sign(payload,CS_SECRET_KEY,{expiresIn:"1h"});
    return token;
}

const verifyToken=(token)=>{
    try{
        const payload=jwt.verify(token,CS_SECRET_KEY);
        return {isValidToken:true,payload};
    }catch(err){
        console.error(err);
        return{isValidToken:false,payload:undefined};
    }
}

module.exports={generateToken,verifyToken};


// in app.js

require("./appMongoose");
const express =require("express");
const Task = require("./models/Task");
const userRouter=require("./routes/user-routes");
const authMiddleware=require("./middleware/auth-middleware")
const app=express();
app.use(express.json());
app.use("/user",userRouter);

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

app.get("/get-tasks", authMiddleware ,async (req,res)=>{
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