const express = require("express");
const router = express.Router();
const authentification = require("../helpers/authentication");

const {
    createWallet,
    getWallets,
    getWalletById,
    updateWallet,
    deleteWallet
} = require("../controllers/wallet.controller");

// CREATE
/** 
* @route POST /wallets
* @description Create a new wallet
* body {name, classification, currency, user}
* @access Login required
*/
router.post(
  "/", 
  authentification.loginRequired,
  createWallet
);

// READ
// Get all wallets
/**
    * @route GET /wallets
    * @description Get list of wallets
    * @access Login required
  */
router.get(
  "/", 
  authentification.loginRequired,
  getWallets
);

// READ
// Get wallet by id
/**
    * @route GET /wallets/:id
    * @description Get information about wallet
    * @access Login required
  */
router.get(
  "/:_id", 
  authentification.loginRequired,
  getWalletById
);

// UPDATE
// Update wallet's information
/**
    * @route GET /wallets/:id
    * @description Update user's information
    * @body {name, status}
    * @access Login required
  */
router.put(
  "/:_id", 
  authentification.loginRequired,
  updateWallet
);

//DELETE
/**
    * @route DELETE /wallets/:id
    * @description Delete a wallet
    * @access Login required
*/
router.delete(
  "/:_id", 
  authentification.loginRequired,
  deleteWallet
);

module.exports = router