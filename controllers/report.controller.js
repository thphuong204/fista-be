const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const reportController = {};
const { sendResponse, AppError } = require("../helpers/utils");
const { keywordQueryCheck } = require("../helpers/validateHelper");
const { ObjectId } = require('bson');

// Get report data

reportController.getReport = async (req, res, next) => {
  const user =  new ObjectId(req.user)
    try {
      const acceptedFilterKeyArr = [
        "wallet",
        "fromDate",
        "toDate"
      ];
      const {...filter} = req.query;
      const {
        wallet: tmpWallet,
        fromDate: fromDate,
        toDate: toDate,
      } = keywordQueryCheck(filter, acceptedFilterKeyArr);
      console.log("req", req.user)
      let groupByMonth = [];
      let groupByWeek = [];
      let groupByCategory = [];
      let total = null
      console.log("filter after", filter)
      if (filter?.wallet) {
        //   MongoDb does the group by date
        groupByMonth = await Transaction.aggregate([
          {$match: {
            "user": user,
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
            totalAmount: {"$sum": "$amount"}
          }}
        ]);

        groupByWeek = await Transaction.aggregate([
          {$match: {
            "user": user,
            "wallet": filter.wallet,
            "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
            "is_deleted" : false
          }},
          {$sort: { date: -1 }},
          {$set: { week: {"$week":"$date"} }},
          {$group: {
            "_id": {
              month: "$week",
              category: "$category"
            },
            totalAmount: {"$sum": "$amount"}
          }}
        ]);

        groupByCategory = await Transaction.aggregate([
        {"$match": {
          "user": user,
          "wallet": filter.wallet,
          "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
          "is_deleted" : false
        }},
        {"$sort": { "date": -1 }},
        {"$group": { 
          _id: "$category", 
          numOfTrans: { "$sum": 1 }, 
          totalAmount: {"$sum": "$amount"}
        }}
      ]);

        total = await Transaction.count({
          "user": user,
          "wallet": filter.wallet,
          "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
          "is_deleted" : false
        });
  
      } else {
        console.log("else")
        groupByMonth = await Transaction.aggregate([
          {$match: {
            "user": user,
            "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
            "is_deleted" : false
          }},
          {$sort: { date: -1 }},
          {$set: { month: {"$month": "$date"} }},
          {$group: {
            _id: "$month",
            transactions: {$push: "$$ROOT"},
            totalAmount: {$sum: "$amount"}
          }}
        ]);

        groupByWeek = await Transaction.aggregate([
          {$match: {
            "user": user,
            "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
            "is_deleted" : false
          }},
          {$sort: { date: -1 }},
          {$set: { week: {"$week":"$date"} }},
          {$group: {
            _id:"$week",
            transactions: {$push: "$$ROOT"},
            totalAmount: {$sum: "$amount"}
          }}
        ]);

        groupByDay = await Transaction.aggregate([
          {$match: {
            "user": user,
            "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
            "is_deleted" : false
          }},
          {$sort: { date: -1 }},
          {$set: { day: {"$dayOfYear":"$date"} }},
          {$group: {
            _id:"$day",
            transactions: {$push: "$$ROOT"},
            totalAmount: {$sum: "$amount"}
          }}
        ]);

        groupByCategory = await Transaction.aggregate([
        {"$match": {
          "user": user,
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
          "user": user,
          "date": {"$gte": new Date(filter.fromDate),"$lte": new Date(filter.toDate)},
          "is_deleted" : false
        });
        console.log("groupByMonth", groupByMonth)
      }
    
      if (!total) {
        throw new AppError(404, "Transaction Not Found", "Bad request");
        return;
      }

      let data = { total, groupByMonth, groupByWeek, groupByDay, groupByCategory };
  
      sendResponse(res, 200, true, data, null, "");
    } catch (err) {
      next(err);
    }
};

module.exports = reportController;
