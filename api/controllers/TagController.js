/**
 * TagController
 *
 * @description :: Server-side logic for managing tag
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  getAll: function (req, res) {
    Tag.find().exec(function(err, tag){
      res.send({
        success: true,
        data: {
          tag: tag
        }
      });
    });
  },

  create: function (req, res) {
    Tag.findOrCreate({
      tag: req.body.tag
    }).exec(function(err, tag){
      res.send({
        success: true,
        data: {
          tag: tag
        }
      });
    });
  }

};
