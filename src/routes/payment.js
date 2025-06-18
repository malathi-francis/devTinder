const express = require('express');
const paymentRouter = express.Router();
const Razorpay = require('razorpay');
const razorpayInstance = require('../utils/razorPay');
const Payment = require('../models/payment');
const { userAuth } = require('../middlewares/auth');
const { membershipAmount } = require('../utils/constants');
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const User = require('../models/user');

paymentRouter.post('/payment/create',userAuth,async(req,res)=>{
try{
  const {membershipType} = req.body;
  const {firstName,lastName,email} = req.user;

  const order = await razorpayInstance.orders.create({
    amount: membershipAmount[membershipType] * 100,
    currency: "INR",
    receipt:"receipt#!",
    notes: {
      firstName,
      lastName,
      email,
      membershipType: membershipType,
    }
  });
console.log("order = ",order);

const payment = new Payment({
  userId: req.user._id,
  orderId: order.id,
  status: order.status,
  amount: order.amount,
  currency: order.currency,
  receipt: order.receipt,
  notes:order.notes
});
const saveedPayment = await payment.save();
res.json({ ...saveedPayment.toJSON(),keyId : process.env.RAZORPAY_KEY_ID}); 


} catch(err){
  return res.status(500).json({msg: err.message});
}
});

paymentRouter.post("/payment/webhook",async(req,res)=>{
  try{
    console.log("webhook called!!");
    
    const webhookSignature = req.get("x-razorpay-signature");
  const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);

  if(!isWebhookValid) return res.status(400).json({msg:"Webhook signature is invalid"});

  const paymentDetails = req.body.payload.payment.entity;

  const payment = await Payment.findOne({ orderId:paymentDetails.order_id});
  payment.status = paymentDetails.status;
  await payment.save();
console.log("payment success = ",payment);

  const user = await User.findOne({_id: payment.userId});
  user.isPremium = true;
  user.membershipType = payment.notes.membershipType;
  await user.save();
console.log("user = ",user);

  if(req.body.event == "payment.captured"){

  }
  }catch(err){
    return res.status(500).json({msg:err.message});
  }

});

module.exports = paymentRouter;