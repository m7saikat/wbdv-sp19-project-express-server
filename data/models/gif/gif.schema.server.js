const mongoose = require('mongoose');
const gifSchema  = mongoose.Schema(
    {   gifURl: String,
        gifTitle: String,
        likedByUsers: {type:Array, default:[], ref: 'UserModel'}
    }, {collections: 'gif'});

module.exports = gifSchema;
