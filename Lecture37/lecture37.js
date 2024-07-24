// in appMongoose.js

const {connect}=require("mongoose");

const MONGO_URL="mongodb+srv://shivangagrawal139:Qwe%23123@cluster0.ciizs6l.mongodb.net"

const DB_NAME=`mern`;

async function connectDb(){
    try{
    await connect(`${MONGO_URL}/${DB_NAME}`);
    console.log("MongoDb connected");
    } catch(err){
        console.error(err);
    }
}

connectDb();