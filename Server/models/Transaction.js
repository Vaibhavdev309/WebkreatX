const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  intentId: {
    type: String,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
  charge: Number,
  paidBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paidTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  unitCost: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  codeVerified: {
    type: Boolean,
    default: false,
  },
  rideCancelled: {
    type: Boolean,
    default: false,
  },
  rideId: {
    type: Schema.Types.ObjectId,
    ref: "AvailableRide",
  },
  paidBack: {
    payoutId: String,
    amount: Number,
    created: Date,
    arrival_date: Date,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;