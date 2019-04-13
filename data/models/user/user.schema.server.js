const mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
                                          firstName: String,
                                          lastName: String,
                                          username: {type: String, unique:true, required: [true, "can't be blank"], index: true},
                                          email: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
                                          image: String,
                                          password: String,
                                          likes: []
                                          // comments: []
                                      }, {collections: 'users'});
userSchema.plugin(uniqueValidator, {message: 'is already taken.'});
module.exports = userSchema;
