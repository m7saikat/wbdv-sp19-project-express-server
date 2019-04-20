const config = require('../middleware/config');
const dao = require('../data/dao/user.dao.server');
const gifdao = require('../data/dao/gif.dao.server');
let middleware = require('../middleware/middleware');
const jwt = require("jsonwebtoken");

module.exports = app => {

    createToken = (payload) => {

        let token =
            jwt.sign({
                userId: payload._id,
                username: payload.username,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.lastName,
                     },
                             config.secret
        );
        //sole.log(token)
        return ({
            success: true,
            message: "Authentication successful.",
            token: token,
            expiresIn: '3',
            user: payload
        })
    };

    login = (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        let userFromDb = '';
        dao.findUsersByUsername(username).then(
            user => {
                if (user) {
                    userFromDb = user;
                    const usernameFromDB = userFromDb.username;
                    const passwordFromDB = userFromDb.password;

                    //Check if username and password matches with the object in Database
                    if (username === usernameFromDB && password === passwordFromDB) {
                        // Create a token for the current login and send it back

                        req.session['user'] = user;
                        req.session.cookie. maxAge = 10800000;
                        
                        res.send(createToken({user}))

                    } else {
                        res.status(403).json({
                                                     success: false,
                                                     message: "Authentication failed."
                                                 })
                    }
                } else {
                    res.status(403).json({
                                                   success: false,
                                                 message: "Authentication failed."
                                             })
                }
            }
        );
    };

    logout = (req,res) => {
        req.session.destroy();
        res.send(200);
    }

    register = (req, res) => {
       const user = req.body;

        dao.createUser(user).then(
            (u) =>  {
                if (u !== undefined) {
                    const data = createToken(u);
                    if (data.success === true){
                        req.session['user'] = user;
                        req.session.cookie.maxAge = 10800000;
                        res.status(200).send(data)
                    } else {
                        res.status(403).send({
                                                 success: false,
                                                 message: "Registration failed. Check response"
                                             })
                    }
                } else {
                    res.status(403).send({
                                             success: false,
                                             message: "Username already exists"
                                         })
                }
            }
        )
    };

    addLikes = (req,res) =>
        {
            const gifId = req.body.gifId;
            const userId = req.body.userId;

            dao.findUsersById(userId).then(student => {
                if(student){
                    gifdao.findGifById(gifId).then(gif => {
                        if(gif.likedByUsers.indexOf(student.id) < 0 ){
                            gif.likedByUsers.push(student.id);
                            gifdao.updateGif(gifId, gif)
                        }
                    })
                    if(student.likes.indexOf(gifId) < 0)
                        student.likes.push(gifId);
                    dao.updateUser(student.id,student).then( updatedstudent => {
                        if(updatedstudent.nModified >= 1){
                            dao.findUsersById(student.id).then(updated=> {
                                req.session['user'] = updated;
                                res.json(updatedstudent)
                            })
                        }
                        else{
                            res.send(updatedstudent);
                        }
                    } )
                }
                else{
                    res.status(403).send({
                        success: false,
                        message: "User does not exist or has been logged out."
                    })
                }
            } )
        }

        addFollowers = (req,res) =>
        {
            const userId = req.session.user._id;
            const followerId = req.body.followId;

            dao.findUsersById(userId).then(user => {
                if(user){
                    if(user.followers.indexOf(followerId)<0){
                        user.followers.push(followerId)
                        dao.updateUser(user.id, user).then(updatedUser => {
                            if(updatedUser.nModified >= 1){
                                    req.session['user'] = user;
                            }
                                res.send(updatedUser);
                        })
                    }
                }
                else{
                    res.status(403).send({
                        success: false,
                        message: "User does not exist or has been logged out."
                    })
                }
            })
        }

        unfollow = (req,res) => {
            const userId = req.session.user._id;
            const followerId = req.body.unfollowId;

            dao.findUsersById(userId).then(user => {
                if(user){
                    if(user.followers.indexOf(followerId)>=0){
                        user.followers = user.followers.filter(update => update!==followerId);
                        dao.updateUser(user.id, user).then(updatedUser => {
                            if(updatedUser.nModified >= 1){
                                req.session['user'] = user;
                            }
                            res.send(updatedUser);
                        })
                    }
                }
                else{
                    res.status(403).send({
                        success: false,
                        message: "User does not exist or has been logged out."
                    })
                }
            })
        };

    app.put('/api/like',addLikes);
    app.put('/api/follow', addFollowers);
    app.put('/api/unfollow', unfollow);

    app.get('/api/session/user', (req,res)=> res.send(req.session['user']));

    app.post('/api/populate', (req, res) => {
        res.send(dao.populateUsersSchema())
    });

    //User Schema CRUD operations
    app.get('/api/user', (req, res) => {
        dao.findAllUsers().then(users => res.send(users))
    });

    app.get('/api/user/profile', (req, res) => res.send(req.session['user']));

    app.get('/api/user/:id', (req, res) => {
        const userId = req.params.id;
        dao.findUsersById(userId).then(user => res.send(user))
    });

    //for creating users for admin
    app.post('/api/user', (req, res) => {
        const user = req.body;
        dao.createUser(user).then(user => res.send(user))
    });

    app.put('/api/user/:id', (req, res) => {
        const user = req.body;
        const userId = req.params.id;
        dao.updateUser(userId, user).then(status => {
            if(status.nModified >= 1){
                dao.findUsersById(userId).then(updated=> {
                    req.session['user'] = updated;
                    res.send(status);
                })
            }
            else{
                res.send(status);
            }
        })
    });

    app.delete('/api/user/:id', (req, res) => {
        const userId = req.params.id;
        dao.deleteUser(userId).then(status => res.send(status));
    });

    //Login
    app.post('/login', login);

    //Logout
    app.post('/logout', logout);

    //Register
    app.post('/register', register);

    app.get('/', middleware.verifyToken, (req, res) => {
        res.json({
                     success: true,
                     message: 'Index page'
                 });
    })
};
