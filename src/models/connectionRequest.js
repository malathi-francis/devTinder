const { default: mongoose, connection } = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
  fromUserId : {
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref: "User"
  },
  toUserId : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref: "User"

  },
  status :{
    type: String,
    required:true,
    enum: {
      values: ["ignored","accepted","interested","rejected"],
      message: '{VALUE} is not supported'
    }
  }
},{
  timestamps : true
});

const connectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = connectionRequestModel;