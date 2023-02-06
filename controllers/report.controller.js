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
        "toDate"
      ];
      const {...filter} = req.query;
      const {
        wallet: tmpWallet,
        category: tmpCategory,
        fromDate: fromDate,
        toDate: toDate,
      } = keywordQueryCheck(filter, acceptedFilterKeyArr);
      

      console.log("filter", filter)
      let groupByMonth = null;
      let groupByWeek = null;
      let groupByCategory = null;
      let total = null

      if (filter?.wallet) {
        //   MongoDb does the group by date
        groupByMonth = await Transaction.aggregate([
          {$match: {
            "user": req.user,
            "wallet": filter.wallet,
            "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
            "is_deleted" : false
          }},
          {$sort: { date: -1 }},
          {$set: { month: {"$month": "$date"} }},
          {$group: {
            _id: {
              month: "$month",
              category: "$category"
            },
            totalAmount: {$sum: "amount"}
          }}
        ]);

        groupByWeek = await Transaction.aggregate([
          {$match: {
            "user": req.user,
            "wallet": filter.wallet,
            "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
            "is_deleted" : false
          }},
          {$sort: { date: -1 }},
          {$set: { week: {"$week":"$date"} }},
          {$group: {
            _id: {
              month: "$week",
              category: "$category"
            },
            totalAmount: {$sum: "amount"}
          }}
        ]);

        groupByCategory = await Transaction.aggregate([
        {"$match": {
          "user": req.user,
          "wallet": filter.wallet,
          "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
          "is_deleted" : false
        }},
        {"$sort": { "date": -1 }},
        {"$group": { 
          _id: "$category", 
          numOfTrans: { $sum: 1 }, 
          totalAmount: {$sum: "$amount"}
        }}
      ]);

        total = await Transaction.count({
          "user": req.user,
          "wallet": filter.wallet,
          "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
          "is_deleted" : false
        });
  
      } else {
        groupByMonth = await Transaction.aggregate([
          {$match: {
            "user": req.user,
            "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
            "is_deleted" : false
          }},
          {$sort: { date: -1 }},
          {$set: { month: {"$month": "$date"} }},
          {$group: {
            _id: {
              month: "$month",
              category: "$category"
            },
            totalAmount: {$sum: "amount"}
          }}
        ]);

        groupByWeek = await Transaction.aggregate([
          {$match: {
            "user": req.user,
            "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
            "is_deleted" : false
          }},
          {$sort: { date: -1 }},
          {$set: { week: {"$week":"$date"} }},
          {$group: {
            _id: {
              month: "$week",
              category: "$category"
            },
            totalAmount: {$sum: "amount"}
          }}
        ]);

        groupByCategory = await Transaction.aggregate([
        {"$match": {
          "user": req.user,
          "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
          "is_deleted" : false
        }},
        {"$sort": { "date": -1 }},
        {"$group": { 
          _id: "$category", 
          numOfTrans: { $sum: 1 }, 
          totalAmount: {$sum: "$amount"}
        }}
      ]);

        total = await Transaction.count({
          "user": req.user,
          "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
          "is_deleted" : false
        });
      }
    
      if (!total) {
        throw new AppError(404, "Transaction Not Found", "Bad request");
        return;
      }

      let data = { groupByMonth, groupByWeek, groupByCategory };
  
      sendResponse(res, 200, true, data, null, "");
    } catch (err) {
      next(err);
    }
};

module.exports = reportController;
