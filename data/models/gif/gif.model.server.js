const mongoose = require('mongoose');
const gifSchema = require('./gif.schema.server');
const gifModel = mongoose.model('gifModel', gifSchema);

module.exports = gifModel;
