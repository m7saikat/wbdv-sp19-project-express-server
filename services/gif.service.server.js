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

    //create GIF
    app.post('/api/gif', (req,res) =>{
        const gif = req.body;
        dao.createGif(gif).then(gif => res.send(gif))
    });

    //Update GIF
    app.put('/api/gif/:gifId', (req,res)=>{
        const gifId = req.params.gifId;
        const gif = req.body;
        dao.updateGif(gifId,gif).then(status => res.send(status))
    });

    //Delete Gif
    app.delete('/api/gif/:gifId', (req, res)=>{
        const gifId = req.params.gifId;
        dao.deleteGif(gifId).then(status => res.send(status))

    })

};
