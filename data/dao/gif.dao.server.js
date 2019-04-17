const gifModel = require('../models/gif/gif.model.server');

createGif = (gif) => gifModel.create(gif).catch( e => e.errmsg);

updateGif = (gifId, gif) => gifModel.updateOne({_id:gifId}, {$set:gif}).catch(e => e.errmsg);

deleteGif = (gifId) => gifModel.deleteOne(gifId);

findAllGif = () => gifModel.find();

findGifById = (gifId) => gifModel.findById(gifId);

findGifTitle = (gifId) => gifModel.find({_id:gifId}, {gifTitle:1});

findGifURl = (gifId) => gifModel.findById({_id:gifId}, {gifUrl:1});

module.exports = {
    createGif,
    updateGif,
    deleteGif,
    findAllGif,
    findGifById,
    findGifTitle,
    findGifURl
};