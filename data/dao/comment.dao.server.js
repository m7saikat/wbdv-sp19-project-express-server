const commentModel = require('../models/comments/comments.model.server');

findCommentByUser = (userId) => {
    return commentModel.find({createdByuser: userId})
};

findCommentByGif = (gifId) => {
    return commentModel.find({createdByuser: gifId})
};

findCommentByUserAndGif = (gifId, userId) => {
  return commentModel.find({createdByuser: userId, gif: gifId}).catch(e=> e.errmsg)
};

findAllComments = () => {
    return commentModel.find()
};

deleteComment = (commentId) => {
  return commentModel.deleteOne()
};

editComment = (commentId, comment) => {
    commentModel.updateOne({_id: commentId}, {$set:{text: comment.text}})
};

addComment = (gifId, userId, comment) => {
    comment.gif = gifId;
    comment.createdByuser = userId;
    return commentModel.create(comment)
};

module.exports = {
    findCommentByUser,
    findCommentByGif,
    findCommentByUserAndGif,
    deleteComment,
    addComment,
    editComment
};