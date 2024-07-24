// in jwt.js
const jwt=require("jsonwebtoken");

const CS_SECRET_KEY="CSSecretKey";

const generateToken=(payload)=>{
    const token=jwt.sign(payload,CS_SECRET_KEY);
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

// module.exports={generateToken,verifyToken};

// console.log(generateToken({name:"Shivang"}));
console.log(verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU2hpdmFuZyIsImlhdCI6MTcxOTg1MzgxM30.UQ7uXOeJU0or39Kq9h1znxHIwgAGWrCkW15tBral2Ao"));