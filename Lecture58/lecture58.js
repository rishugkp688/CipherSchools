// // in BookIssue.js
// const {model, Schema} =require("mongoose");
// const {Book}= require("./Book");

// const BookIssueSchema = new Schema({
//     bookIsbn:{type:String, required:true, ref:"Book"},
//     issuedTo:{type:Schema.ObjectId, required:true, ref:"User"},
//     issuedBy:{type:Schema.ObjectId, required:true, ref:"User"},
//     status:{type:String, default:"ISSUED", enum:["ISSUED","RETURNED"]},
// },
// {timestamps:true}
// );

// BookIssueSchema.pre("save", async function (next){
//     const bookIssue=this;
//     let value=0;
//     if(bookIssue.isNew){
//         value=1;
//     }else{
//         if(bookIssue.modifiedPaths().includes("status")){
//             if(bookIssue.status==="RETURNED"){
//                 value=-1;
//             }else{
//                 value=1;
//             }
//         }
//     }
//     if(value){
//         await Book.updateOne(
//             {isbn:bookIssue.bookIsbn},
//             {$inc: {issuedQuantity:value}}
//         );
//     }
// });

// const BookIssue =model("BookIssue",BookIssueSchema);
// module.exports=BookIssue;
// // in book-issue-controller.js
// const BookIssue = require("../models/BookIssue");

// const addBookIssue = async (req, res) => {
//   try {
//     const bookIssue = new BookIssue({ ...req.body, issuedBy: req.user._id });
//     await bookIssue.save();
//     return res.status(201).send({ message: "Saved" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({ message: err.message });
//   }
// };

// const getBookIssuedByStudent = async (req, res) => {
//   const user = req.user;
//   let query;
//   if (user.type === "LIBRARIAN") {
//     query = { issuedTo: req.query.studentId };
//   } else {
//     query = { issuedTo: req.user._id };
//   }
//   if (req.query.status) {
//     query = { ...query, status: req.query.status };
//   }
//   const bookIssueList = await BookIssue.find(query);
//   console.info(
//     `Found: ${bookIssueList.length} book issues for the student id: ${req.query.studentId} for the given filters.`
//   );
//   return res.status(200).send(bookIssueList);
// };

// module.exports = { addBookIssue, getBookIssuedByStudent };

// // in app.js
// require("./appMongoose");
// const express=require("express");
// const cors=require("cors");
// const userRoute=require("./routes/user-route");
// const bookRoute=require("./routes/book-route");
// const bookIssueRoute=require("./routes/book-issue-route");
// const app=express();

// app.use(cors());
// app.use(express.json());

// app.use("/user",userRoute);
// app.use("/book",bookRoute);
// app.use("book-issue",bookIssueRoute);

// app.listen(8080,()=>{
//     console.log(`Library app backend is running on port: 8080`);
// })
// in book-issue-route.js
const express = require("express");
const router = express.Router();
const bookIssueController = require("../controllers/book-issue-controller");
const { authMiddleware } = require("../middleware/auth-middleware");
const { librarianMiddleware } = require("../middleware/librarian-middleware");

router.post(
  "/add",
  authMiddleware,
  librarianMiddleware,
  bookIssueController.addBookIssue
);
router.get(
  "/by-student",
  authMiddleware,
  bookIssueController.getBookIssuedByStudent
);

module.exports = router;
