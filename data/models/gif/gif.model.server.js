const mongoose = require('mongoose');
const giftSchema = require('./gif.schema.server');
const gifModel = mongoose.model('GifModel', giftSchema);

module.exports = gifModel;