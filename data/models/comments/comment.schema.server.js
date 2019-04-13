const mongoose = require('mongoose');
const commentSchema  = mongoose.Schema(
    { _id: Number,
        user: {type:Number, ref: 'userModel'},
        // gif: {type:Number, ref: 'gifModel'},
        text: String
   }, {collections: 'comments'});

module.exports = commentSchema;
