/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // Get all news that is visible to user
  getAll: function (req, res) {
    News.find({
      'learningboard.subscribe.user': req.user.id
    })
    .populate('author', {select: ['id', 'username']})
    .populate('lb', {select: ['id', 'title']}).then(function(news){
      return res.send({
        success: true,
        data: {
          news: news
        }
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Create new news
  create: function (req, res) {
    News.create(req.body).then(function(news){
      return res.created({
        success: true,
        data: {
          news: news
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
