// in toDoScreen.js

validator={({title,description})=>{
    if(title?.length&&!title.includes("\n")&&description?.length){
        console.log(`Is valid`);
        return true;
    }
    console.log(`invlalid`);
    return false;
}};