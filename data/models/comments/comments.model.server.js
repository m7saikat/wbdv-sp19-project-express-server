const mongoose = require('mongoose');
const commentSchema = require('./comment.schema.server');
const commentModel = mongoose.model('userModel', commentSchema);

module.exports = commentModel;