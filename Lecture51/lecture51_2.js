exports.addNewTask = async(req,res)=>{
    try{
      const task = new Task({...req.body});
      await task.save();
      return res.status(201).send({message: "Saved"})
    }catch(err){
      console.error(err);
      return res.status(500).send({message: err})
    }
  };
  
  export const addTask = async ({title,description}) =>{
    const {data} = await TaskApplicationBackend.post("/task/add");
    return data;
  };
  
  let addNewTask = async(task) =>{
    try{
      await addTask({...task});
      setTaskList([...taskList, {...task, isComplete: false,},]);
      }catch(err){
        console.error(err);
      }
  }