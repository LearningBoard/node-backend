/**
 * TagController
 *
 * @description :: Server-side logic for managing tag
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // Get all tag
  getAll: function (req, res) {
    Tag.find({select: ['id', 'tag']}).then(function(tag){
      return res.send({
        success: true,
        data: {
          tag: tag
        }
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Create new tag
  create: function (req, res) {
    Tag.findOrCreate({
      tag: req.body.tag
    }, req.body).then(function(tag){
      return res.created({
        success: true,
        data: {
          tag: tag
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
