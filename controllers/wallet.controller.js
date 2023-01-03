const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const walletController = {};
const { sendResponse, AppError } = require("../helpers/utils");

// Create a new wallet
walletController.createWallet = async (req, res, next) => {
    console.log("createWallet");
    try {
        if (!req.body) throw new AppError(400, "No request body", "Bad Request");
        
        // need to validate body before creating new wallet
        const createdWallet = await Wallet.create(req.body);
        
        sendResponse(
          res,
          200,
          true,
          createdWallet,
          null,
          ""
        );
      } catch (err) {
        next(err);
      }
}

// Get all wallets
walletController.getWallets = async (req, res, next) => {
    console.log("getWallet")
    try {
        const filterKeyArr = ["user", "name"];
        const filter = req.query;
        const page_number = req.query.page || 1;
        const page_size = req.query.limit || 20; 

        const keywordArr = Object.keys(filter);
        keywordArr.forEach((keyword) => {
        if (!filterKeyArr.includes(keyword))
            throw new AppError(400, `query ${keyword} is not accepted`, "Bad request");
        if (!filter[keyword]) delete filter[keyword];
        });

        let total = await Wallet.count(filter);
        if (!total) {
        throw new AppError (404,"Wallet Not Found","Bad request")
        return
        }

        //skip number
        let offset = page_size * (page_number - 1);
        const listOfWallets = await Wallet.find(filter).skip(offset).limit(page_size);

        let data = {total, page_size, page_number,  items: listOfWallets};

        sendResponse(res, 200, true, data, null, "");
    } catch (error) {
        next(error);
    }
}

// Get wallet by Id
walletController.getWalletById = async (req, res, next) => {
    console.log("getWalletById");
    try {
        if (!req.params._id)
          throw new AppError(400, "Wallet Id Not Found", "Bad Request");
        const { _id } = req.params;
    
        const walletById = await Wallet.findById(_id);
        if (!walletById || (walletById.is_deleted?.toString() === "true")) {
          throw new AppError(400, "Wallet Not Found", "Bad Request")
          return
        }
        sendResponse(res, 200, true, walletById, null, "");
    } catch (error) {
        next(error);
    }
}

// Update wallet
walletController.updateWallet = async (req, res, next) => {
    console.log("updateWallet");
    try {
        if (!req.body || !req.params._id) {
            throw new AppError(400, "Requiring body and id to update wallet", "Bad Request")
            return
        };
        
        const { _id } = req.params;
        const bodyToUpdate = req.body;
    
        const walletById = await Wallet.findById(_id);
        if (!walletById || (walletById.is_deleted?.toString() === "true")) {
          throw new AppError(400, "Wallet Not Found", "Bad Request")
          return
        }

        const editKeyArr = ["name", "status"];
        const keywordArray = Object.keys(bodyToUpdate);
        keywordArray.forEach((keyword) => {
            if (!editKeyArr.includes(keyword))
              throw new AppError(400,`Keyword ${keyword} is not accepted. Only 'name' or 'status' are accepted for updating`,"Bad request");
            if (!bodyToUpdate[keyword]) delete bodyToUpdate[keyword];
        });

        const options = { new: true };
        const updatedWallet = await Wallet.findByIdAndUpdate(_id, bodyToUpdate, options);
        if (!updatedWallet) {
            throw new AppError(404, "Wallet Not Found", "Bad request")
            return
        };

        sendResponse(res, 200, true, updatedWallet, null, "");
      } catch (error) {
        next(error);
      }
}

// Delete wallet
walletController.deleteWallet = async (req, res, next) => {
    console.log("deleteWallet");
    try {
        if (!req.params._id) {
            throw new AppError(404, "Wallet Not Found", "Bad request")
            return
        }
        const { _id } = req.params;
        const options = { new: true };

        //only delete wallet not yet deleted
        const idFoundCheck = await Wallet.findById(_id)
        if (!idFoundCheck || (idFoundCheck.is_deleted?.toString() === "true")) {
        throw new AppError(404,"Wallet Not Found","Bad Request")
        return
        }

        const deletedWallet = await Wallet.findByIdAndUpdate(
            _id,
            { is_deleted: true },
            options
        );

        sendResponse(
            res,
            200,
            true,
            deletedWallet,
            null,
            ""
          );

    } catch (error) {
        next(error);
    }
}

module.exports = walletController;