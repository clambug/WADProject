var express = require("express"); // call express to be used by the application.
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');

app.set("view engine", "jade");

var mysql = require('mysql'); // access to sql

app.use(express.static("scripts"));  // allow the app access the scripts folder contents
app.use(express.static("images"));   // allow the app access the images folder contents

// function to set up a simple hello response 

const db = mysql.createConnection({
  
  host: 'den1.mysql4.gear.host',
  user: 'peakdb1',
  password: 'Ic18_AG0~g8H',
  database: 'peakdb1'
  
});

db.connect((err) => {
  if(err){
    console.log("Database Connection Error")
   // throw(err)  // Un comment this to throw the error rather than just log "You broke it"
  }
  else{
  
  console.log("Database Connected!!")
  }
});



app.get('/', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.render('index', {root: VIEWS});
  console.log("Now you are home!");
});

app.get('/products', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.render('products', {root: VIEWS}); // use render command  to render HTML page
  console.log("Now you are at the products page!");
});


// We need to set the requirements for teh application to run

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
  console.log("App is Running ......... Yessssssssssssss!")
});