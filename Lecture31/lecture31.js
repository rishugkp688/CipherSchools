// in app.js creating an http server

const http=require("http");

const server=http.createServer((req, res)=>{
    res.write("this is response from my first node server");
    res.end();
});

server.listen(1309,()=>{
    console.log(`server is running`);
})