const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const connectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

userRouter.get('/user/get/request/received',userAuth,async (req,res) => {
  let loggedInUser = req.user;
  const getRequests = await connectionRequestModel.find({
    toUserId:loggedInUser._id,
    status: 'interested'
  }).populate("fromUserId",["firstName","lastName","age","photoUrl","gender","about"]);

  if(!getRequests) {
    return res.status(400).send("no requests yet.")
  };

  res.json({
    requests: getRequests
  });
});

userRouter.get('/user/get/connections',userAuth,async (req,res) => {
  let loggedinUser = req.user;
  const connectionRequest = await connectionRequestModel.find({
    $or:[
      {fromUserId:loggedinUser,status:'accepted'},
    {toUserId:loggedinUser,status:'accepted'}]
  }).populate("fromUserId",["firstName","lastName","age","photoUrl","gender","about"]).populate("toUserId",["firstName","lastName","age","photoUrl","gender","about"]);

let data = connectionRequest.map(row=>{
  if(row.fromUserId._id.toString() === loggedinUser._id.toString()){
    return row.toUserId;
  }
  return row.fromUserId;
});
  res.json({
    data:data
  })
});


userRouter.get('/feed',userAuth,async(req,res) => {
  try{
  let loggedInUser = req.user;
  let limit = parseInt(req?.query?.limit) ?? 10;
  limit = limit > 50 ? 50 : limit;
  let page = parseInt(req?.query?.page) ?? 1;
  let skip = (page-1)*limit;

  const connectionRequest = await connectionRequestModel.find({
    $or :[
      {fromUserId: loggedInUser},
      {toUserId: loggedInUser}
    ]
  });
  console.log({connectionRequest});
  
  const hideUserIds = new Set();
  connectionRequest.forEach((req)=>{
    hideUserIds.add(req.fromUserId.toString());
    hideUserIds.add(req.toUserId.toString());
  });

  const data = await User.find({
    $and: [
      {_id: {$nin: Array.from(hideUserIds)}},
      {_id: {$ne: loggedInUser._id}}
    ]
  }).select("firstName lastName age photoUrl gender skills").skip(skip).limit(limit);
  console.log("data = ",data);
  if(!data) return res.status(400).send("no daa found");

  res.json({
    data:data
  });

} catch(err) {
  return res.status(400).send("failed to view feed! "+ err.message);
};

});

module.exports = userRouter;