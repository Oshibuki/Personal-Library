/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require("mongoose")
var Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
var {Book, Comment} = require("../models/book")

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(MONGODB_CONNECTION_STRING, {useNewUrlParser: true});


module.exports = function (app) {

    app.route('/api/books')
        .get(async function (req, res) {
            //response will be array of book objects
            //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
            try {
                var books = await Book.find({},"_id title commentcount")
                res.json(books);
            } catch (e) {
                res.send(e.message)
            }
        })

        .post(async function (req, res) {
            try {
                var title = req.body.title;
                var schema = {
                    title: Joi.string().min(1).max(255).required()
                }
                var {error} = Joi.validate(req.body, schema)
                if (error) {
                    return res.send("invalid title")
                }
                //response will contain new book object including atleast _id and title
                var book = await Book.create({"title": title})
                return res.json(book);
            } catch (e) {
                res.send(e.message)
            }

        })

        .delete(async function (req, res) {
            //if successful response will be 'complete delete successful'
            try {
                var result = await Book.deleteMany({});
            } catch (e) {
                res.send(e.message)
            }
        });


    app.route('/api/books/:id')
        .get(async function (req, res) {
            try {
                var bookid = req.params.id;
                var schema = {
                    id: Joi.objectId().required()
                }
                var {error} = Joi.validate({id:bookid}, schema)
                if (error) {
                    return res.send("invalid id")
                }

                var book = await Book.findById(bookid, "_id title comments")
                if (!book) {
                    return res.send("not found book")
                }
                res.json(book)
                //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

            } catch (e) {
                res.send(e.message)
            }
        })

        .post(async function (req, res) {
                try {
                    var bookid = req.params.id;
                    var comment = req.body.comment;
                    var schema = {
                        id: Joi.objectId().required(),
                        comment: Joi.string().min(1).max(255).required()
                    }
                    var {error} = Joi.validate({id:bookid,comment:comment}, schema)
                    if (error) {
                        return res.send("invalid params")
                    }
                    //json res format same as .get
                    var book = await Book.findById(bookid);
                    book.comments.push(new Comment({comment}))
                    book.commentcount = book.comments.length;
                    var updatedBook = await book.save("_id title comments")
                    res.json(updatedBook)
                } catch (e) {
                    res.send(e.message)
                }
            }
        )

        .delete(async function (req, res) {
            try {
                var bookid = req.params.id;
                var schema = {
                    id: Joi.objectId().required()
                }
                var {error} = Joi.validate({id:bookid}, schema)
                if (error) {
                    return res.send("invalid id")
                }
                //if successful response will be 'delete successful'
                var result = await Book.findByIdAndDelete(bookid)
                res.send(result);
            }catch (e) {
                res.send(e.message)
            }

        });

}
;
