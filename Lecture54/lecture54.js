// in frontend part

// // in app.js
// import './App.css';
// import{createBrowserRouter,RouterProvider} from 'react-router-dom';
// import LoginScreen from './screens/LoginScreen';
// import SignUpScreen from './screens/SignUpScreen';

// const router = createBrowserRouter([
//   {path:"/login",element:<LoginScreen/>},
//   {path:"/signup",element:<SignUpScreen/>},
//   {path:"/librarian",element:<h1>Librarian Page</h1>},
//   {path:"/student",element:<h1>Student Page</h1>},
// ]);

// function App() {
//   return <RouterProvider router={router}/>;

// }

// export default App;

// // in SignUpScreen.js
// import { useState } from "react";
// import {signUpUser } from "../utils/AuthUtil";
// import { Link, useNavigate } from "react-router-dom";

// const SignUpScreen = () => {
//   const [userData, setUserData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     type: "",
//   });
//   const navigate = useNavigate();

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     console.log(userData);
//     if (validateData()) {
//       const user = await signUpUser(userData);
//       if (user.type === "LIBRARIAN") {
//         navigate("/librarian");
//       } else {
//         navigate("/student");
//       }
//     }
//   };

//   const validateData = () => {
//     return (
//       userData.firstName?.length &&
//       userData.lastName?.length &&
//       userData.email?.length &&
//       userData.password?.length
//     );
//   };

//   const handleInputChange = (e) => {
//     setUserData({ ...userData, [e.target.name]: e.target.value });
//   };

//   return (
//     <section className="app-section">
//       <h1 className="login-heading">
//         <u>Signup</u>
//       </h1>
//       <span>
//         Already have an account? <Link to={"/login"}> Login here</Link>
//       </span>
//       <form className="ui form" onSubmit={handleLoginSubmit}>
//         <div className="field">
//           <label>First Name</label>
//           <input
//             type="text"
//             name="firstName"
//             placeholder="First Name"
//             value={userData.firstName}
//             onChange={handleInputChange}
//             required={true}
//           />
//         </div>
//         <div className="field">
//           <label>Last Name</label>
//           <input
//             type="text"
//             name="lastName"
//             placeholder="Last Name"
//             value={userData.lastName}
//             onChange={handleInputChange}
//             required={true}
//           />
//         </div>
//         <div className="field">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={userData.email}
//             onChange={handleInputChange}
//             required={true}
//           />
//         </div>
//         <div className="field">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={userData.password}
//             onChange={handleInputChange}
//             required={true}
//             minLength={8}
//           />
//         </div>
//         <div class="ui segment">
//           <div class="field">
//             <div
//               class="ui toggle checkbox"
//               onClick={() => {
//                 setUserData({
//                   ...userData,
//                   type: userData.type === "LIBRARIAN" ? "STUDENT" : "LIBRARIAN",
//                 });
//               }}
//             >
//               <input
//                 type="checkbox"
//                 name="gift"
//                 tabIndex="0"
//                 class="hidden"
//                 checked={userData.type === "LIBRARIAN"}
//               />
//               <label>Are you a Librarian?</label>
//             </div>
//           </div>
//         </div>
//         <button className="ui button" type="submit">
//           Submit
//         </button>
//       </form>
//     </section>
//   );
// };

// export default SignUpScreen;

// // in LoginScreen.js
// import { useState } from "react";
// import { loginUser } from "../utils/AuthUtil";
// import { Link,useNavigate } from "react-router-dom";

// const LoginScreen = () => {

//     const[credentials,setCredentials]=useState({email:"",password:""});
//     const navigate=useNavigate();

//     const handleLoginSubmit=async(e)=>{
//         e.preventDefault();
//         console.log(credentials);
//         if(validateCredentials()){
//             const user=await loginUser(credentials);
//             if(user.type==="LIBRARIAN"){
//                 navigate("/librarian");
//             }else{
//                 navigate("/student");
//             }

//         }
//     }

//     const validateCredentials=()=>{
//         return credentials.email?.length && credentials.password?.length;
//     };

//     const handleInputChange=(e)=>{
//         setCredentials({...credentials,[e.target.name]:e.target.value});
//     }

//   return (
//     <section className="app-section">
//         <h1 className="login-heading"><u>Login</u></h1>
//         <span>Do not have an account?<Link to={"/signup"}>Signup Here</Link></span>
//     <form className="ui form" onSubmit={handleLoginSubmit}>
//       <div className="field">
//         <label>Email</label>
//         <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleInputChange} required={true}/>
//       </div>
//       <div className="field">
//         <label>Password</label>
//         <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleInputChange} required={true} minLength={8}/>
//       </div>
//       <button className="ui button" type="submit">
//         Submit
//       </button>
//     </form>
//     </section>
//   );
// };

// export default LoginScreen;

// // in LibraryApplicationBackend.js
// import axios from "axios";
// import{getUserToken} from "../utils/AuthUtil";

// const LibraryApplicationBackend = axios.create({
//     baseURL:`http://localhost:8080`,
// });

// LibraryApplicationBackend.interceptors.request.use(
//     (config)=>{
//         const token=getUserToken();
//         if(token){
//             config.headers={Authorization:`Bearer ${token}`};
//             console.log("Inside interceptor");
//         }
//         return config;
//     },
//     (error)=>{
//         return Promise.reject(error);
//     }
// );

// export default LibraryApplicationBackend;

// // in user-api.js
// import LibraryApplicationBackend from "./LibraryApplicationBackend";

// export const loginUser =async({email,password})=>{
//     const {data}=await LibraryApplicationBackend.post("/user/login",{email,password});
//     return data;
// };

// export const signUpUser=async(userData)=>{
//     const {data}=await LibraryApplicationBackend.post("/user/signup",userData);
//     return data;
// };

// in AuthUtil.js
import { loginUser, signUpUser } from "../apis/user-api";

const getUserToken = () => {
  return localStorage.getItem("token");
};

const setUser = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", data.user);
};

const loginUserFunction = async ({ email, password }) => {
  const data = await loginUser({ email, password });
  setUser(data);
  return data.user;
};

const signupUserFunction = async (userData) => {
  const data = await signUpUser(userData);
  setUser(data);
  return data.user;
};

export {
  getUserToken,
  loginUserFunction as loginUser,
  signupUserFunction as signUpUser,
};
