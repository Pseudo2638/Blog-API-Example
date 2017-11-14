
var mongoose = require('mongoose');
var express = require('express');

var app = express();

// Using an node module for creating unique id for blogs //
var uniqid = require('uniqid');


// Converting the cutom written model by us which is declared above into a mongoose model //
var blogModel = mongoose.model('Blog');

var blogRouter = express.Router();

var responseGenerator = require('./../../libs/responseGenerator');

module.exports.controller = function(app){

  // When '/' route is called //
// Please note, this is a GET Method //
// GET method is used to fetch data from an server/api/source //
blogRouter.get('/',function(req,res){
  // Here, req is : request and res: is reponse //
  // Responce is send data to the browser and Request is used to get data //
    res.send("Blog App Starting Point.");
});

// When '/blogs' route is called //
// Please note, this is a GET Method //
// GET method is used to fetch data from an server/api/source //
blogRouter.get('/allBlogs',function(req,res){
  // Here, req is : request and res: is response //
  // Responce is send data to the browser and Request is used to get data //

  // This finds the mongoose model inside the variable where we included our custom model //
    blogModel.find(function(err,result){
         if(err)
         {
          // If error, error is thrown as a response //
          var errorResponse = responseGenerator.generate(true,"Some error occured.",500,null);
          res.send(errorResponse);
         }
         else
         {
          // If success, success/result we get is sent //
          // In this case the result is the whole model //
          var successResponse = responseGenerator.generate(false,"All blogs.",200,result);
          res.send(successResponse);
         }
    });
});

// When '/blog/create' route is called //
// Please note, this is a POST Method //
// POST method is used to post/send data to an server/api/source //
blogRouter.post('/blog/create',function(req,res){
  // Here, req is : request and res: is response //
  // Responce is send data to the browser and Request is used to get data //
  if(req.body.title != undefined && req.body.subTitle != undefined && req.body.blogBody != undefined && req.body.authorFullName != undefined && req.body.authorEmail != undefined)
  {
      // Here we create create the instance of the custom model we included and add data to it//
    var newBlog = new blogModel({
          blogId     : uniqid(),
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
            var errorResponse = responseGenerator.generate(true,"Some error occured",500,null);
            res.send(errorResponse);
          } 
          else
          {
            // If succes, save data and send data as response //
            var successResponse = responseGenerator.generate(false,"Blog successfully created.",200,newBlog);
            res.send(successResponse);
          }
    });
  }
  else
  {
     var errorResponse = responseGenerator.generate(true,"Some feilds which were required was found empty while creating the blog",500,null);
     res.send(errorResponse);
  }

});


// When '/blog/:[paramter]' route is called //
// Please note, this is a POST Method //
// GET method is used to fetch data from an server/api/source //
blogRouter.get('/blog/:id',function(req,res){
    // Here, req is : request and res: is response //
  // Responce is send data to the browser and Request is used to get data //

  // This is an inbuilt function of mongo db to find data according to the paramter //
  // Here, we find the blog according to the id provided as parameter //
    blogModel.findOne({'blogId':req.params.id},function(err,result){
          if(result)
          {
            // If success, send fetched data as response //
            var successResponse = responseGenerator.generate(false,"Blog found.",200,result);
            res.send(successResponse);
          }
          else
          {
            // If error, send error as response //
            var errorResponse = responseGenerator.generate(true,"Blog not found. Please check the id",500,null);
            res.send(errorResponse);
            
            
          }
    });
});


// When '/blog/:[paramter]/edit' route is called //
// Please note, this is a PUT Method //
// PUT method is used to edit an existing data on an server/api/source //
// Please follow CRUD logic //
blogRouter.put('/blog/:id/edit',function(req,res){
  // Here, req is : request and res: is response //
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
  blogModel.findOneAndUpdate({'blogId':req.params.id},update,function(err,result){
           if(result)
           {
            // If success, send result as an response //
            var successResponse = responseGenerator.generate(false,"Blog successfully updated.",200,result);
            res.send(successResponse);
           }
           else
           {
            // If error, send error as response //
            var errorResponse = responseGenerator.generate(true,"Blog not found. Please check the id",500,null);
            res.send(errorResponse);
           }
  });
});

// When '/blog/:[paramter]/delete' route is called //
// Please note, this is a POST Method //
// Here, POST method is used as an DELETE method because it is preffered in industries //
blogRouter.post('/blog/:id/delete',function(req,res){

  // This is an inbuilt function of mongo db to find data according to the paramter and remove/delete it  //
  // Here, we find the blog according to the id provided as parameter and remove/delete the data if condition is successfull //
    blogModel.remove({'_id':req.params.id},function(err,result){
           if(err)
           {
            // If error, send error as response //
            var errorResponse = responseGenerator.generate(true,"Blog not found. Please check the id",500,null);
            res.send(errorResponse);
           }
           else
           {
            // If success, delete according to the id passed in the paramter //
            var successResponse = responseGenerator.generate(false,"Blog successfully deleted.",200,result);
            res.send(successResponse);
           }
    });
});

  app.use('/v1/blogAPI',blogRouter);

}

