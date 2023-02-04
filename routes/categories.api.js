const express = require("express");
const router = express.Router();
const authentification = require("../helpers/authentication");

const {
    createCategory,
    getCategories, 
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controllers/category.controller");

//CREATE
/** 
    * @route POST /categories
    * @description Create a new category
    * @body {name, classification, wallet_type}
    * @access Login required, role Admin required

*/
router.post(
    "/", 
    authentification.loginRequired,
    createCategory
);


// READ
// Get all categories
/**
    * @route GET /categories
    * @description Get list of categories
    * @access Login required
  */
router.get(
    "/", 
    authentification.loginRequired,
    getCategories
);

//READ
/**
  * @route GET api/categories/:id
  * @description
  * @allowedUpdates : {
  * 
  * }
  */
router.get(
    "/:_id", 
    authentification.loginRequired,
    getCategoryById
);

//UPDATE
/**
    * @route PUT /categories/:id
    * @description Update a category
    * body {name, classification, wallet_type}
    * @access Login required, role Admin required
*/
router.put(
    "/:_id",
    authentification.loginRequired, 
    updateCategory
);

//DELETE
/**
    * @route DELETE /categories/:id
    * @description Delete a category
    * @access Login required, role Admin required
*/
router.delete(
    "/:_id", 
    authentification.loginRequired,
    deleteCategory
);

module.exports = router;