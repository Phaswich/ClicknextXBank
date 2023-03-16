const app = require("./app");
const connectDB = require('./setupDB.js');


connectDB();


const port = 3030 ;
app.listen(port, () => {
  console.log("Server is up listening on port: " + port); 
});

