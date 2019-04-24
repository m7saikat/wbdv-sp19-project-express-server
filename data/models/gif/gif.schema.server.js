const mongoose = require('mongoose');
const gifSchema  = mongoose.Schema(
    {   gifURl: String,
        gifTitle: String,
        likedByUsers: [],
        createdBy : {type: mongoose.Schema.Types.ObjectId},
    }, {collections: 'gif'});

module.exports = gifSchema;
