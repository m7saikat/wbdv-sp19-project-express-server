const gifModel = require('../models/gif/gif.model.server');
const userModel = require('../models/user/user.model.server');
const userdao = require('./user.dao.server');

createGif = (gif) => gifModel.create(gif).catch(e => e.errmsg);

updateGif = (gifId, gif) => gifModel.updateOne({_id: gifId}, {$set: gif}).catch(e => e.errmsg);

deleteGif = (gifId) => gifModel.remove({_id: gifId})
    .then(status => {
        userModel.find({likes: gifId})
            .then(likedUsers => likedUsers.map(user => {
                user.likes = user.likes.filter(value =>  value !== gifId);
                userdao.updateUser(user.id, user);
                return status;
            }))
    })
    .catch((e) => e.errmsg);


findAllGif = () => gifModel.find();

findGifById = (gifId) => gifModel.findById(gifId);

findGifTitle = (gifId) => gifModel.find({_id: gifId}, {gifTitle: 1});

findGifURl = (gifId) => gifModel.findById({_id: gifId}, {gifUrl: 1});

module.exports = {
    createGif,
    updateGif,
    deleteGif,
    findAllGif,
    findGifById,
    findGifTitle,
    findGifURl
};
