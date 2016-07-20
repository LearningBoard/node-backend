/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // Get all news
  getAll: function (req, res) {
    if (!req.session.authenticated) {
      return res.status(403).send({
        success: false,
        message: 'Login required'
      });
    }
    // TODO filter news that visable to user
    News.find().exec(function(err, news){
      if (err) {
        return res.status(500).send({
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
    News.create({
      title: req.body.title,
      text: req.body.text,
      author: req.body.author_id,
      learningboard: req.body.learningboard
    }).exec(function(err, news){
      if (err) {
        return res.status(500).send({
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
  }

};
