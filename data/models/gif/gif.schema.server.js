const mongoose = require('mongoose');
const gifSchema  = mongoose.Schema(
    { _id: Number,
        gifURl: String,
        gifTitle: String,
        likedByUsers: {type:Array, default:[], ref: 'UserModel'}
    }, {collections: 'gif'});

module.exports = gifSchema;