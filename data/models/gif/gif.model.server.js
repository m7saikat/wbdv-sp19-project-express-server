const mongoose = require('mongoose');
const giftSchema = require('./gif.schema.server');
const gifModel = mongoose.model('gifModel', giftSchema);

module.exports = gifModel;