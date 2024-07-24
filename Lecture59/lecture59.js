// // in BookIssueForm.js
// import { useEffect, useState } from "react";
// import Select from "react-select";
// import { getAllStudents } from "../apis/user-api";
// import { getAllBooks } from "../apis/book-api";
// import { addNewBookIssue } from "../apis/book-issue-api";
// import { useNavigate, useLocation } from "react-router-dom";

// const BookIssueForm = () => {
//   const [bookIssue, setBookIssue] = useState({
//     issuedTo: "",
//     bookIsbn: "",
//   });

//   const [bookOptions, setBookOptions] = useState([]);
//   const [studentOptions, setStudentOptions] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();
//   console.log(location);

//   useEffect(() => {
//     getAllStudents().then((studentList) => {
//       setStudentOptions(
//         studentList.map((student) => {
//           return {
//             value: student._id,
//             label: `${student.firstName} ${student.lastName}`,
//           };
//         })
//       );
//     });
//     getAllBooks().then((bookList) => {
//       setBookOptions(
//         bookList.map((book) => {
//           return {
//             value: book.isbn,
//             label: `${book.title} by ${book.author}`,
//           };
//         })
//       );
//     });
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await addNewBookIssue(bookIssue);
//     navigate("/");
//   };

//   return (
//     <section className="app-section">
//       <h1>Add a new Book.</h1>
//       <form className="ui form" onSubmit={handleSubmit}>
//         <div className="field">
//           <label>Students</label>
//           <Select
//             options={studentOptions}
//             defaultInputValue="Select Student"
//             isSearchable={true}
//             onChange={({ value }) => {
//               setBookIssue({ ...bookIssue, bookIsbn: value });
//             }}
//           />
//         </div>
//         <div className="field">
//           <label>Books</label>
//           <Select
//             options={bookOptions}
//             isSearchable={true}
//             onChange={({ value }) => {
//               setBookIssue({ ...bookIssue, bookIsbn: value });
//             }}
//             value={bookOptions.filter((option)=>option.value===location?.state?.isbn)}
//           />
//         </div>
//         <button className="ui button" type="submit">
//           Submit
//         </button>
//       </form>
//     </section>
//   );
// };

// export default BookIssueForm;

// // in BookScreen.js
// import { useState, useEffect } from "react";
// import { getAllBooks } from "../apis/book-api";
// import { getLocalStorageUser } from "../utils/AuthUtil";
// import { useNavigate } from "react-router-dom";

// const numberFormatter = new Intl.NumberFormat("en-IN",{
//     currency:"INR",
//     style:"currency",
// });

// const formatCurrency=(currencyValue)=>numberFormatter.format(currencyValue);

// const BookScreen = () => {
//   const [bookList, setBookList] = useState([]);
//   const [userType, setUserType] = useState("STUDENT");

//   const fetchBooks = async () => {
//     const books = await getAllBooks();
//     setBookList(books);
//   };

//   const navigate=useNavigate();

//   useEffect(() => {
//     setUserType(getLocalStorageUser().type);
//     fetchBooks()
//       .then()
//       .catch((err) => {
//         console.error(err);
//       });
//   }, []);

//   return (
//     <section className="app-section">
//       <h1>List of all the books in the library.</h1>
//       <table className="ui single line table">
//         <thead>
//           <tr>
//             <th>ISBN</th>
//             <th>Title</th>
//             <th>Author</th>
//             <th>Price</th>
//             <th>Total Quantity</th>
//             <th>Issued Quantity</th>
//             {userType==="LIBRARIAN" && <th>Actions</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {bookList.map((book) => {
//             return (
//               <tr>
//                 <td>{book.isbn}</td>
//                 <td>{book.title}</td>
//                 <td>{book.author}</td>
//                 <td>{formatCurrency(book.price)}</td>
//                 <td>{book.totalQuantity}</td>
//                 <td>{book.issuedQuantity}</td>
//                 {userType==="LIBRARIAN" && <td>
//                   <button
//                     className="ui green button"
//                     disabled={book.issuedQuantity >= book.totalQuantity}
//                     onClick={(e)=>navigate("/book-issue",{
//                       state:{
//                         isbn:book.isbn,
//                       },
//                     })}
//                   >
//                     Issue Book
//                   </button>
//                 </td>}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </section>
//   );
// };

