const mongoose = require("mongoose");
const User = require("../models/User");
const Trans = require("../models/Transaction");
const transController = {};
const { sendResponse, AppError } = require("../helpers/utils");

// Create a new transaction
transController.createTransaction = async (req, res, next) => {
  try {
    if (!req.body) throw new AppError(400, "No request body", "Bad Request");

    //need to verrify the transaction

    const createdTrans = await Trans.create(req.body);
    const id = createdTrans._id;
    const wallet = createdTrans.wallet;
    const category = createdTrans.category;
    const date = createdTrans.date;
    const amount = createdTrans.amount;
    const description = createdTrans.description;
    const is_deleted = createdTrans.is_deleted;
    const created_at = createdTrans.createdAt;
    const updated_at = createdTrans.updatedAt;

    sendResponse(
      res,
      200,
      true,
      {
        id,
        wallet,
        category,
        date,
        amount,
        description,
        is_deleted,
        created_at,
        updated_at,
      },
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
    const filterKeyArr = [
      "wallet",
      "category",
      "fromDate",
      "toDate",
      "amount",
      "description",
    ];
    const { ...filter } = req.query;

    const keywordArr = Object.keys(filter);
    keywordArr.forEach((keyword) => {
      if (!filterKeyArr.includes(keyword))
        throw new AppError(
          400,
          `query ${keyword} is not accepted`,
          "Bad request"
        );
      if (!filter[keyword]) delete filter[keyword];
    });

    const {
      wallet: tmpWallet,
      category: tmpCategory,
      fromDate: fromDate,
      toDate: toDate,
      amount: tmpAmount,
      description: tmpDescription,
    } = filter;

    filter.is_deleted = false;
    //mongoose support find with case insensitive
    if (tmpWallet) filter.wallet = { $regex: tmpWallet, $options: "i" };
    if (tmpCategory) filter.category = { $regex: tmpCategory, $options: "i" };
    if (tmpDescription)
      filter.description = { $regex: tmpDescription, $options: "i" };

    const page_number = req.query.page || 1;
    const page_size = req.query.limit || 10;
    //skip number
    let offset = page_size * (page_number - 1);

    const listOfTranss = await Trans.find(filter).skip(offset).limit(page_size);

    let total = await Trans.count(filter);
    if (!total) {
      throw new AppError(404, "Trans Not Found", "Bad request");
      return;
    }

    let data = { total, page_size, page_number, items: listOfTranss };

    sendResponse(res, 200, true, data, null, "");
  } catch (err) {
    next(err);
  }
};



// Updating transaction
//Initialize
transController.updateTransaction = async (req, res, next) => {
  console.log("Updating transaction");
  res.status(200).send("Updating transaction!");
};

// Delete transaction
//Initialize
transController.deleteTransaction = async (req, res, next) => {
  console.log("Delete transaction");
  res.status(200).send("Delete transaction!");
};

// Get transaction by id
//Initialize
transController.getTransactionById = async (req, res, next) => {
  console.log("getTransactionById");
  res.status(200).send("getTransactionById")
}

module.exports = transController;
