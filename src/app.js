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
app.listen(3000,() =>{
  console.log("server successfully connected to port 3000");
});