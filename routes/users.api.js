const express = require("express");
const router = express.Router();

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/user.controller");

// CREAT
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
router.get("/", getUsers);

// READ
// Get user by id
/**
    * @route GET /users/:id
    * @description Get information about user
    * @access Login required
  */
router.get("/:_id", getUserById);

// UPDATE
// Update user's information
/**
    * @route GET /users/:id/?name=Phuong&password=123
    * @description Update user's information
    * @access Login required
  */
router.put("/:_id", updateUser);

//DELETE
/**
    * @route DELETE /users/:id
    * @description Delete a user
    * @access Login required
*/
router.delete("/:_id", deleteUser);


module.exports = router