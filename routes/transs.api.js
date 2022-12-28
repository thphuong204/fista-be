const express = require("express");
const router = express.Router();

const {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
  } = require("../controllers/trans.controller");

//CREAT
/** 
    * @route POST /trans
    * @description Create a new transaction
    * @body {wallet, category, date, amount, description}
    * @access Login required

*/

router.post("/", createTransaction);

//READ
/**
    * @route GET /trans/?wallet=&category=&fromDate=&toDate=&page=1&limit=20
    * @description Get transactions of a wallet
    * @access Login required
  */
router.get("/", getTransactions);


//READ
/**
  * @route GET api/trans/:id
  * @description
  * @allowedUpdates : {
  * 
  * }
  */
router.get("/:id", getTransactionById);

//UPDATE
/**
    * @route PUT /transaction/:id
    * @description Update a transaction
    * body {wallet, category, date, amount, description}
    * @access Login required
*/
router.put("/:id", updateTransaction);

//DELETE
/**
    * @route DELETE /transaction/:id
    * @description Delete a transaction
    * @access Login required
*/
router.delete("/:id", deleteTransaction);

module.exports = router;