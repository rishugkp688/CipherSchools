// // in LibrarianHomeScreen.js
// import { Link } from "react-router-dom";

// const LibrarianHomeScreen = () => {
//   return (
//     <>
//       <h1>Welcome Librarian</h1>
//       <div className="ui cards">
//         <div className="card">
//           <div className="content">
//             <div className="header">
//               <Link to={"/add-book"}>Add new books</Link>
//             </div>
//             <div className="description">
//               Add a new Book in the library.
//             </div>
//           </div>
//         </div>
//         <div className="card">
//           <div className="content">
//             <div className="header">
//               <Link to={"/books"}>List of books</Link>
//             </div>
//             <div className="description">
//               See the list of all the  books in the library.
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LibrarianHomeScreen;

// // in StudentHomeScreen.js
// import { Link } from "react-router-dom";
// const StudentHomeScreen = () => {
//   return (
//     <>
//       <h1>Welcome Librarian</h1>
//       <div className="ui cards">
//         <div className="card">
//           <div className="content">
//             <div className="header">
//               <Link to={"/books"}>List of books</Link>
//             </div>
//             <div className="description">
//               See the list of all the books in the library.
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StudentHomeScreen;

// // in BookScreen.js
// import { useState, useEffect } from "react";
// import { getAllBooks } from "../apis/book-api";
// import { getLocalStorageUser } from "../utils/AuthUtil";

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

// in app.js
import './App.css';
import{createBrowserRouter,RouterProvider} from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import BookForm from './screens/BookForm';
import BookScreen from './screens/BookScreen';

const router = createBrowserRouter([
  {path:"/login",element:<LoginScreen/>},
  {path:"/signup",element:<SignUpScreen/>},
  {path:"/",element:<HomeScreen/>},
  {path:"/add-book",element:<BookForm/>},
  {path:"/books",element:<BookScreen/>},
]);


function App() {
  return <RouterProvider router={router}/>;
  
}

export default App;
