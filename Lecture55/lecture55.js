// // in Book.js
// const {model,Schema}=require("mongoose");

// const BookSchema=new Schema({
//     isbn:{type:String , required:true , unique:true},
//     title:{type:String , required:true},
//     author:{type:String , required:true},
//     totalQuantity:{type:Number,min:0,default:1},
//     issuedQuantity:{
//         type:Number,
//         min:0,
//         default:0,
//         validate:{validator(value){
//             return this.get("totalQuantity")>=value;
//         }},
//     },
//     price:{type:Number,min:1,required:true},

// });

// const Book=model("Book",BookSchema);

// module.exports=Book;

// // in book-controller.js
// const InputValidationException=require("../exceptions/InputValidationException");
// const Book = require("../models/Book");

// const addBook=async(req,res)=>{
//     try{
//         const book=new Book({...req.body});
//         await book.save();
//         return res.status(201).send(book);
//     }catch(err){
//         console.error(err);
//         return res.status(err instanceof InputValidationException?400:500).send({message:err.message});
//     }
// };

// const getAllBooks=async(req,res)=>{
//     try{
//         const bookList=await Book.find();
//         return res.status(200).send(bookList);
//     }catch(err){
//         console.error(err);
//         return res.status(500).send({message:err.message});
//     }
// }

// module.exports={addBook,getAllBooks};

// // in book-route.js
// const express=require('express');
// const router=express.Router();
// const bookController=require("../controllers/book-controller");
// const { authMiddleware } = require('../middleware/auth-middleware');
// const { librarianMiddleware } = require('../middleware/librarian-middleware');

// router.post("/add",authMiddleware,librarianMiddleware,bookController.addBook);
// router.get("/all",authMiddleware,bookController.getAllBooks);

// module.exports=router;

// // in app.js
// require("./appMongoose");
// const express=require("express");
// const cors=require("cors");
// const userRoute=require("./routes/user-route");
// const bookRoute=require("./routes/book-route");
// const app=express();

// app.use(cors());
// app.use(express.json());

// app.use("/user",userRoute);
// app.use("/book",bookRoute);

// app.listen(8080,()=>{
//     console.log(`Library app backend is running on port: 8080`);
// })

// // in auth-middleware.js
// const{verifyToken}=require("../jwt");
// const User=require("../models/User");

// const authMiddleware=async(req,res,next)=>{
//     const{authorization}=req.headers;
//     const token=authorization.substring(7);
//     const{status,payload}=verifyToken(token);
//     const errorData={
//         message:"Please use valid token. To get a valid token,please authenticate.",
//     };
//     if(status){
//         const{_id}=payload;
//         const user=await User.findOne({_id});
//         if(!user){
//             return res.status(403).send(errorData);
//         }else{
//             req.user=user;
//             req.token=token;
//             next();
//         }
//     }else{
//         return res.status(403).send(errorData);
//     }
// };

// module.exports={authMiddleware};

// in librarian-middleware.js
const librarianMiddleware=async(req,res,next)=>{
    if(req.user.type!=="LIBRARIAN"){
        return res.status(403).send({message:"You are not authorized to do this task."});
    }
    next();
};

module.exports={librarianMiddleware};

