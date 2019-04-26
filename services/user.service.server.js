const config = require('../middleware/config');
const dao = require('../data/dao/user.dao.server');
const gifdao = require('../data/dao/gif.dao.server');
let middleware = require('../middleware/middleware');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const request = require('request');
var store = require('store');

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
                        
                        res.status(200).send(createToken(user))

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
       let user = req.body;
       if(user.username === 'admin' && user.password === 'admin'){
           user.role = 'ADMIN';
       }
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

    removeLike = (req,res) => {
        var userId = req.body.userId;
        var like_to_remove = req.body.gifUrl;
        dao.findUsersById(userId).then(user => {

            if(user){
                if(user.likes.indexOf(like_to_remove)>=0){
                    user.likes = user.likes.filter(update => update!==like_to_remove);
                    dao.updateUser(user._id, user).then(updatedUser => {
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
    app.put('/api/like',addLikes);
    app.put('/api/unlike', removeLike);
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

    //find user by email
    app.get("/api/email/:email", (req, res) => {
        const email= req.params.email;
        // console.log("--> "+email);
        dao.findUserByEmail(email).then( user => {
            if (user) {
                // console.log("user -> ", user);
                res.status(200).send({
                    success: true,
                    message: "user found",
                    user : user
                                     })
            } else {
                res.status(404).send({
                                         success: false,
                                         message: "user not found"
                                     })
            }

        })
    });

    //find user by username
    app.get("/api/username/:username", (req, res) => {
        const username= req.params.username;
        // console.log("--> "+username);
       dao.findUsersByUsername(username).then( user => {
           if (user) {
               res.send(user)
           } else {
               res.status(403).send({
                   success: false,
                   message: "user not found"
                                    })
           }

       })
    });

    app.put('/api/user/:id', (req, res) => {
        const user = req.body;
        const userId = req.params.id;
        dao.updateUser(userId, user).then(status => {
            if(status.nModified >= 1){
                dao.findUsersById(userId).then(updated => {
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
        if(req.session.user.role === 'ADMIN'){
            dao.deleteUser(userId).then(status => res.send(status));
        } else {
            res.status(403).send({
                success: false,
                message: "Only Admin can delete users."
            })
        }
    });

    googleLogin = (req,res) => {
        let code = req.query.code;
        let request = require("request");

        let options = { method: 'POST',
            url: 'https://accounts.google.com/o/oauth2/token',
            headers:
                { 'Postman-Token': 'f6a1095a-7d4b-4a26-91db-77a49546c80a',
                    'cache-control': 'no-cache',
                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
            formData:
                { grant_type: 'authorization_code',
                    code: code,
                    client_id: '950601830079-k48proe2ml618ce918k5it6uo15ib0dq.apps.googleusercontent.com',
                    client_secret: 'cZywwZqggJqkkostSHxMUSXs',
                    redirect_uri: 'http://localhost:4000/login/google' } };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let decoded_token = jwt.decode(JSON.parse(body).id_token);
            let user_email = decoded_token.email;
            if(user_email) {
                dao.findUserByEmail(user_email).then(user=>{
                    if(user){
                        req.session['user'] = user;
                        let token = createToken({user});
                        res.cookie('token', token.token,{expires: new Date(Date.now() + 900000)});
                        res.cookie('username', token.user.user.username,{ expires: new Date(Date.now() + 900000)});
                        let userId = token.user.user._id.toString();
                        // const expiresIn = moment().add(token.expiresIn, 'hours');
                        // res.store('expiresIn',expiresIn)
                        res.cookie('userId', userId, {expires: new Date(Date.now() + 900000)});
                        res.redirect("http://localhost:4200/home")

                    }
                    else {
                     let create_new_user = {
                         "firstName": user_email,
                         "lastName": user_email,
                         "username": user_email,
                         "email": user_email,
                         "image": "",
                         "password": Math.random().toString(36).substring(2, 15),
                         "likes": []
                     }
                     dao.createUser(create_new_user).then(result => {
                         if(result !== undefined){
                             req.session['user'] = result.user;
                             res.cookie('token', result.token,{expires: new Date(Date.now() + 900000)});
                             res.cookie('username', result.user.username,{ expires: new Date(Date.now() + 900000)});
                             res.cookie('userId', result.user._id.toString(), {expires: new Date(Date.now() + 900000)});
                             res.redirect("http://localhost:4200/home");
                         }
                         else {
                             res.status(403).json({
                                 success: false,
                                 message: "You are not logged into our database, and unable to create user, please register."
                             })
                         }
                     })
                    }
                })
            }
            else {

                res.status(403).json({
                    success: false,
                    message: "Social Authentication failed."
                })
            }
        });

    }
    //Login
    app.post('/login', login);

    //Social Login
    app.get('/login/google', googleLogin);

    //Logout
    app.post('/logout', logout);

    //Register
    app.post('/register', register);

    app.get('/', middleware.verifyToken, (req, res) => {
        res.json({
                     success: true,
                     message: 'Index page'
                 });
    });

    //Reset Password
    app.post('/api/resetpassword', (req, res) => {

        const randPassword = Math.random().toString(36).slice(2);
        const user = req.body;
        user.password = randPassword;
        dao.updateUser(user._id, user).then(
           status => {
               if (status.nModified === 1) {
                   // this.sendMail(user.email, user.password);
                   res.status(200).send({
                       success: true,
                       Message: "Successfully reset password",
                       email: user.email,
                       password: user.password
                                        })
               } else {
                   res.status(404).send({
                                            success: false,
                                            Message: "Could not reset password"
                                        })
               }
           }
       )

    });

    app.post('/api/sendemail', (req,res) => {
        var emailId = req.body.email;
        var password = req.body.password;

        let transporter = nodemailer.createTransport({
                                                         service: 'gmail',
                                                         auth: {
                                                             user: "gifhyart@gmail.com",
                                                             pass: "KKMS1234"
                                                         }
                                                     });

        let mailOptions = {
            from: '"Giphy Art" <gifhyart@gmail.com>', // sender address
            to: emailId, // list of receivers
            subject: 'Forgot password', // Subject line
            text: 'Hello, \n \n You\'re receiving this email because you attempted to reset your password. The new password for your account against ' + emailId + ' ' + 'is' + ' ' + password, // plain text body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            // re('Message sent: %s', info.messageId);
            res.send({
                'message': 'Email sent'
            });
        });

    });
};


