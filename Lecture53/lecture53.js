// // in app.js
// require("./appMongoose");
// const express=require("express");
// const cors=require("cors");
// const userRoute=require("./routes/user-route");
// const app=express();

// app.use(cors());
// app.use(express.json());

// app.use("/user",userRoute);

// app.listen(8080,()=>{
//     console.log(`Library app backend is running on port: 8080`);
// })

// // in user-controller.js
// const InputValidationException = require("../exceptions/InputValidationException");
// const userService=require("../services/user-service");

// const addNewUser=async(req,res)=>{
//     try{
//         const {firstName,lastName,email,password,type}=req.body;
//         let user={
//             firstName,
//             lastName,
//             email,
//             password,
//             type,
//         };
//         user=await userService.addNewUser(user);
//         return res.status(200).send(user);
//     }catch(err){
//         console.error(err);
//         return res.status(err instanceof InputValidationException ?400:500).send({message: err.message});
//     }
// };

// const loginUser=async(req,res)=>{
//     try{
//         const {email,password}=req.body;
//         const data=await userService.loginUser({email,password});
//         return res.status(200).send(data);
//     }catch(err){
//         console.error(err);
//         return res.status(500).send({message:err.message});
//     }
// };

// module.exports={addNewUser,loginUser};

// // in user.js
// const {model,schema, Schema}=require("mongoose");
// const{isEmail}=require("validator");
// const{encryptPassword , checkPassword}=require("../bcrypt");
// const { generateToken } = require("../jwt");

// const UserSchema=new Schema({
//     firstName: {type:String , trim:true , required:true},
//     lastName: {type:String , trim:true , required:true},
//     email: {type:String , lowerCase:true , trim:true , required:true , unique:true , validate:{
//         validator(email){
//             return isEmail(email);
//         },
//     },
//     },
//     password:{type:String , required:true , trim:true , minlength:8 , validate:{
//         validator(pass){
//             if(pass.includes(" ") || pass.includes("\n") || pass.includes("\t")){
//                 throw new Error(
//                     "Password must not contain space/tab/newLine character."
//                 );
//             }
//             if(pass.toLowerCase().includes("password")){
//                 throw new Error("Password must not contain `password");
//             }
//             return true;
//         },
//     },
//     },
//     type:{
//         type:String,
//         enum:["STUDENT","LIBRARIAN"],
//         default: "STUDENT"
//     },
//     tokens:{
//         type:[{token:String}],
//     }
//     },
//     {timestamps:true}
// );


// UserSchema.pre("save",async function(next){
//     const user =this;
//     if(user.modifiedPaths().includes("password")){
//         user.password=await encryptPassword(user.password);
//     }
//     next();
// });

// UserSchema.statics.findByEmailAndPasswordForAuth=async(email,password)=>{
//     try{
//         const user =await User.findOne({email});
//         if(!user){
//             throw new Error(`Login Failed`);
//         }
//         const encryptPassword=user.password;
//         const isMatch=await checkPassword(password,encryptPassword);
//         if(!isMatch){
//             throw new Error("Login Failed.");
//         }
//         console.log("Login Success!");
//         return user;
//     }catch(err){
//         console.error(err);
//         throw err;
//     }
// };

// UserSchema.methods.generateToken=function(){
//     const user=this;
//     const token=generateToken(user);
//     user.tokens.push({token});
//     user.save();
//     return token;
// };

// UserSchema.methods.toJSON=function(){
//     let user=this.toObject();
//     delete user.tokens;
//     return user;
// };

// const User=model("User",UserSchema);

// module.exports = User;

// // in user-route.js
// const express=require("express");
// const router=express.Router();
// const userController=require("../controllers/user-controller");

// router.post('/signup',userController.addNewUser);
// router.post('/login',userController.loginUser);

// module.exports= router;

// // in user-service.js
// const User=require("../models/User");
// const InputValidationException = require("../exceptions/InputValidationException");

// const addNewUser=async(user)=>{
//     try{
//         user=new User(user);
//         await user.save();
//         console.log(`User with ID: ${user._id} was added in database.`);
//         const token =user.generateToken();
//         return {user,token};
//     }catch(err){
//         console.error(`Please enter valid fields. The error is: ${err}`);
//         throw new InputValidationException(err.message);
//     }
// };

// const loginUser=async({email,password})=>{
//     const user=await User.findByEmailAndPasswordForAuth(email,password);
//     console.log(`User with email:${email} has logged in`);
//     const token=user.generateToken();
//     return{user,token};
// }

// module.exports={
//     addNewUser,
//     loginUser,
// };


// // in bcrypt.js
// const bcrypt=require("bcrypt");

// const encryptPassword=async(plainTextPassword)=>{
//     try{
//         return await bcrypt.hash(plainTextPassword,8);
//     }catch(err){
//         console.error(err);
//         throw err;
//     }
// };

// const checkPassword=async(plainTextPassword,encryptPassword)=>{
//     return await bcrypt.compare(plainTextPassword,encryptPassword);
// };

// module.exports = {encryptPassword,checkPassword};

// in jwt.js
const jwt =require("jsonwebtoken");

const CS_LIB_APP_SIGN = "CS_LIB-AppSign";

const generateToken = ({_id,type})=>{
    const token=jwt.sign({_id,type},CS_LIB_APP_SIGN);
    return token;
};

const verifyToken=(token)=>{
    try{
        const payload=jwt.verify(token,CS_LIB_APP_SIGN);
        return { status:true,payload};
    }catch(err){
        console.error(err);
        return{ status:false , payload:undefined};
    }
};

module.exports={generateToken,verifyToken};