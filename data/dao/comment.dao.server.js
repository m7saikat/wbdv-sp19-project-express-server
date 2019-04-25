const commentModel = require('../models/comments/comments.model.server');

findCommentByUser = (userId) => commentModel.find({createdByuser: userId});

findCommentByGif = (gifId) => {
    return commentModel.find({gif: gifId})
};

findCommentByUserAndGif = (gifId, userId) => {
    return commentModel.find({createdByuser: userId, gif: gifId})
};

findAllComments = () => {
    return commentModel.find()
};

findCommentBYId = (commentId) => commentModel.findById(commentId);


deleteComment = (commentId) => {
  return commentModel.deleteOne()
};

editComment = (commentId, comment) => {
    return commentModel.updateOne({_id: commentId}, {$set:{text: comment.text}})
};

findAllComments = () => commentModel.find();

addComment = (gifId, userId, comment) => {
    // comment.gif = gifId;
    // comment.createdByuser = userId;
    // comment.text = comment;
    return commentModel.create({
        gif: gifId,
        createdByuser: userId,
        text: comment
    })
};

module.exports = {
    findCommentByUser,
    findCommentByGif,
    findCommentByUserAndGif,
    deleteComment,
    addComment,
    editComment,
    findCommentBYId,
    findAllComments
};
