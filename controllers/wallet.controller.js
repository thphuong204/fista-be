const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const walletController = {};
const { sendResponse, AppError } = require("../helpers/utils");
const { keywordQueryCheck, keywordBodyCheck } = require("../helpers/validateHelper");

// Create a new wallet
walletController.createWallet = async (req, res, next) => {
    try {
        if (!req.body) throw new AppError(400, "No request body", "Bad Request");
        
        // need to validate body before creating new wallet\
        const user = req.user;
        const {name, classification} = req.body;
        const createdWallet = await Wallet.create({user, name, classification});
        
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
    try {
        const acceptedFilterKeyArr = ["name", "page", "limit"];
        const {...filter} = req.query;
        keywordQueryCheck( filter, acceptedFilterKeyArr )
        
        filter.user = req.user;

        let total = await Wallet.countDocuments(filter);
        if (!total) {
        throw new AppError (404,"Wallet Not Found","Bad request")
        return
        }
        
        const page_number = Number.parseInt(req.query.page) || 1;
        let page_size = null;
        if (req?.query?.limit === "all") {
           page_size = total;
        } else {
           page_size = Number.parseInt(req.query.limit) || 20; 
        }
        
        //skip number
        let offset = page_size * (page_number - 1);
        const listOfWallets = await Wallet.find(filter)
          .sort({classification: 1, name: 1 })
          .skip(offset)
          .limit(page_size);

        let data = {total, page_size, page_number,  items: listOfWallets};

        sendResponse(res, 200, true, data, null, "");
    } catch (error) {
        next(error);
    }
}

// Get wallet by Id
walletController.getWalletById = async (req, res, next) => {
    try {
        if (!req.params._id)
          throw new AppError(400, "Wallet Id Not Found", "Bad Request");
        const { _id } = req.params;
        let user = req.user
    
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
    try {
        if (!req.body || !req.params._id) {
            throw new AppError(400, "Requiring body and id to update wallet", "Bad Request")
            return
        };
        
        const { _id } = req.params;
        const bodyToUpdate = req.body;
        let user = req.user;
        const walletById = await Wallet.find({user, _id});
        if (!walletById || (walletById.is_deleted?.toString() === "true")) {
          throw new AppError(400, "Wallet Not Found", "Bad Request")
          return
        }

        const editKeyArr = ["name", "classification"];
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
    try {
        if (!req.params._id) {
            throw new AppError(404, "Wallet Not Found", "Bad request")
            return
        }
        let user = req.user;
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