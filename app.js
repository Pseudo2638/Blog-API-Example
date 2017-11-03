
// This is used to include the express module in the project //
var express = require('express');

// Intitalizing the express module as a function for further using it //
var app = express();

// These are third party middleware used for specific functionalities //
// They act as a layer // 
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// This is used to include the mogoose module in the project //
var mongoose = require('mongoose');

// Intitalizing the third party middlewares //
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

// Defining the path of the mongodb database //
// Please note: it is saved by default in data/db folder //
// And, here myblogapp is the name of the database created //
// Mongodb(noSql) biggest advantage over SQL is that is highly flexible and it takes minimal amount of space on the disk //
var dbPath = 'mongodb://localhost/myblogapp';

// Making connection to the database for further database transactions //
db = mongoose.connect(dbPath);

// This is a mongoose inbuilt function which is used to open the connection to the database //
mongoose.connection.once('open',function(){

    // Show success message in the terminal //
	console.log('Good to go for database part also !')
});

// Including blog's model //
var blog = require('./blogModel.js');

// Converting the cutom written model by us which is declared above into a mongoose model //
var blogModel = mongoose.model('Blog');

// When '/' route is called //
// Please note, this is a GET Method //
// GET method is used to fetch data from an server/api/source //
app.get('/',function(req,res){
	// Here, req is : request and res: is reponse //
	// Responce is send data to the browser and Request is used to get data //
    res.send("Blog App Starting Point.");
});

// When '/blogs' route is called //
// Please note, this is a GET Method //
// GET method is used to fetch data from an server/api/source //
app.get('/blogs',function(req,res){
	// Here, req is : request and res: is reponse //
	// Responce is send data to the browser and Request is used to get data //

	// This finds the mongoose model inside the variable where we included our custom model //
    blogModel.find(function(err,result){
         if(err)
         {
         	// If error, error is thrown as a response //
         	res.send(err);
         }
         else
         {
         	// If success, success/result we get is sent //
         	// In this case the result is the whole model //
         	res.send(result);
         }
    });
});

// When '/blog/create' route is called //
// Please note, this is a POST Method //
// POST method is used to post/send data to an server/api/source //
app.post('/blog/create',function(req,res){
	// Here, req is : request and res: is reponse //
	// Responce is send data to the browser and Request is used to get data //

    // Here we create create the instance of the custom model we included and add data to it//
    var newBlog = new blogModel({
          title      : req.body.title,    // Request title from the server //
          subTitle   : req.body.subTitle, // Request sub title from the server //
          blogBody   : req.body.blogBody  // Request blog body from the server //
    });

    // Variable to store current date //
    // Pass the variable to the model //

    // For current date in the custom model //
    var today = Date.now();
    newBlog.created = today;

    // For current date in the custom model //
    var modifiedDate = Date.now();
    newBlog.lastModified = modifiedDate;

    
    // Here, we spilt the response recived from the request made using ',' as an seperator //
    // Pass the variable to the model //
    var allTags = (req.body.allTags != undefined && req.body.allTags != null)?req.body.allTags.split(','):'';
    newBlog.tags = allTags;

    var allLikes = (req.body.allLikes != undefined && req.body.allLikes != null)?req.body.allLikes.split(','):'';
    newBlog.likes = allLikes;

    var allComments = (req.body.allComments != undefined && req.body.allComments != null)?req.body.allComments.split(','):'';
    newBlog.comments = allComments;


    // Here, we create an object of key value pair and request the body values and add to the model //
    // Model is a SORT OF structure of database //
    var authorDetails = { fullName : req.body.authorFullName, email : req.body.authorEmail};
    newBlog.authorInfo = authorDetails;

    // This is an mongo db inbuilt function which is used to save the data in the database made through mongo db in data/db folder //
    newBlog.save(function(error){
          if(error)
          {
          	// If error, pass the error as the responce //
          	console.log(error);
          	res.send(error);
          } 
          else
          {
          	// If succes, save data and send data as response //
          	res.send(newBlog);
          }
    });

});


// When '/blog/:[paramter]' route is called //
// Please note, this is a POST Method //
// GET method is used to fetch data from an server/api/source //
app.get('/blogs/:id',function(req,res){
    // Here, req is : request and res: is reponse //
	// Responce is send data to the browser and Request is used to get data //

	// This is an inbuilt function of mongo db to find data according to the paramter //
	// Here, we find the blog according to the id provided as parameter //
    blogModel.findOne({'_id':req.params.id},function(err,result){
          if(err)
          {
          	// If error, send error as response //
          	res.send(err);
          	console.log(err);
          }
          else
          {
          	// If succes, send fetched data as response //
          	res.send(result);
          }
    });
});


// When '/blog/:[paramter]/edit' route is called //
// Please note, this is a PUT Method //
// PUT method is used to edit an existing data on an server/api/source //
// Please follow CRUD logic //
app.put('/blogs/:id/edit',function(req,res){
	// Here, req is : request and res: is reponse //
	// Responce is send data to the browser and Request is used to get data //

	// Storing the body[from body-parser] of the request to later refer in a paramter //
	var update = req.body;

	// Modify date //
    var modifiedDate = Date.now();
    var newBlog = new blogModel({
    });
    
    newBlog.lastModified = modifiedDate;


    // This is an inbuilt function of mongo db to find data according to the paramter and update it  //
	// Here, we find the blog according to the id provided as parameter and edit the data if condition is successfull //
	blogModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){
           if(err)
           {
           	// If error, send error as response //
           	console.log(err);
           	res.send(err);
           }
           else
           {
           	// If success, send result as an response //
           	res.send(result);
           }
	});
});

// When '/blog/:[paramter]/delete' route is called //
// Please note, this is a POST Method //
// Here, POST method is used as an DELETE method because it is preffered in industries //
app.post('/blogs/:id/delete',function(req,res){

	// This is an inbuilt function of mongo db to find data according to the paramter and remove/delete it  //
	// Here, we find the blog according to the id provided as parameter and remove/delete the data if condition is successfull //
    blogModel.remove({'_id':req.params.id},function(err,result){
           if(err)
           {
           	// If error, send error as response //
           	res.send(err);
           	console.log(err);
           }
           else
           {
           	// If success, delete according to the id passed in the paramter //
           	res.send(result);
           }
    });
});


// This function is used to make our app listen on an particular port //
// So in order to use, //
// If on local computer and running local host: https://localhost:2000 is the url //
// If the app is online and on any domain: https://www.pseudo2638.github.io:2000 is the url //
app.listen(2000,function(){

	// Show in reponse when the app is run through terminal // 
    console.log('Port connection successfull');
});
