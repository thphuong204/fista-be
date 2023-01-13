const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const transController = {};
const { sendResponse, AppError } = require("../helpers/utils");
const { keywordQueryCheck, keywordBodyCheck } = require("../helpers/validateHelper");

// Create a new transaction
transController.createTransaction = async (req, res, next) => {
  try {
    if (!req.body) throw new AppError(400, "No request body", "Bad Request");

    //need to verrify the transaction

    const createdTrans = await Transaction.create(req.body);

    sendResponse(
      res,
      200,
      true,
      createdTrans,
      null,
      ""
    );
  } catch (err) {
    next(err);
  }
};

// Get all transactions
transController.getTransactions = async (req, res, next) => {
  try {
    const acceptedFilterKeyArr = [
      "user",
      "wallet",
      "category",
      "fromDate",
      "toDate",
      "amount",
      "description",
      "page",
      "limit"
    ];
    const filter = req.query;

    const {
      user: tmpUser,
      wallet: tmpWallet,
      category: tmpCategory,
      fromDate: fromDate,
      toDate: toDate,
      amount: tmpAmount,
      description: tmpDescription,
    } = keywordQueryCheck (filter, acceptedFilterKeyArr);

    //mongoose support find with case insensitive
    if (tmpUser) filter.user = { $regex: tmpUser, $options: "i" };
    if (tmpWallet) filter.wallet = { $regex: tmpWallet, $options: "i" };
    if (tmpCategory) filter.category = { $regex: tmpCategory, $options: "i" };
    if (tmpDescription) filter.description = { $regex: tmpDescription, $options: "i" };

    const page_number = req.query.page || 1;
    const page_size = req.query.limit || 20;
    //skip number
    let offset = page_size * (page_number - 1);

    const listOfTranss = await Transaction.find(filter).sort({ date: -1 }).skip(offset).limit(page_size);

    let total = await Transaction.count(filter);
    if (!total) {
      throw new AppError(404, "Transaction Not Found", "Bad request");
      return;
    }

    let data = { total, page_size, page_number, items: listOfTranss };

    sendResponse(res, 200, true, data, null, "");
  } catch (err) {
    next(err);
  }
};

// Get transaction by id
//Initialize
transController.getTransactionById = async (req, res, next) => {
  console.log("getTransactionById");
  try {
    if (!req.params._id)
      throw new AppError(400, "Transaction Id Not Found", "Bad Request");
    const { _id } = req.params;

    const transactionById = await Transaction.findById(_id, {"password": 0});
    if (!transactionById || (transactionById.is_deleted?.toString() === "true")) {
      throw new AppError(400, "Transaction Not Found", "Bad Request")
      return
    }
    sendResponse(res, 200, true, transactionById, null, "");
  } catch (error) {
    next(error);
  }
}

// Updating transaction
//Initialize
transController.updateTransaction = async (req, res, next) => {
  console.log("Updating transaction");
  try {
    if (!req.body || !req.params._id) {
        throw new AppError(400, "Requiring body and id to update transaction", "Bad Request")
        return
    };
    
    const { _id } = req.params;
    const bodyToUpdate = req.body;

    const transactionById = await Transaction.findById(_id, {"password": 0});
    if (!transactionById || (transactionById.is_deleted?.toString() === "true")) {
      throw new AppError(400, "Transaction Not Found", "Bad Request")
      return
    }

    const acceptedFilterKeyArr = ["category", "amount", "date", "description"];

    keywordBodyCheck(bodyToUpdate, acceptedFilterKeyArr);

    const options = { new: true };
    const updatedTransaction = await Transaction.findByIdAndUpdate(_id, bodyToUpdate, options);
    if (!updatedTransaction) {
        throw new AppError(404, "Transaction Not Found", "Bad request")
        return
    };

    sendResponse(res, 200, true, updatedTransaction, null, "");
  } catch (error) {
    next(error);
  }
};

// Delete transaction
//Initialize
transController.deleteTransaction = async (req, res, next) => {
  console.log("Delete transaction");
  try {
    if (!req.params._id) {
        throw new AppError(404, "Transaction Not Found", "Bad request")
        return
    }
    const { _id } = req.params;
    const options = { new: true };

    //only delete transaction not yet deleted
    const idFoundCheck = await Transaction.findById(_id)
    if (!idFoundCheck || (idFoundCheck.is_deleted?.toString() === "true")) {
    throw new AppError(404,"Transaction Not Found","Bad Request")
    return
    }

    const deletedTransaction = await Transaction.findByIdAndUpdate(
        _id,
        { is_deleted: true },
        options
    );

    sendResponse(
        res,
        200,
        true,
        deletedTransaction,
        null,
        ""
      );

  } catch (error) {
      next(error);
  }
};



module.exports = transController;
