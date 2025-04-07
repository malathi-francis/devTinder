const express = require("express");

const app = express();


app.get('/me',(req,res) => {
  res.send("get call check")
});
app.use('/me',(req,res) => {
  res.send("use call check")
});
app.use('/app',(req,res) =>{
  res.send("data for this page shown here!")
});
app.use('/',(req,res) => {
  res.send("first page of the application");
});

//playing with the routes
app.get('/ab?c',(req,res)=>{
  res.send("b is optional in the route")
});
app.post('/ab+c',(req,res)=>{
  res.send("b can be added infinitely")
});
app.post('./a(bc)+d',(req,res)=>{
  res.send("bc together can be used infinitley")
});
app.listen(3000,() =>{
  console.log("server successfully connected to port 3000");
});