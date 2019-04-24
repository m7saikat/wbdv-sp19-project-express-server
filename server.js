require ('./data/db')();
const express = require('express');
const mongoose = require('mongoose');
const userService = require('./services/user.service.server');
const gifService = require('./services/gif.service.server');
const commentService = require('./services/comment.service.server');
var session = require('express-session');
const server = express();
const bodyParser = require('body-parser');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use(session({
        resave: false,
        saveUninitialized: true,
        secret: 'any string',

    }));

server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});
userService(server);
gifService(server);
commentService(server);
server.listen(process.env.PORT || 4000);

module.exports = server;
