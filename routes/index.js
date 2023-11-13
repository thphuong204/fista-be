const { sendResponse, AppError}=require("../helpers/utils.js")
var express = require('express');
var router = express.Router();

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

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

// reportApi
const reportAPI = require('./report.api');
router.use('/report', reportAPI)

module.exports = router;
