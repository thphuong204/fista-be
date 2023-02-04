const express = require("express");
const router = express.Router();
const authentification = require("../helpers/authentication")

const {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
  } = require("../controllers/trans.controller");

//CREATE
/** 
    * @route POST /transs
    * @description Create a new transaction
    * @body {user, wallet, category, date, amount, currency, description}
    * @access Login required

*/

router.post(
  "/", 
  authentification.loginRequired,
  createTransaction
);

//READ
/**
    * @route GET /trans/?wallet=&category=&fromDate=&toDate=&page=1&limit=20
    * @description Get transactions of a wallet
    * @access Login required
  */
router.get(
  "/", 
  authentification.loginRequired,
  getTransactions
);


//READ
/**
  * @route GET api/trans/:id
  * @description
  * @allowedUpdates : {
  * 
  * }
  */
router.get(
  "/:_id", 
  authentification.loginRequired, 
  getTransactionById
);

//UPDATE
/**
    * @route PUT /transaction/:id
    * @description Update a transaction
    * body {wallet, category, date, amount, description}
    * @access Login required
*/
router.put(
  "/:_id", 
  authentification.loginRequired,
  updateTransaction
);

//DELETE
/**
    * @route DELETE /transaction/:id
    * @description Delete a transaction
    * @access Login required
*/
router.delete(
  "/:_id", 
  authentification.loginRequired,
  deleteTransaction
);

module.exports = router;