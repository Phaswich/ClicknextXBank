const mongoose = require('mongoose');


const BalanceSchema = new mongoose.Schema({
    UserID: String,
    bankaccountnumber: String,
    Balance: String
});

module.exports = mongoose.model('balances', BalanceSchema )