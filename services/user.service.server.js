const config = require('../middleware/config');
const dao = require('../data/dao/user.dao.server');
let middleware = require('../middleware/middleware');
const jwt = require("jsonwebtoken");

module.exports = app => {

    login = (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        let userFromDb = '';
        dao.findUsersByUsername(username).then(
            user => {
                userFromDb = user;
                const usernameFromDB = userFromDb.username;
                const passwordFromDB = userFromDb.password;
                if (username && password) {
                    //Check if username and password matches with the object in Database
                    if (username === usernameFromDB && password === passwordFromDB) {
                        // Create a token for the current login and send it back
                        let token = jwt.sign({username},
                                             config.secret,
                                             {expiresIn: '24h'}
                        );
                        res.send({
                                     success: true,
                                     message: "Authentication successful.",
                                     token: token
                                 })
                    } else {
                        res.sendStatus(403).json({
                                                     success: false,
                                                     message: "Authentication failed."
                                                 })
                    }
                } else {
                    res.sendStatus(403).json({
                                                 success: false,
                                                 message: "Authentication failed. Please Check the request"
                                             })
                }
            }
        );
    };

    app.post('/api/populate', (req, res) => {
        res.send(dao.populateUsersSchema())
    });

    //User Schema CRUD operations
    app.get('/api/student', (req, res) => {
        console.log("finding users");
        dao.findAllUsers().then(users => res.send(users))
    });

    app.get('/api/student/:id', (req, res) => {
        const studentId = req.params.id;
        dao.findUsersById(studentId).then(student => res.send(student))
    });

    app.post('/api/student', (req, res) => {
        const student = req.body;
        dao.createUser(student).then(student => res.send(student))
    });

    app.put('/api/student/:id', (req, res) => {
        const student = req.body;
        const studentId = req.params.id;
        dao.updateUser(studentId, student).then(status => res.send(status))
    });

    app.delete('/api/student/:id', (req, res) => {
        const studentId = req.params.id;
        dao.deleteUser(studentId).then(status => res.send(status));
    });

    //Login
    app.post('/login', login);

    app.get('/', middleware.verifyToken, (req, res) => {
        res.json({
                     success: true,
                     message: 'Index page'
                 });
    })
};