const mongoose = require("mongoose");
const Category = require("../models/Category");
const categoryController = {};
const { sendResponse, AppError } = require("../helpers/utils");

// Create a new category by Admin
categoryController.createCategory = async (req, res, next) => {
  try {
    if (!req.body) throw new AppError(400, "No request body", "Bad Request");

    //need to validate body before creating a new category
    const createdCategory = await Category.create(req.body);

    sendResponse(
      res,
      200,
      true,
      createdCategory,
      null,
      ""
    );
  } catch (err) {
    next(err);
  }
};

// Get all categories by User, Admin
categoryController.getCategories = async (req, res, next) => {
    try {
        const data = await Category.find()
        sendResponse(res, 200, true, data, null, "");
    } catch (error) {
        next(error)
    }
}

// Get category by Id by User, Admin
categoryController.getCategoryById = async (req, res, next) => {
    try {
        if (!req.params._id)
        throw new AppError(400, "User Id Not Found", "Bad Request");
        const { _id } = req.params;
    
        const categoryById = await Category.findById(_id, {"password": 0});
        if (!categoryById || (categoryById.is_deleted?.toString() === "true")) {
            throw new AppError(400, "User Not Found", "Bad Request")
            return
        }
        sendResponse(res, 200, true, categoryById, null, "");
    } catch (error) {
        next(error)
    }
}

// Updating category by Admin
categoryController.updateCategory = async (req, res, next) => {
    try {
        if (!req.body || !req.params._id) throw new AppError(400, "Requiring body and id to update category information", "Bad Request");
        const { _id } = req.params;
        const bodyToUpdate = req.body;

        const editKeyArr = ["name", "classification", "wallet_type"];
        const keywordArray = Object.keys(bodyToUpdate);
        keywordArray.forEach((keyword) => {
            if (!editKeyArr.includes(keyword))
              throw new AppError(400,`Keyword ${keyword} is not accepted. Only 'name', 'classification' or 'wallet_type'are accepted for updating`,"Bad request");
            if (!bodyToUpdate[keyword]) delete bodyToUpdate[keyword];
        });


        const categoryById = await Category.findById(_id);
        if (!categoryById || (categoryById.is_deleted?.toString() === "true")) {
          throw new AppError(400, "Category Not Found", "Bad Request")
          return
        }

        const options = { new: true };

        const updatedCategory = await Category.findOneAndUpdate(_id, bodyToUpdate, options)

        sendResponse(res, 200, true, updatedCategory, null, "");
    } catch (error) {
        next(error)
    }
}

// Delete category by Admin
categoryController.deleteCategory = async (req, res, next) => {
    try {
        if (!req.params._id) throw new AppError(400, "Requiring id to delete category information", "Bad Request");
        const { _id } = req.params;
        const options = { new: true };

        //only delete user not yet deleted
        const idFoundCheck = await Category.findById(_id)
        if (!idFoundCheck || (idFoundCheck.is_deleted?.toString() === "true")) {
        throw new AppError(404,"User Not Found","Bad Request")
        return
        }

        const deletedCategory = await User.findByIdAndUpdate(
            _id,
            { is_deleted: true },
            options
        );

        sendResponse(
            res,
            200,
            true,
            deletedCategory,
            null,
            ""
        );

    } catch (error) {
        next(error)
    }
}

module.exports = categoryController;