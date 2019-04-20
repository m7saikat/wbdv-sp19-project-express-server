const mongoose = require('mongoose');
const commentSchema  = mongoose.Schema(
    {
        createdByuser: {type:mongoose.Schema.Types.ObjectId, ref: 'userModel'},
        gif: {type:mongoose.Schema.Types.ObjectId, ref: 'gifModel'},
        text: String
   }, {collections: 'comments'});

module.exports = commentSchema;
