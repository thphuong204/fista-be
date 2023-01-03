const { sendResponse, AppError}=require("../helpers/utils.js")
var express = require('express');
var router = express.Router();

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Welcome to CoderSchool!")
});

// userApi
const userAPI = require('./users.api');
router.use('/users',userAPI);

// walletApi
const walletAPI = require('./wallets.api');
router.use('/wallets',walletAPI);

//categoryApi
const categoryAPI = require('./categories.api');
router.use('/categories',categoryAPI);

// transApi
const transAPI = require('./transs.api');
router.use('/transs', transAPI)

module.exports = router;
