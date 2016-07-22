/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // Get all news
  getAll: function (req, res) {
    News.find({
      'learningboard.follow.user': req.user.id
    })
    .populate('author', {select: ['id', 'username']})
    .populate('learningboard', {select: ['id', 'title']}).exec(function(err, news){
      if (err) {
        return res.serverError({
          success: false,
          message: err
        });
      } else {
        return res.send({
          success: true,
          data: {
            news: news
          }
        });
      }
    });
  },

  // Create new news
  create: function (req, res) {
    News.create(req.body).exec(function(err, news){
      if (err) {
        return res.serverError({
          success: false,
          message: err
        });
      } else {
        return res.created({
          success: true,
          data: {
            news: news
          }
        });
      }
    });
  }

};
