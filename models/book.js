var mongoose = require("mongoose")


var commentSchema = new mongoose.Schema({
    comment:{
        type:String,
        required:true,
        minlength:1,
        maxlength:255
    }
});

var Comment = new mongoose.model("Comment",commentSchema)

var bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlength:1,
        maxlength:255
    },
    comments:[commentSchema],
    commentcount:{
        type:Number,
        required:true,
        default:0
    }
})
var Book = new mongoose.model("Book",bookSchema)

module.exports = {Book:Book,Comment:Comment}