// in User.js

const {model,Schema} =require ("mongoose");
const {isEmail} =require ("validator");
const { encryptPassword, checkPassword } = require("../bcrypt");

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

const User=model("User",UserSchema);
module.exports=User;

// in bcrypt.js

const bcrypt=require("bcrypt");

const encryptPassword=async(plainTextPassword)=>{
    try{
        return await bcrypt.hash(plainTextPassword,8);
    }
    catch(err){
        console.error(err);
        throw err;
    }
};

const checkPassword=async(plainTextPassword,encryptedPassword)=>{
    return bcrypt.compare(plainTextPassword,encryptedPassword);
};

module.exports={ checkPassword,encryptPassword};