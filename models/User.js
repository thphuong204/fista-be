const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//Create schema
const userSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      require: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true
    },
    role: { 
      type: String, 
      enum: ["user", "admin"],
      required: false 
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

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "10h",
  });
  return accessToken;
};

//Create and export model
const User = mongoose.model("User", userSchema);
module.exports = User;