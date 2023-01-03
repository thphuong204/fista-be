const mongoose = require("mongoose");
const User = require("../models/User");
const userController = {};
const { sendResponse, AppError } = require("../helpers/utils");
const users_role_array = ["user", "admin"];

// Create a new user
userController.createUser = async ( req, res, next ) => {
    console.log("createUser");
    try {
        if (!req.body) throw new AppError(400, "No request body", "Bad Request");
    
        const createdUser = await User.create(req.body);
        const noPasswordCreatedUser = await User.find({},{"password": 0})
        console.log("createdUser", createdUser)
        console.log("noPasswordCreatedUser", noPasswordCreatedUser)
        
        sendResponse(
          res,
          200,
          true,
          noPasswordCreatedUser,
          null,
          ""
        );
      } catch (err) {
        next(err);
      }
};

// Get all users
userController.getUsers = async ( req, res, next ) => {

    const filterKeyArr = ["name", "email"];
    const filter = req.query;
    const page_number = req.query.page || 1;
    const page_size = req.query.limit || 10; 

    const keywordArr = Object.keys(filter);
    keywordArr.forEach((keyword) => {
      if (!filterKeyArr.includes(keyword))
        throw new AppError(400, `query ${keyword} is not accepted`, "Bad request");
      if (!filter[keyword]) delete filter[keyword];
    });

    let total = await User.count(filter);
    if (!total) {
      throw new AppError (404,"User Not Found","Bad request")
      return
    }

    //skip number
    let offset = page_size * (page_number - 1);
    const listOfUsers = await User.find(filter, {"password": 0}).skip(offset).limit(page_size);

    let data = {total, page_size, page_number,  items: listOfUsers};

    sendResponse(res, 200, true, data, null, "");
};

// Get user by id,
userController.getUserById = async (req, res, next) => {
    try {
        if (!req.params._id)
          throw new AppError(400, "User Id Not Found", "Bad Request");
        const { _id } = req.params;
    
        const userById = await User.findById(_id, {"password": 0});
        if (!userById || (userById.is_deleted.toString() === "true")) {
          throw new AppError(400, "User Not Found", "Bad Request")
          return
        }
        sendResponse(res, 200, true, userById, null, "");
      } catch (error) {
        next(error);
      }
};

// Update user
userController.updateUser = async (req, res, next) => {
    try {
        if (!req.body || !req.params._id) {
            throw new AppError(400, "Requiring body and id to update user information", "Bad Request")
            return
        };
        
        const { _id } = req.params;
        const bodyToUpdate = req.body;
    
        const userById = await User.findById(_id, {"password": 0});
        if (!userById || (userById.is_deleted.toString() === "true")) {
          throw new AppError(400, "User Not Found", "Bad Request")
          return
        }

        const editKeyArr = ["name", "password"];
        const keywordArray = Object.keys(bodyToUpdate);
        keywordArray.forEach((keyword) => {
            if (!editKeyArr.includes(keyword))
              throw new AppError(400,`Keyword ${keyword} is not accepted. Only 'name' or 'password' are accepted for updating`,"Bad request");
            if (!bodyToUpdate[keyword]) delete bodyToUpdate[keyword];
        });

        const options = { new: true };
        const updatedUser = await User.findByIdAndUpdate(_id, bodyToUpdate, options).select({"password": 0});
        if (!updatedUser) {
            throw new AppError(404, "User Not Found", "Bad request")
            return
        };

        sendResponse(res, 200, true, updatedUser, null, "");
      } catch (error) {
        next(error);
      }
};

// Delete user
userController.deleteUser = async (req, res, next) => {
    try {
        if (!req.params._id) {
            throw new AppError(404, "User Not Found", "Bad request")
            return
        }
        const { _id } = req.params;
        const options = { new: true };

        //only delete user not yet deleted
        const idFoundCheck = await User.findById(_id)
        if (!idFoundCheck || (idFoundCheck.is_deleted.toString() === "true")) {
        throw new AppError(404,"User Not Found","Bad Request")
        return
        }

        const deletedUser = await User.findByIdAndUpdate(
            _id,
            { is_deleted: true },
            options
        );

        sendResponse(
            res,
            200,
            true,
            deletedUser,
            null,
            ""
          );

    } catch (error) {
        next(error);
    }
};

module.exports = userController;