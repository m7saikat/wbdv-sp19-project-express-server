const mongoose = require('mongoose');
const commentSchema  = mongoose.Schema(
    { _id: Number,
        user: {type:Number, ref: 'userModel'},
        // gif: {type:Number, ref: 'gifModel'},
       // likes: [],
       // comments: []
        text
   }, {collections: 'comments'});

module.exports = commentSchema;