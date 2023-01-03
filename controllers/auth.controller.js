const {
    AppError,
    catchErrAsync,
    sendResponse,
  } = require("../helpers/utils");
  const User = require("../models/User");
  const bcrypt = require("bcryptjs");
  const authController = {};
  
  authController.loginWithEmail = catchErrAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }, "+password");

    if (!user)
      return next(new AppError(400, "Invalid credentials", "Login Error"));
  
    const isMatch = async () => {
      bcrypt.compare(password, user.password);
    } 

    console.log("match", isMatch)
    if (!isMatch) return next(new AppError(400, "Wrong password", "Login Error"));
  
    accessToken = await user.generateToken();
    return sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Login successful"
    );
  });
  
  module.exports = authController;