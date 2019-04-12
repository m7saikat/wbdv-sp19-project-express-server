let jwt = require('jsonwebtoken');
const config = require('./config.js');

verifyToken =(req, res, next) => {
//get auth header value
    const bearerHeader = req.headers['authorization'] || req.headers['x-access-token'] ;
    //check not undefined
    if (typeof (bearerHeader) !== "undefined") {
        //split at space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const token = bearer[1];
        if (token) {
            jwt.verify(token, config.secret,(err, decoded) => {
                if (err) {
                    return res.json({
                                        success: false,
                                        message: 'Token is not valid'
                                    });
                } else {
                    req.token = decoded;
                    //next middleware
                    next();
                }
            } )
        }

    } else {
        // res.status(403).send("Failed, token not provided.")
        return res.json({
                            success: false,
                            message: 'Auth token is not supplied'
                        });
    }
};

module.exports = {
    verifyToken
};