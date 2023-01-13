const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const reportController = {};
const { sendResponse, AppError } = require("../helpers/utils");
const { keywordQueryCheck } = require("../helpers/validateHelper");

// Get report data

reportController.getReport = async (req, res, next) => {
    try {
      const acceptedFilterKeyArr = [
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
        wallet: tmpWallet,
        category: tmpCategory,
        fromDate: fromDate,
        toDate: toDate,
        amount: tmpAmount,
        description: tmpDescription,
      } = keywordQueryCheck(filter, acceptedFilterKeyArr);
  
      //mongoose support find with case insensitive
      if (tmpWallet) filter.wallet = { $regex: tmpWallet, $options: "i" };
      if (tmpCategory) filter.category = { $regex: tmpCategory, $options: "i" };
      if (tmpDescription) filter.description = { $regex: tmpDescription, $options: "i" };
  
      const page_number = req.query.page || 1;
      const page_size = req.query.limit || 20;
      //skip number
      let offset = page_size * (page_number - 1);
  
    //   MongoDb does the group by date
      const listOfTranss = await Trans.aggregate([
        {$match: filter},
        {$sort: { date: -1 }},
        {$skip :20},
        {$limit: 20},
        {$group: { _id: "$date", details: { $push: "$$ROOT" }}},
        {
          $addFields:
            {
              totalAmount : { $sum: "$details.amount" }
            }
        }
      ]);;
  
      console.log("listOfTranss", listOfTranss)
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