const { sendResponse, AppError}=require("../helpers/utils.js")
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Welcome to CoderSchool!")
});

const userAPI = require('./users.api');
router.use('/users',userAPI);

const transAPI = require('./transs.api');
router.use('/transs', transAPI)

module.exports = router;
