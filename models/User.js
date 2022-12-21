const mongoose = require("mongoose");
//Create schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, required: true}
  },
  {
    timestamps: true,
  }
);

//Create and export model
const User = mongoose.model("User", userSchema);
module.exports = User;