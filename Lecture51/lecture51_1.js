export const logoutUser = ()=>{
    localStorage.removeItem("token");
  };
  
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <loginScreen />,
    },
    {
      path: "/to-do",
      element: <ToDoScreen />,
    },
  ]);
  
  const handleSubmit = async(e)=>{
    try{
      e.preventDefault();
      if(!credentialsValidator(credentials)){
        return;
      }
      await loginUser({...credentials});
    }catch(err){
      console.error("Invalid Credentials");
    }
  };
  
  const express = require("express");
  const router = express.Router();
  
  module.exports = router;
  
  const TAsk = require("../models/Task");
  
  exports.getTasksForUser = async(req,res)=>{
    try{
      const taskList = await Task.find({owner: req.user._id});
      return res.status(200).send(taskList);
    }catch(err){
      console.error(err);
      return res.status(500).send({message: err});
    }
  };
  
  const fetchTask = async()=>{
    const tasks = await getTasksForCurrentUser();
    setTaskList([...tasks]);
  }
  useEffect(()=>{
    fetchTask();
  },[]);
  
  import {TaksApplicationBackend} from "./TaskApplicationApis"
  
  export const getTasksForCurrentUser = async()=>{
    const {data} = await TaksApplicationBackend.get("/task");
  };
  
  const express = require("express");
  const router = express.Router();
  const authMiddleware = require("../middleware/auth-middleware");
  const taskController = require("../controllers/task-cotroller")
  
  router.get("/self", authMiddleware, taskController.getTaskForUser);
  
  module.exports = router;