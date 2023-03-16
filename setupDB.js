
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose");
//const uri = 'mongodb://mongo:27017/';
const uri = 'mongodb://localhost:27017';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
let check = 0;
const connectDB = async () => {
  


  MongoClient.connect(uri,options).then(async (client, err) => {
  if (err) throw err;
  console.log("Connected successfully to MongoDB server");
  //const connadmin = client.db('BankClicknext').admin();
  await client.connect();
  const db = client.db('admin');
  const adminDb = db.admin();
  const result = await adminDb.listDatabases();
  const databaseNames = result.databases.map(db => db.name);
  for(let i = 0 ; i < databaseNames.length ; i++){
    //console.log(databaseNames[i]);
    if(databaseNames[i]== 'BankClicknext'){
      check = 1 ;
    }
  }
    if(check == 1){
      console.log("Already have Database Just Go");
    }else{
      const dbo = client.db('BankClicknext');
    console.log("Database created successfully");
    const customers = [{
      UserID: "1",
      Title: "Mr.",
      Firstname: "Phaswich",
      Lastname: "Sirichantra",
      Email: "Phaswich.sir@dome.tu.ac.th",
      Password: "12345",
      Phonenumber: "0933270160"
    },{
      UserID: "2",
      Title: "Mr.",
      Firstname: "Sompong",
      Lastname: "Dmakmak",
      Email: "Sompong@gmail.com",
      Password: "12345",
      Phonenumber: "0000000000"

    }];

    dbo.collection("customers").insertMany(customers, function (err, res) {
      if (err) throw err;
    });

    const Balance = [{
      UserID: "1",
      bankaccountnumber:"0001",
      Balance: "0"
    },{
      UserID: "2",
      bankaccountnumber:"0002",
      Balance: "0"
    }];

    dbo.collection("balances").insertMany(Balance, function (err, res) {
      if (err) throw err;
    });

    console.log("setup database success!");
    }

   });

};
module.exports = connectDB;
