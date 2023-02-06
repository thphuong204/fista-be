const express = require("express");
const router = express.Router();
const authentification = require("../helpers/authentication")

const {
    getReport
  } = require("../controllers/report.controller");


//READ
/**
    * @route GET /trans/?wallet=&category=&fromDate=&toDate=&page=1&limit=20
    * @description Get transactions of a wallet
    * @access Login required
  */
router.get(
  "/", 
  authentification.loginRequired,
  getReport
);



module.exports = router;