const mongoose = require("mongoose");
//Create schema
const walletSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: [cash, bank], require: true },

  },
  {
    timestamps: true,
  }
);

//Create and export model
const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;