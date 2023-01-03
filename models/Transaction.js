const mongoose = require("mongoose");
//Create schema
const transactionSchema = mongoose.Schema(
  {
    wallet: { 
      type: mongoose.SchemaTypes.ObjectId,
      require: true
    },
    category: { 
      type: mongoose.SchemaTypes.ObjectId,
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