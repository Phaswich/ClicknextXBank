#How to Run?
```
    - Download and install MongoDB Community Server
    - Connect to Database (URI : mongodb://localhost:27017/)
    - $ git clone https://github.com/Phaswich/ClicknextXBank.git
    - $ cd ClicknextXBank
    - $ npm install
    - $ npm start
 ```
   <br>
   Go => http://localhost:3030/<br>
<br>

For Login<br>
<br>
     ====================<br>
        1. Email : Phaswich.sir@dome.tu.ac.th<br>
         Password : 12345<br>
         Bank Account number : 0001<br>
     ====================<br>
         2. Email : Sompong@gmail.com<br>
         Password : 12345<br>
         Bank Account number : 0002<br>
     ====================<br>
 <br>
Function<br> - Deposit (Complete) :ok_hand:<br>
         - Withdraw (Complete) :ok_hand:<br>
         - Transfer (Complete) :ok_hand:<br>
         - History (Complete) :ok_hand:<br>
         
*** If want to use Docker compose. <br>
You should change uri value in app.js in line 20 to const uri = 'mongodb://mongo:27017/BankClicknext';<br>
You should change uri value in setupDB.js in line 5 to const uri = 'mongodb://mongo:27017/';<br>***

***<br>
if you have Error like this : "connect ECONNREFUSED 127.0.0.1:27017" when you use "npm start"<br>
This way to fixit. <br>
- Go serch on your window<br>
- Search "Services"<br>
- Find MongoDB Server (MongoDB)<br>
- Then start it and try again.<br>



