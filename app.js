const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const TokenManager = require("./routes/token_manager.js");
const mongoose = require("mongoose");


const Contact = require('./models/user');
const Balance = require('./models/balance');
const History = require('./models/historyoftst');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/views', express.static('views'));
app.set('views', './views');
app.set("view engine", "ejs");


//const uri = 'mongodb://localhost:27017/BankClicknext';
const uri = 'mongodb://mongo:27017/BankClicknext';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


const HomeRouter = require('./routes/home');
const MenuRouter = require('./routes/menu');
const DepositRouter = require('./routes/deposit');
const WithdrawRouter = require('./routes/withdraw');
const TransferRouter = require('./routes/transfer');
const HistoryRouter = require('./routes/history');

app.get("/", HomeRouter);

app.get("/login", HomeRouter);
app.post("/login", async function (req, res) {
    let val = 0;
    mongoose.connect(
        uri,
        { useNewUrlParser: true, useUnifiedTopology: true },
        async function (err, db) {
            try {
                Contact.find({}, function (err, result) {
                    //console.log(result);
                    if (err) throw err;
                    for (let i = 0; i < result.length; i++) {
                        if (req.body.email == result[i].Email && req.body.password == result[i].Password) {
                            let userID = result[i].UserID;
                            let accessToken = TokenManager.getGenerateAccessToken({ "id": userID });
                            val = 1;
                            res.json({ status: 200, message: 'login success', access_token: accessToken });
                            break;

                        } else {
                            val = 0;
                        }
                    }
                    //console.log(val);
                    if (val === 0) {
                        
                        res.json({status: 404 ,message: 'WrongEmail or Password'});
                    }
                })
            } catch (err) {
                throw err;
            }
        });


});
app.get("/menu", MenuRouter);
app.post("/menu", async function (req, res) {
    let jwtStatus = TokenManager.checkAuthentication(req);
    let datadb;
    let nowbl; //nowbalance of this user
    //console.log(req);
    // console.log(jwtStatus);
    if (jwtStatus != false) {
        Contact.find({}, function (err, result) {
            for (let i = 0; i < result.length; i++) {
                if (result[i].UserID == jwtStatus.id) {
                    datadb = result[i];
                    //console.log(result[i]);
                    Balance.find({}, function (err2, resba) {
                        if (err2) throw err2;
                        //console.log(resba);
                        for (let j = 0; j < resba.length; j++) {
                            if (result[i].UserID == resba[j].UserID) {
                                nowbl = resba[j].Balance;
                                bankacc = resba[j].bankaccountnumber;
                                //console.log(nowbl); 
                                res.json({ status: 200, datadb, nowbl,bankacc });
                                // console.log(resba[j].Balance);
                                break;
                            };
                        }
                    });
                    break;
                }
            }
        })
    } else {
        res.json({status: 404 ,message: 'Error with Token Or Time out Please Login again.'});
    }
});
app.get("/deposit", DepositRouter);
app.post("/deposit", async function (req, res) {
    // console.log(req.body.quantity); //deposit val
    let jwtStatus = TokenManager.checkAuthentication(req);
    if (jwtStatus != false) {
        Balance.find({}, function (err, resba) {
            if (err) throw err;
            //console.log(resba);
            for (let i = 0; i < resba.length; i++) {
                if (jwtStatus.id == resba[i].UserID) {
                    nowbl = resba[i].Balance;
                    // console.log(nowbl); 
                    if(parseInt(req.body.quantity, 10) < 0){
                        res.json({ status: 404, message: 'เงินติดลบน้าอย่ามาเหลี่ยมเยอะ'});
                        break;  
                    }else if(parseInt(req.body.quantity, 10) == 0){
                        res.json({ status: 404, message: 'ยอดโอนเป็น 0 ไม่สามารถถอนเงินได้งับ'});
                        break; 
                    }else{
                        sum = parseInt(nowbl, 10) + parseInt(req.body.quantity, 10);
                        // console.log(sum)
                        resba[i].Balance = sum;
                        resba[i].save();
                        res.json({ status: 200, message: 'Deposit Complete'});
                        break;  
                    }
                    
                };
            }
        });
        // console.log(jwtStatus.id);
    }else {
        res.json({status: 405 ,message: 'Error with Token Or Time out Please Login again.'});
    }
});

