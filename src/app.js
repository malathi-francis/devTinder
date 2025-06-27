const express = require("express");
const connectDb = require('./config/database');
const app = express();
const User = require('./models/user');
const {validateSignupData} = require('./utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const user = require("./models/user");
const {userAuth} = require('./middlewares/auth');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');
const paymentRouter = require("./routes/payment");
const initializeSocket = require('./utils/socket')
const http = require("http");
const cors = require("cors");
const chatRouter = require("./routes/chat");

require('dotenv').config();

require("./utils/cronJob");


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);
app.use('/',paymentRouter);
app.use('/',chatRouter);

app.get('/user',async(req,res)=>{
  try{
    const userEmail = req.body.email;
    const user = await User.find({email:userEmail});
    if(user.length == 0) res.status(404).send("user not found");
    else res.send(user)
  } catch(err){
    res.status(400).send("error while getting users");
  }
});

app.get('/all',async(req,res)=>{
  try{
    const userEmail = req.body.email;
    const user = await User.find({});
    if(user.length == 0) res.status(404).send("user not found");
    else res.send(user)
  } catch(err){
    res.status(400).send("error while getting users");
  }
});

app.delete('/user',async(req,res)=>{
  const userId = req.body.userId;
  try{
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  }catch(err){
    res.status(400).send("error while deleting users");
  }
});

app.patch('/user',async(req,res)=>{
  const userId = req.body.userId;
  const data = req.body;
  try{
    const allowedUpdateKeys = ['firstName','lastName','age','skills','about','photoUrl'];

    const filter = Object.fromEntries(Object.entries(data).filter(([key]) => allowedUpdateKeys.includes(key)));    
    const user = await User.findByIdAndUpdate(userId,filter,
      {returnDocument:"after",
    runValidators:true}); // this run will enable the validators we gave in model file
    
    res.send("User updation Success");
  }catch(err){
    res.status(400).send("error while updating users" + err);
  }
});

const server = http.createServer(app);
initializeSocket(server);

connectDb()
.then(()=>{
  console.log("DB connected successfully");
  server.listen(process.env.PORT, '0.0.0.0',() =>{
    console.log("server successfully connected to port 3000");
  });
})
.catch((err)=>{
  console.error("DB connection failed",err);
});

// app.get('/me',(req,res) => {
//   res.send("get call check")
// });
// app.use('/me',(req,res) => {
//   res.send("use call check")
// });
// app.use('/app',(req,res) =>{
//   res.send("data for this page shown here!")
// });
// app.use('/',(req,res) => {
//   res.send("first page of the application");
// });

//playing with the routes
// app.get('/ab?c',(req,res)=>{
//   res.send("b is optional in the route")
// });
// app.post('/ab+c',(req,res)=>{
//   res.send("b can be added infinitely")
// });
// app.post('./a(bc)+d',(req,res)=>{
//   res.send("bc together can be used infinitley")
// });



// app.get('/get',(req,res)=>{
//   try{
//     throw new Error("new Error");
//     res.send("new error")
//   } catch(err){
//     res.status(500).send("catch block error")
//   }
// });
// app.use('/',(err,req,res,next)=>{
//   res.status(500).send("Error in here");
// });

