const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const connectionRequestModel = require('../models/connectionRequest');
const sendEmail = require('../utils/sendEmail');

requestRouter.post('/request/:status/:toUserId',userAuth,async(req,res) => {
  try{
  let allowedStatus = ['interested','ignored'];
  if(!allowedStatus.includes(req.params.status)) throw new Error("invalid status");

  let fromUserId = req.user.id;
  let toUserId = req.params.toUserId;
  let status = req.params.status;

  const toUser = await User.findById(toUserId);
  if(!toUser) res.status(400).send("user not found to send request!");
  if(fromUserId == toUserId) res.status(400).send("cannot send request to same id");
  const connectionRequestData = new connectionRequest({
    fromUserId,
    toUserId,
    status
  });
const findEmail = await User.findById(toUserId);

  let data = await connectionRequestData.save();

  if(status == "interested") {
    let mailContent = `<p>"Hi ${findEmail.firstName}, ${req.user.firstName} wants to connect with you."</p>`
  const emailRes = await sendEmail.run(findEmail.email,"A friend Request to you!!",mailContent);

  };
  

  res.json({
    message: "connection success",
    data
  });
} catch(err) {
  res.status(400).send("connection failed: "+ err.message);
};
});

requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res) => {
try{
  
  let loggedInUser = req.user;
  let requestId = req.params.requestId;
  let status = req.params.status;

  let allowedStatus = ['accepted','rejected'];

  if(!allowedStatus.includes(status)) {
    return res.status(400).send("status no valid");
  };

  const connectionRequest = await connectionRequestModel.findOne({
    _id: requestId,
    toUserId: loggedInUser._id,
    status : 'interested'
  });

  if(!connectionRequest){
    return res.status(400).send("no data found");
  };
  connectionRequest.status = status;

  let data = await connectionRequest.save();

  res.json({
    message:"review successfull",
    data: data
  });
} catch(err){
  return res.status(400).send("err while reviewing - " + err.message);
};
});

module.exports = requestRouter;