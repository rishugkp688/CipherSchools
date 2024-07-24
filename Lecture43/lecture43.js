// // in user-controller.js
// const User=require("../models/User");

// const addNewUser=async(req,res)=>{
//     try{
//         const {name,email,age,password}=req.body;
//         const user=new User({name,email,age,password});
//         await user.save();
//         return res.status(201).send(user);
//     }catch(err){
//         console.error(err);
//         return res.status(500).send({message:err.message});
//     }
// }

// const loginUser=async(req,res)=>{
//     try{
//         const{email,password}=req.body;
//         const user=await User.findByEmailAndPasswordForAuth(email,password);
//         console.info(`user with Email: ${email} successfully logged in.`);
//         return res.status(200).send(user);
//     }
//     catch(err){
//         console.error(err);
//         return res.status(500).send({message:"Login failed!"});
//     }
// };

// module.exports={addNewUser,loginUser};

// // in User.js

// const {model,Schema} =require ("mongoose");
// const {isEmail} =require ("validator");

// const UserSchema=new Schema({
//     name: {type: String, trim: true, required: true},
//     email: {type: String, trim: true, lowercase: true, unique: true, required: true, validate:{validator(email){
//         return isEmail(email);
//     }}},
//     age:{type:Number, required: true, validate:{validator(age){
//         if(age<0){
//             throw new Error(`Age must be positive.`);
//         }
//         return true;
//     }}},
//     password:{type: String, required: true, trim: true, minlength: 8, validate:{validator(password){
//         if(password.includes(" ")|| password.includes("\n")|| password.includes("\t")){
//             throw new Error(`Password includes space/tab/newline characters.`);
//         }
//         if(password.toLowerCase().includes("password")){
//             throw new Error(`Password must not contain 'password'`);
//         }
//     }}},
// },{timestamps: true}
// );


// UserSchema.statics.findByEmailAndPasswordForAuth= async(email,password)=>{
//     try{
//         const user= await User.findOne({email});
//         if(!user){
//             throw new Error(`Invalid credentials`);
//         }
//         if(password!==user.password){
//             throw new Error(`Invalid credentials`);
//         }
//         console.log(`Login Successful`);
//         return user;
//     } catch(err){
//         console.error(err);
//         throw err;
//     }
// }

// const User=model("User",UserSchema);
// module.exports=User;

// // in user-routes.js

// const express=require("express");
// const router=express.Router();
// const userController=require("../controllers/user-controller");

// router.post("/login",userController.loginUser);
// router.post("/signup",userController.addNewUser);


// module.exports=router;

// in app.js
require("./appMongoose");
const express =require("express");
const Task = require("./models/Task");
const userRouter=require("./routes/user-routes");
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