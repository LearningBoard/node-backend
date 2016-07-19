/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function (req, res) {
    News.create({
      title: req.body.title,
      text: req.body.text,
      // TODO author
      learningboard: req.body.learningboard
    }).exec(function(err, news){
      res.send({
        success: true,
        data: {
          news: news
        }
      });
    });
  }

};
