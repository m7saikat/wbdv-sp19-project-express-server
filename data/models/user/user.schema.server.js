const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
                                          _id: Number,
                                          firstName: String,
                                          lastName: String,
                                          username: String,
                                          email: String,
                                          image: String,
                                          password: String,
                                          // likes: [],
                                          // comments: []
                                      }, {collections: 'users'});

module.exports = userSchema;