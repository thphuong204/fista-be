const mongoose = require("mongoose");
//Create schema
const walletSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    classification: { 
      type: String, 
      enum: ["cash/bank", "asset", "receivable/liability"], 
      require: true 
    },
    currency: { 
      type: String, 
      default: "vnd"
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      require: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
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
const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;