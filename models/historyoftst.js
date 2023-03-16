const mongoose = require('mongoose');


const historySchema = new mongoose.Schema({
  UserID: String,
  Datetime: String,
  User: String,
  Remain: String,
  Action: String,
  From: String,
  Amount: String
});

module.exports = mongoose.model('history', historySchema)