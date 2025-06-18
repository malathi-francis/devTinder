const cron = require('node-cron');
const { subDays,startOfDay,endOfDay, sub } = require('date-fns');
const sendEmail = require('./sendEmail');
const connectionRequestModel = require('../models/connectionRequest');

//sends email for all request received yesterday - every day at 8:00 AM
cron.schedule("0 8 * * *", async() => {
  try{
    console.log("Crob job called!!!!");
    
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
  
    const pendingRequests = await connectionRequestModel.find({
      status:"interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req)=> req.toUserId.email)),
    ];

    console.log("listOfEmails = ",listOfEmails);
    

    for(const email of listOfEmails){
      try{
      const res = await sendEmail.run(null,"Reminder!!",`<p>Hy ${email} come check you connection requests</p><p>Your connections are waiting for your approval!.<p/>`);
      console.log("response = ",res)
      } catch(err){
        console.error(err);
        
      }
    }
  } catch(err) {
    console.error(err);
    
  }
})