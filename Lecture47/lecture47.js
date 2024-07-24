// in auth-middleware.js
const {verifyToken}=require("../jwt");

const authMiddleware=async (req,res,next)=>{
    const{authorization}=req.headers;
    if(!authorization){
        return res.status(300).send({message:"Please send a token"});
    }
    const token=authorization.substring(7);
    const {isValidToken,payload}=verifyToken(token);
    if(isValidToken){
        console.log(`token is valid`);
        const user=await User.findOne({_id:payload._id});
        req.token=token;
        req.user=user;
        next();
    }
    else{
        console.warn(`Token is invalid`);
        return res.status(403).send({message:"Please use a valid token"});
    }
}

module.exports=authMiddleware;

// in user.js

const {model,Schema} =require ("mongoose");
const {isEmail} =require ("validator");
const { encryptPassword, checkPassword } = require("../bcrypt");
const { generateToken } = require("../jwt");

const UserSchema=new Schema({
    name: {type: String, trim: true, required: true},
    email: {type: String, trim: true, lowercase: true, unique: true, required: true, validate:{validator(email){
        return isEmail(email);
    }}},
    age:{type:Number, required: true, validate:{validator(age){
        if(age<0){
            throw new Error(`Age must be positive.`);
        }
        return true;
    }}},
    password:{type: String, required: true, trim: true, minlength: 8, validate:{validator(password){
        if(password.includes(" ")|| password.includes("\n")|| password.includes("\t")){
            throw new Error(`Password includes space/tab/newline characters.`);
        }
        if(password.toLowerCase().includes("password")){
            throw new Error(`Password must not contain 'password'`);
        }
    }}},
},{timestamps: true}
);


UserSchema.statics.findByEmailAndPasswordForAuth= async(email,password)=>{
    try{
        const user= await User.findOne({email});
        if(!user){
            throw new Error(`Invalid credentials`);
        }
        const isMatch=await checkPassword(password,user.password);
        if(!isMatch){
            throw new Error(`Invalid credentials`);
        }
        console.log(`Login Successful`);
        return user;
    } catch(err){
        console.error(err);
        throw err;
    }
}

UserSchema.pre("save",async function(next){
    const user=this;
    if(user.modifiedPaths().includes("password")){
        user.password=await encryptPassword(user.password);
    }
    next();
})

UserSchema.methods.generateToken=function(){
    const user=this;
    const token=generateToken({_id:user._id});
    return token;
}

const User=model("User",UserSchema);
module.exports=User;

// in user-controller.js
const User=require("../models/User");

const addNewUser=async(req,res)=>{
    try{
        const {name,email,age,password}=req.body;
        const user=new User({name,email,age,password});
        await user.save();
        const token=user.generateToken();
        return res.status(201).send({user,token});
    }catch(err){
        console.error(err);
        return res.status(500).send({message:err.message});
    }
}

const loginUser=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user= await User.findByEmailAndPasswordForAuth(email,password);
        const token=user.generateToken();
        console.info(`user with Email: ${email} successfully logged in.`);
        return res.status(200).send({user,token});
    }
    catch(err){
        console.error(err);
        return res.status(500).send({message:"Login failed!"});
    }
};

const deleteUser=async(req,res)=>{
    const {user}=req;
    const userId=user._id;
    const deleteResult=await User.deleteOne({_id:userId});
    if(!deleteResult.deletedCount){
        console.error(`Delete failed! User With this id not found`);
        return res.status(404).send({message:`Delete failed! User With this id not found`})
    }
    console.info(`Delete Success with this id`);
    return res.status(200).send({message:"delete success!"});
}

module.exports={addNewUser,loginUser,deleteUser};

