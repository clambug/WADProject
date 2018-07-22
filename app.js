var express = require("express"); // call express to be used by the application.
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');

app.set('view engine', 'jade');

app.use(express.static("scripts"));  // allow the app access the scripts folder contents
app.use(express.static("images"));   // allow the app access the images folder contents

// function to set up a simple hello response 

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