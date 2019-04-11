const mongoose = require('mongoose');
const userSchema = require('./user.schema.server');
const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;