// export default BookScreen;

// // in Book-issue-controller.js
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

// const getBookIssueList = async (req, res) => {

//   const bookIssueList = await BookIssue.find({status: req.query.status });
//   console.info(
//     `Found: ${bookIssueList.length} book issues.`
//   );
//   return res.status(200).send(bookIssueList);
// };

// module.exports = { addBookIssue, getBookIssuedByStudent, getBookIssueList };

// // in book-issue-route.js
// const express = require("express");
// const router = express.Router();
// const bookIssueController = require("../controllers/book-issue-controller");
// const { authMiddleware } = require("../middleware/auth-middleware");
// const { librarianMiddleware } = require("../middleware/librarian-middleware");

// router.post(
//   "/add",
//   authMiddleware,
//   librarianMiddleware,
//   bookIssueController.addBookIssue
// );
// router.get(
//   "/by-student",
//   authMiddleware,
//   bookIssueController.getBookIssuedByStudent
// );
// router.get(
//   "/list",
//   authMiddleware,
//   librarianMiddleware,
//   bookIssueController.getBookIssueList
// );

// module.exports = router;

// // in bookIssueScreen.js
// import { useEffect, useState } from "react";
// import { getBookIssueList } from "../apis/book-issue-api";
// const dateFormatter=new Intl.DateTimeFormat("en-IN",{
//     month:"long",
//     year:"numeric",
//     day:"numeric",
// })

// const formatDate=(date)=>dateFormatter.format(date);

// const BookIssueScreen=()=>{
//     const[bookIssueList,setBookIssueList]=useState([]);
//     const[selectedStatus,setSelectedStatus]=useState("ISSUED");

//     useEffect(()=>{
//         getBookIssueList(selectedStatus).then((list)=>{
//             setBookIssueList(list);
//         })
//     },[selectedStatus])

//     return (
//         <section className="app-section">
//           <h1>List of all the books in the library.</h1>
//           <table className="ui single line table">
//             <thead>
//               <tr>
//                 <th>ISBN</th>
//                 <th>Student ID</th>
//                 <th>Issued Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bookIssueList.map((bookIssue) => {
//                 return (
//                   <tr>
//                     <td>{bookIssue.bookIsbn}</td>
//                     <td>{bookIssue.issuedTo}</td>
//                     <td>{new Date(formatDate(bookIssue.createdAt))}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </section>
//       );
// }

// export default BookIssueScreen;
// // in book-issue-api.js
// import LibraryApplicationBackend from "./LibraryApplicationBackend";

// export const addNewBookIssue = async (bookIssue) => {
//   const { data } = await LibraryApplicationBackend.post("/book-issue/add", {
//     ...bookIssue,
//   });
//   return data;
// };

// export const getBookIssueList = async (status = "ISSUED") => {
//   const { data: bookIssueList } = await LibraryApplicationBackend.get(
//     "/book-issue/list",
//     { params: { status } }
//   );
//   return bookIssueList;
// };

// in book-controller.js
const InputValidationException = require("../exceptions/InputValidationException");
const Book = require("../models/Book");

const addBook = async (req, res) => {
  try {
    const book = new Book({ ...req.body });
    await book.save();
    return res.status(201).send(book);
  } catch (err) {
    console.error(err);
    return res
      .status(err instanceof InputValidationException ? 400 : 500)
      .send({ message: err.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const bookList = await Book.find({
      $expr: { $lt: ["$issuedQuantity", "$totalQuantity"] },
    });
    return res.status(200).send(bookList);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
};

module.exports = { addBook, getAllBooks };
