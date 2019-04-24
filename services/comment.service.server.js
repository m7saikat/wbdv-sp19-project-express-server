const config = require('../middleware/config');
const dao = require('../data/dao/comment.dao.server');
let middleware = require('../middleware/middleware');
const jwt = require("jsonwebtoken");

module.exports = app => {

    // Get comment by user and gif
    app.get('/api/comment/:gifId',(req,res)=>{
        const gifId = req.params.gifId;
        const userId = req.session.user._id;
        if (userId) {
            dao.findCommentByUserAndGif(gifId,userId).then(comment => {
                if (comment) {
                    res.send(comment)
                } else {
                    res.status(403).send({
                                             success: false,
                                             message: "Comment not found"
                                         })
                }
            })
        } else {
            res.status(404).send({
                success: false,
                message: "User not found. Check session"
                                 })
        }
    });

    //Get all comments for a user
    app.get('/api/comment', (req,res) => {
        if(req.session.user){
            const userId = req.session.user._id;
            dao.findCommentByUser(userId).then(
                comments => res.send(comments)
            )
        }
        else{
            res.status(404).send({
                success: false,
                message: "Please login first."
            })
        }

    });

    //Get all comments for a GIF
    app.get('/api/gif/:gifId/comment', (req,res) => {
        const gifId = req.params.gifId;
        dao.findCommentByGif(gifId).then(
            comments => res.send(comments)
        )
    });

    //get all comments
    app.get('/api/comments', (req,res) => {
        dao.findAllComments().then(results => res.send(results))
    });

    //Add comment
    app.post('/api/comment', (req, res)=>{
        const userId = req.session.user._id;
        const gifId = req.body.gifId;
        const comment = req.body.comment;

        dao.addComment(gifId,userId,comment).then(
            comment => res.send(comment)
        )
    });

    //Edit comment
    app.put('/api/comment/', (req, res) => {
        const userId = req.session.user._id.toString();
        const comment = req.body.comment;
        const commentId = req.body.commentId;
        gifId = comment.gifId;
        dao.findCommentBYId(commentId).then(commentResult => {
            if(commentResult){
                if((userId === commentResult.createdByuser.toString())|| (req.session.user.role === 'ADMIN')) {
                    dao.editComment(commentId, comment).then(
                        status => {
                            if (status.nModified >=1 ) {
                                dao.findCommentByUserAndGif(gifId,userId).then(
                                    comment => res.send(comment)
                                )
                            }
                            else{
                                res.status(404).send({
                                    success: false,
                                    message: "Edit failed, please try again."
                                })
                            }
                        }
                    )
                }
            }
            else {
                res.status(404).send({
                    success: false,
                    message: "No comment exists with the given Id"
                })
            }
        })
    });

    //Delete Comment
    app.del('/api/comment', (req,res)=> {
        const commentId = req.body.commentId;
        const userId = req.session.user._id;

        dao.findCommentBYId(commentId).then(comment => {
            if(comment){
                if((comment.createdByuser.toString() === userId.toString())|| (req.session.user.role === 'ADMIN')){
                    dao.deleteComment(commentId).then(result => res.send(result));
                }
                else{
                    res.status(404).send({
                        success: false,
                        message: "You can only delete your comment."
                    })
                }
            }
            else {
                res.status(404).send({
                    success: false,
                    message: "No comment found for the given Id."
                })
            }
        })
    })
};
