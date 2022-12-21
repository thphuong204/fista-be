const mongoose = require("mongoose");
//Create schema
const transactionSchema = mongoose.Schema(
  {
    wallet: { type: String, required: true },
    category: { type: String, enum: ["cash", "bank"], require: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

//Create and export model
const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;