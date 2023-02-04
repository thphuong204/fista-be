const express = require("express");
const router = express.Router();
const authentification = require("../helpers/authentication");

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/user.controller");

// CREATE
/** 
    * @route POST /users
    * @description Create a new user
    * @body {name, email, password}
    * @access Login required

*/
router.post("/", createUser);

// READ
// Get all users
/**
    * @route GET /users
    * @description Get list of users
    * @access Login required
  */
router.get(
  "/", 
  authentification.loginRequired,
  getUsers
);

// READ
// Get user by id
/**
    * @route GET /users/:id
    * @description Get information about user
    * @access Login required
  */
router.get(
  "/:_id", 
  authentification.loginRequired,
  getUserById
);

// UPDATE
// Update user's information
/**
    * @route GET /users/:id
    * @description Update user's information
    * @body {name, password}
    * @access Login required
  */
router.put(
  "/:_id", 
  authentification.loginRequired,
  updateUser
);

//DELETE
/**
    * @route DELETE /users/:id
    * @description Delete a user
    * @access Login required
*/
router.delete(
  "/:_id", 
  authentification.loginRequired, 
  deleteUser
);


module.exports = router