app.get("/withdraw", WithdrawRouter);
app.post("/withdraw", async function (req, res) {
    // console.log(req.body.quantity); //deposit val
    let jwtStatus = TokenManager.checkAuthentication(req);
    if (jwtStatus != false) {
        Balance.find({}, function (err, resba) {
            if (err) throw err;
            //console.log(resba);
            for (let i = 0; i < resba.length; i++) {
                if (jwtStatus.id == resba[i].UserID) {
                    nowbl = resba[i].Balance;
                    // console.log(nowbl); 
                    if(parseInt(req.body.quantity, 10) < 0){
                        res.json({ status: 404, message: 'เงินติดลบน้าอย่ามาเหลี่ยมเยอะ'});
                        break;  
                    }else if(parseInt(req.body.quantity, 10) == 0){
                        res.json({ status: 404, message: 'ยอดโอนเป็น 0 ไม่สามารถถอนเงินได้งับ'});
                        break; 
                    }
                    if (parseInt(req.body.quantity, 10) > parseInt(nowbl, 10)) {
                        res.json({ status: 404, message: 'Insufficient balance! Please try again.'});
                        //console.log("Insufficient balance");
                    } else if (parseInt(req.body.quantity, 10) <= parseInt(nowbl, 10)) {
                        sum = parseInt(nowbl, 10) - parseInt(req.body.quantity, 10);
                        resba[i].Balance = sum;
                        resba[i].save();
                        res.json({ status: 200, message: 'Withdraw Complete!'});
                    }
                    break;
                };
            }
        });
        // console.log(jwtStatus.id);
    }else {
        res.json({status: 405 ,message: 'Error with Token Or Time out Please Login again.'});
    }
});
app.get("/transfer", TransferRouter);
app.post("/transfer", async function (req, res) {
    // console.log(req.body.quantity); //deposit val
    let jwtStatus = TokenManager.checkAuthentication(req);
    let check = 0;
    let nameuser = " ";
    let nameother = " ";
    let posother;

    Balance.find({}, function (err, resba) {
        for (let i = 0; i < resba.length; i++) {
            if (req.body.Acc == resba[i].bankaccountnumber) {
                posother = resba[i].UserID;
                //console.log("one : "+posother); //correct la
            }
        }
    })

    Contact.find({}, function (err, result) {
        for (let i = 0; i < result.length; i++) {
            if (jwtStatus.id == result[i].UserID) {
                nameuser = result[i].Firstname;
            }
            if (posother == result[i].UserID) {
                nameother = result[i].Firstname;
            }
        }
    })
    Contact.find({}, function (err, result) {
        for (let i = 0; i < result.length; i++) {
            if (jwtStatus.id == result[i].UserID) {
                nameuser = result[i].Firstname;
            }
            if (posother == result[i].UserID) {
                nameother = result[i].Firstname;
            }
        }
    })
    Contact.find({}, function (err, result) {
        for (let i = 0; i < result.length; i++) {
            if (jwtStatus.id == result[i].UserID) {
                nameuser = result[i].Firstname;
            }
            if (posother == result[i].UserID) {
                nameother = result[i].Firstname;
            }
        }
    })
    Contact.find({}, function (err, result) {
        for (let i = 0; i < result.length; i++) {
            if (jwtStatus.id == result[i].UserID) {
                nameuser = result[i].Firstname;
            }
            if (posother == result[i].UserID) {
                nameother = result[i].Firstname;
            }
        }
    })
    if (jwtStatus != false) {
        Balance.find({}, function (err, resba) {

            let user = 0;
            let other = 0;
            let userbl;
            let otherbl;

            if (err) throw err;
            for (let i = 0; i < resba.length; i++) {
                //console.log(resba[i].bankaccountnumber); 
                if (jwtStatus.id == resba[i].UserID) {
                    user = i; //pos user
                    userbl = resba[i].Balance;

                }
                if (req.body.Acc == resba[i].bankaccountnumber) {
                    other = i; //pos other 
                    otherbl = resba[i].Balance;
                    check = 1;
                }
            }

            if (check == 0) {
                res.json({ status: 404, message: 'No have a account bank Please try again.'});
            } else if (check == 1) {
                if (resba[other].bankaccountnumber == resba[user].bankaccountnumber) {
                    res.json({ status: 404, message: 'Cant transfer to yourself Please try again.'});
                } else {
                    if(parseInt(req.body.Amount, 10) < 0){
                        res.json({ status: 404, message: 'เงินติดลบน้าอย่ามาเหลี่ยมเยอะ'});
                    }else if(parseInt(req.body.Amount, 10) == 0){
                        res.json({ status: 404, message: 'ยอดโอนเป็น 0 ไม่สามารถโอนเงินได้งับ'});
                    }else if (parseInt(req.body.Amount, 10) > parseInt(userbl, 10)) {
                        res.json({ status: 404, message: 'Insufficient balance! Please try again.'});
                    } else if (parseInt(req.body.Amount, 10) <= parseInt(userbl, 10)) {
                        sumUser = parseInt(userbl, 10) - parseInt(req.body.Amount, 10);
                        sumOther = parseInt(otherbl, 10) + parseInt(req.body.Amount, 10);
                        resba[user].Balance = sumUser;
                        resba[other].Balance = sumOther;
                        resba[user].save();
                        resba[other].save();

                        const date = new Date().toLocaleString();

                        History.create({
                            UserID: (user + 1),
                            Datetime: date,
                            User: nameuser,
                            Remain: sumUser,
                            Action: "Transfer",
                            From: nameother,
                            Amount: req.body.Amount
                        }, function (err, newDocument) {
                            if (err) {
                                console.error(err);
                            }
                        });
                        History.create({
                            UserID: (other + 1),
                            Datetime: date,
                            User: nameother,
                            Remain: sumOther,
                            Action: "Receive",
                            From: nameuser,
                            Amount: req.body.Amount
                        }, function (err, newDocument) {
                            if (err) {
                                console.error(err);
                            }
                        });
                        res.json({ status: 200, message: 'Transfer Complete!'});
                    }
                }


            }
        })
    }else {
        res.json({status: 405 ,message: 'Error with Token Or Time out Please Login again.'});
    }



});
app.get("/history", HistoryRouter);
app.post("/history", async function (req, res) {
    const Obj = [];
    let q = 0;
    let jwtStatus = TokenManager.checkAuthentication(req);
    //console.log("inin");
    if (jwtStatus != false) {
        History.find({}, function (err, result) {
            for (let i = 0; i < result.length; i++) {
                if(result[i].UserID == jwtStatus.id) {
                    //console.log(result[i])
                    Obj[q] = result[i];
                    q++ ;
                };
                
            };
            //console.log(Obj);
            res.json({ status: 200, Obj});
        });
    }else {
        res.json({status: 404 ,message: 'Error with Token Or Time out Please Login again.'});
    }
});
module.exports = app;