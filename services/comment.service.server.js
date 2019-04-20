const config = require('../middleware/config');
const dao = require('../data/dao/comment.dao.server');
let middleware = require('../middleware/middleware');
const jwt = require("jsonwebtoken");

module.exports = app => {

    // Get comment by user and gif
    app.get('/api/comment/:gifId',(req,res)=>{
        const gifId = req.params.gidId;
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

    //Get all comments for a GIF for a user
    app.get('/api/user/comment', (req,res) => {
        const userId = req.body.userId;
        dao.findCommentByUser(userId).then(
            comments => res.send(comments)
        )
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
        const userId = req.session.user._id;
        const comment = req.body;
        commentId = comment.commentId;
        gifId = comment.gifId;
        if (userId === comment.createdByuser) {
            dao.editComment(commentId, comment).then(
                status => {
                    if (status.nModified >=1 ) {
                        dao.findCommentByUserAndGif(gifId,userId).then(
                            comment => res.send(comment)
                        )
                    }
                }
            )
        }
    })



};