const mongoose = require("mongoose");
const User = require("../models/User");
const userController = {};
const { sendResponse, AppError } = require("../helpers/utils");
const users_role_array = ["user", "admin"];

userController.createUser = async (req, res, next) => {
    console.log("createUser");
};