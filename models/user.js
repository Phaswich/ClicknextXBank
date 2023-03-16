const mongoose = require('mongoose');


const customerSchema = new mongoose.Schema({
  UserID: String,
  Title: String,
  Firstname: String,
  Lastname: String,
  Email: String,
  Password: String,
  Phonenumber: String
});

module.exports = mongoose.model('customers', customerSchema)