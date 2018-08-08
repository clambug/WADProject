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


//Create DB Table
app.get('/createtable', function (req, res){
let sql = 'CREATE TABLE products(id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar (255), Price int, Image varchar(255), Category varchar(255));'
let query = db.query(sql,(err,res)=>{
if (err) throw err;
console.log(res);
  
  
});
  res.send("table created!")
        
        
});



//End Create Table


// SQL Insert DataView

app.get('/insert', function (req, res){
let sql = 'INSERT INTO products (Name, Price, Image, Category) VALUES("Maluku Quad Fish", 560, "qalukuquad.jpg", "Surfboards");'
let query = db.query(sql,(err,res)=>{
if (err) throw err;
console.log(res);
  
  
});
  res.send("Item created!")
        
        
});



// SQL insert end


// SQL Query

app.get('/querydata', function (req, res){
let sql = 'SELECT * FROM products'
let query = db.query(sql,(err,res)=>{
if (err) throw err;
console.log(res);
  
  
});
  res.send("Check The Console")
        
        
});



// SQL Query end


app.get('/', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.render('index', {root: VIEWS});
  console.log("Now you are home!");
});

//PRoduct Page

app.get('/products', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  let sql = 'SELECT * FROM products;'
  let query = db.query(sql, (err, res1) =>{
    if(err)
    throw(err);

  res.render('products', {root: VIEWS, res1}); // use render command  to render HTML page
  
});
  console.log("Now you are at the products page!");
});
//end product page


//item Page

app.get('/item/:id', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'
  let query = db.query(sql, (err, res1) =>{
    if(err)
    throw(err);

  res.render('item', {root: VIEWS, res1}); // use render command  to render HTML page
  
});
  console.log("You are now veiwing a product!!");
});


//end item page

// We need to set the requirements for teh application to run

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
  console.log("App is Running ......... Yessssssssssssss!")
});