const mongoose = require('mongoose');
const gifSchema  = mongoose.Schema(
    {   gifURl: String,
        gifTitle: String,
        likedByUsers: {type:Array, default:[], ref: 'UserModel'},
        createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'},
    }, {collections: 'gif'});

module.exports = gifSchema;
