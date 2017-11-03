// This is used to include the mogoose module in the project //
var mongoose = require('mongoose');

// Declaring mongoose's schema in a variable //
var Schema = mongoose.Schema;

// Creating a schema //
var blogSchema = new Schema({
      
      // Here, required:true means, the value is required to be entered if we want to save data to database //
      // and type is used to define the type of data the schema should expect as an input for storing values in database //
      title           : {type:String,default:'',required:true}, 
      subTitle        : {type:String,default:''},
      blogBody        : {type:String,default:''},

      // Declaring array and manipulating the data in it accordingly //
      tags            : [],
      likes           : [],
      comments        : [],
      created         : {type:Date},
      lastModified    : {type:Date},
      // Declaring an object and passing/adding data in the form of key value pairs //
      authorInfo      : {}
});

// Create the schema in the form of model and keep it for further reference //
mongoose.model('Blog',blogSchema);