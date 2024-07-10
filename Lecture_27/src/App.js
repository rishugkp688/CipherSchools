//import { useState } from "react";
import AddTask from "./components/AddTask";
import ToDoScreen from "./screens/ToDoScreens";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { TaskProvider } from "./context/TaskContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ToDoScreen />
  },
  {
    path:"/add-task",
    element:<AddTask/>
  }
])

const App = () => {
  return (
    <TaskProvider>
      <RouterProvider router={router} />;
    </TaskProvider>
  )
}

export default App;
