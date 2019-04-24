const config = require('../middleware/config');
const dao = require('../data/dao/gif.dao.server');
let middleware = require('../middleware/middleware');
const jwt = require("jsonwebtoken");

module.exports = app => {

    //find all GIFs
    app.get('/api/gif',(req, res) => dao.findAllGif().then(gifs => res.send(gifs)))

    //find GIF by ID
    app.get('/api/gif/:id', (req, res) => {
        const gifId = req.params.id;
        dao.findGifById(gifId).then(gif => res.send(gif))
    });

    //find gifs created
    app.get('/api/created', (req,res)=> {
        const userId = req.session.user._id;
        if(userId){
            dao.findMyGifs(userId).then(result => res.send(result));
        }
        else{
            res.status(403).send({
                success: false,
                message: "You are not a user or have been logged out."
            })
        }
    });

    //create GIF
    app.post('/api/gif', (req,res) =>{
        const gif = req.body;
        if(req.session.user.role === 'CONTENTCREATOR' || req.session.user.role === 'ADMIN') {
            gif.createdBy = req.session.user._id;
            dao.createGif(gif).then(gif => res.send(gif))
        }
        else {
            res.status(403).send({
                success: false,
                message: "Only content creators or admins can create gifs."
            })
        }
    });

    //Update GIF
    app.put('/api/gif/:gifId', (req,res)=>{
        const gifId = req.params.gifId;
        const gif = req.body;
        var createdBy = '';
        dao.findGifById(gifId).then(result => {
            createdBy = result.createdBy;
            if((req.session.user.role === 'CONTENTCREATOR' && req.session.user._id === createdBy) || req.session.user.role === 'ADMIN') {
                dao.updateGif(gifId,gif).then(status => res.send(status))
            }
            else {
                res.status(403).send({
                    success: false,
                    message: "Only content creators or admins can update gifs."
                })
            }
        })
    });

    //Delete Gif
    app.delete('/api/gif/:gifId', (req, res)=>{
        const gifId = req.params.gifId;
        var createdById = '';
        dao.findGifById(gifId).then(result => {
            createdById = result.createdBy;
            // if( createdById.toString() === req.session.user._id.toString() || (req.session.user.role === 'ADMIN')) {
                dao.deleteGif(gifId).then(status => res.send(status));
            // }
            // else {
            //     res.status(403).send({
            //         success: false,
            //         message: "You can only delete your own gifs.."
            //     })
            // }
        });
    });

};
