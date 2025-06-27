const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  paymentId: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  receipt: {
    type: String,
    required: true,
  },
  notes: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    membershipType: {
      type: String
    },
  }
}, {
  timestamps: true
});

const paymentModel = mongoose.model("Paymnet", paymentSchema);

module.exports = paymentModel;