module.exports = function () {
    const mongoose = require('mongoose');
    // const databaseName = 'gif-art';
    // let connectionString =
    //     'mongodb://localhost/';
    // connectionString += databaseName;

    // const localURL = 'mongodb://localhost/gif-art';
    const herokuURL = 'mongodb://heroku_p18m8zl6:bjgu39l8hbiptobvevpcgiu62d@ds145916.mlab.com:45916/heroku_p18m8zl6';
    mongoose
        .connect(herokuURL, { autoIndex: false })
        .then(() => {
            console.log("Connected to database");
        }).catch(() => {
        console.log("Connection failed");
    });
};
