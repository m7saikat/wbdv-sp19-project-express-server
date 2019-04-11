module.exports = function () {
    const mongoose = require('mongoose');
    const databaseName = 'gif-art';
    let connectionString =
        'mongodb://localhost/';
    connectionString += databaseName;
    // const localURL = 'mongodb://localhost/white-board';

    mongoose
        .connect(connectionString, { autoIndex: false })
        .then(() => {
            console.log("Connected to database");
        }).catch(() => {
        console.log("Connection failed");
    });
};
