var express = require("express"); // call express to be used by the application.
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');
var fs = require('fs');
app.set("view engine", "jade");


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var mysql = require('mysql'); // access to sql


app.use(express.static("scripts"));  // allow the app access the scripts folder contents
app.use(express.static("images"));   // allow the app access the images folder contents
app.use(express.static("models"));

// function to set up a simple hello response 

var reviews = require("./models/reviews.json")

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
let sql = 'INSERT INTO products (Name, Price, Image, Category) VALUES ("Maluku Quad Fish", 560, "qalukuquad.jpg", "Surfboards");'
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

//create page
app.get('/create', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.render('create', {root: VIEWS});
  console.log("Now you are creating a product");
});


//create post request
app.post('/create', function(req, res){
  var name = req.body.name
  let sql = 'INSERT INTO products (Name, Price, Image, Category) VALUES ("'+name+'", '+req.body.price+', "'+req.body.image+'", "'+req.body.category+'");'
  let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  console.log(name)
  
  
});
  
res.render('index', {root: VIEWS});
 
});


//Edit product
app.get('/edit/:id', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'
  let query = db.query(sql, (err, res1) =>{
    if(err)
    throw(err);

  res.render('edit', {root: VIEWS, res1}); // use render command  to render HTML page
  
});
  console.log("You are now veiwing the edit product page!!");
});


//
app.post('/edit/:id', function(req, res){
let sql = 'UPDATE products SET Name = "'+req.body.newname+'", Price = "'+req.body.newprice+'", Category = "'+req.body.newcategory+'", Image = "'+req.body.newimage+'" WHERE Id = "'+req.params.id+'";'
let query = db.query(sql, (err, res) =>{
 if(err) throw err;
 console.log(res);
 
})

res.redirect("/item/" + req.params.id);

});


 // function to delete database adta based on button press and form
app.get('/delete/:id', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 let sql = 'DELETE FROM products WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.redirect('/products'); // use the render command so that the response object renders a HHTML page
  
 });
 
 console.log("Its Gone!");
});


// JSON from here on
app.get('/reviews', function(req, res){
  res.render("reviews", {reviews:reviews})
  
});
console.log("reviews on show")


//route to render add json page

app.get('/add', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.render('add', {root: VIEWS});
  console.log("Now you are reviewing");
});

//end json


// JSON REVIEW
app.post('/add', function(req, res){
	var count = Object.keys(reviews).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);
	
	// This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
	
	function getMax(reviews , id) {
		var max
		for (var i=0; i<reviews.length; i++) {
			if(!max || parseInt(reviews[i][id]) > parseInt(max[id]))
				max = reviews[i];
			
		}
		return max;
	}
	
	var maxPpg = getMax(reviews, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
	
	// create a new product based on what we have in our form on the add page 
	
	var review = {
		name: req.body.name, // name called from the add.jade page textbox
		id: newId, // this is the variable created above
		content: req.body.content, // content called from the add.jade page textbox

	};
		console.log(review) // Console log the new product 
	var json  = JSON.stringify(reviews); // Convert from object to string
	
	// The following function reads the json file then pushes the data from the variable above to the reviews JSON file. 
	fs.readFile('./models/reviews.json', 'utf8', function readFileCallback(err, data){
							if (err){
		throw(err);
	 }else {
		reviews.push(review); // add the information from the above variable
		json = JSON.stringify(reviews, null , 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 
		fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
		
	}});
	res.redirect("/reviews")
});

// End JSON

//Page to render edit reviews
app.get('/editreviews/:id', function(req, res){
  
  function chooseProd(indOne){
    return indOne.id === parseInt(req.params.id)
  }
  
  console.log("id of this review is " + req.params.id);
  
  var indOne = reviews.filter(chooseProd);
  
  res.render('editreview', {indOne:indOne});
  
  console.log("Edit Review PAge ");
  
});


//end render review

//Create post request to edit the individual reviews


app.post('/editreviews/:id', function(req, res){
         var json = JSON.stringify(reviews);
  
  var keyToFind = parseInt(req.params.id);
  
  var data = reviews;
  
  var index = data.map(function(review){review.id}).keyToFind //use the param passed in the URL as a pointer to find the correct review to edit
  
  var x = req.body.name;
  var y = req.body.content;
  var z = parseInt(req.params.id)
  
  reviews.splice(index, 1, {name: req.body.name, content: y, id: z});
  
  json = JSON.stringify(reviews, null, 4);
  
  fs.writeFile('./models/reviews.json', json, 'utf8');
  
  res.redirect("/reviews");
  
         });

//end post request to edit the individual reviews

//DELETEc REVIEW

app.get('/deletereview/:id', function(req, res){
 var json = JSON.stringify(reviews);
 
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 
 var data = reviews;
 
 var index = data.map(function(d){d['id'];}).indexOf(keyToFind)
 
 reviews.splice(index, 1);
 
 json = JSON.stringify(reviews, null, 4);
 fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
 res.redirect("/reviews");
 
});

//Search Function

app.post('/search', function(req, res){
 
 let sql = 'SELECT * FROM products WHERE name LIKE "%'+req.body.search+'%";'
 let query = db.query(sql, (err,res1) =>{
  if(err)
  throw(err);
 // res.redirect("/error")
  
  res.render('products', {root: VIEWS, res1});
  console.log("search complete")
 });

 
});

//search




// We need to set the requirements for teh application to run

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
  console.log("App is Running ......... Yessssssssssssss!")
});