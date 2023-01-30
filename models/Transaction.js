const mongoose = require("mongoose");
//Create schema
const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    wallet: { 
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Wallet',
      require: true
    },
    category: { 
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
      require: true
    },
    date: { 
      type: Date, 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    currency: {
      type: String,
      default: "vnd"
    },
    description: { 
      type: String, 
      required: true 
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

//Create and export model
const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;