const config = require('../middleware/config');
const dao = require('../data/dao/gif.dao.server');
let middleware = require('../middleware/middleware');
const jwt = require("jsonwebtoken");

module.exports = app => {

    //find all GIFs
    app.get('/api/gif',(req, res) => dao.findAllGif().then(gifs => res.send(gifs)))

    //find GIF by ID
    app.get('/app/gif/:id', (req, res) => {
        const gifId = req.params.id;
        dao.findGifById(gifId).then(gif => res.send(gif))
    });

    //create GIF
    app.get('/app/gif/', (req,res) =>{
        const gif = req.body;
        dao.createGif(gif).then(gif => res.send(gif))
    })

    //Update GIF


};