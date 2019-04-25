const mongoose = require('mongoose');
const commentSchema  = mongoose.Schema(
    {
        createdByuser: {type:mongoose.Schema.Types.ObjectId},
        // gif: {type:mongoose.Schema.Types.ObjectId, ref: 'gifModel'},
        gif: String,
        text: String
   }, {collections: 'comments'});

module.exports = commentSchema;
