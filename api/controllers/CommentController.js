/**
 * CommentController
 *
 * @description :: Server-side logic for managing comment
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // Create new commenat
  create: function (req, res) {
    Comment.create(req.body).then(function(comment){
      return Comment.findOne(comment.id).populate('author', {select: ['id', 'username']});
    }).then(function(comment) {
      return res.created({
        success: true,
        data: {
          comment: comment
        }
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  }

};
