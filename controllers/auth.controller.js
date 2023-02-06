const {
    AppError,
    catchErrAsync,
    sendResponse,
  } = require("../helpers/utils");
  const User = require("../models/User");
  const bcrypt = require("bcryptjs");
  const authController = {};
  
  authController.loginWithEmail = catchErrAsync(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });

      if (!user)
        return next(new AppError(400, "Invalid credentials", "Login Error"));
    
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new AppError(400, "Wrong password", "Login Error")
        return
      };
      
      user = await User.findOne({ email }, {"password": 0})
      accessToken = await user.generateToken();
      return sendResponse(
        res,
        200,
        true,
        { user, accessToken },
        null,
        "Login successful"
      );
    } catch (err) {
      next(err);
    }
  });
  
  module.exports = authController;