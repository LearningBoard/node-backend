/**
 * TagController
 *
 * @description :: Server-side logic for managing tag
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // Get all tag
  getAll: function (req, res) {
    Tag.find({select: ['id', 'tag']}).exec(function(err, tag){
      if (err) {
        return res.status(err.status || 500).send({
          success: false,
          message: err
        });
      } else {
        return res.send({
          success: true,
          data: {
            tag: tag
          }
        });
      }
    });
  },

  // Create new tag
  create: function (req, res) {
    Tag.findOrCreate({
      tag: req.body.tag
    }, req.body, function(err, tag){
      if (err) {
        return res.status(err.status || 500).send({
          success: false,
          message: err
        });
      } else {
        return res.created({
          success: true,
          data: {
            tag: tag
          }
        });
      }
    });
  }

};
