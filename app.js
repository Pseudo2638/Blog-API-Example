
// This is used to include the express module in the project //
var express = require('express');

// Intitalizing the express module as a function for further using it //
var app = express();

// These are third party middleware used for specific functionalities //
// They act as a layer // 
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var path = require('path');
var logger = require('morgan');

// This is used to include the mogoose module in the project //
var mongoose = require('mongoose');

// Intitalizing the third party middlewares //
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

app.use(logger('dev'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname + '/app/views'));


var fs = require('fs');

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


fs.readdirSync('./app/models').forEach(function(file){
   if(file.indexOf('.js')){
    require('./app/models/' + file);
   }
});

fs.readdirSync('./app/controllers').forEach(function(file){
   if(file.indexOf('.js')){
    var route = require('./app/controllers/' + file);
    route.controller(app);
   }
});

// 404 stands for 'status: not found' //
// So, if a user enter a wrong url, this function would get executed //
app.get('*',function(req,res,next){
  // Here, req is : request and res: is response //
  // Responce is send data to the browser and Request is used to get data //

   // Send response to the user //
   res.status = 404;

   // next() is an callback function  //
   // It is used to call an other function or display any message //
   // Callback function main concept is to not wait for above functions to execute, rather make them call at places we want //
   // Generally in this case used to throw an display error message to the user //
   next('You have mistyped the url. Please check.');
});

// This is an error handling middleware //
// This would take data error status from the above function using 'err' and alter the error message by display our custom message //
app.use(function(err,req,res,next){

   // Show message in the terminal (For developer's reference) //
   console.log('Our custom error handler was used !');
   // If the error status passed is 404 ie: url not found //
   if(res.status==404)
   {
    // Send response to the user //
    res.send('Oops ! I think you have landed on an wrong section section of the website. Please redirect to homepage.');
   }
   else
   {
    // Send error as response to the user //
    res.send(err);
   }
});


// This function is used to make our app listen on an particular port //
// So in order to use, //
// If on local computer and running local host: https://localhost:2000 is the url //
// If the app is online and on any domain: https://www.pseudo2638.github.io:2000 is the url //
app.listen(2000,function(){

  // Show in reponse when the app is run through terminal // 
    console.log('Port connection successfull, Our app is now active on port 2000 !');
});