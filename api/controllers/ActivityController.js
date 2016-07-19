/**
 * ActivityController
 *
 * @description :: Server-side logic for managing Activity
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  get: function (req, res) {
    Activity.find({
      id: req.param('activity_id')
    }).exec(function(err, activity){
      if (activity.length < 1) {
        res.status(404).send({
          success: false,
          message: 'target not found'
        });
      } else {
        res.send({
          success: true,
          data: {
            // TODO serialize
            activity: activity
          }
        });
      }
    });
  },

  create: function (req, res) {
    // TODO filter data
    Activity.create(req.body).exec(function(err, activity){
      res.send({
        success: true,
        data: {
          activity: activity
        }
      });
    });
  },

  update: function (req, res) {
    // TODO filter data
    Activity.update({
      id: req.param('activity_id')
    }, req.body).exec(function(err, activity){
      res.send({
        success: true,
        data: {
          activity: activity
        }
      });
    });
  },

  delete: function (req, res) {
    Activity.destroy({
      id: req.param('activity_id')
    }).exec(function(err){
      res.send({
        success: true
      });
    });
  },

  publish: function (req, res) {
    Activity.update({
      id: req.param('activity_id')
    }, {
      publish: true
    }).exec(function(err, activity){
      res.send({
        success: true
      })
    });
  },

  unpublish: function (req, res) {
    Activity.update({
      id: req.param('activity_id')
    }, {
      publish: false
    }).exec(function(err, activity){
      res.send({
        success: true
      })
    });
  },

  orderchange: function (req, res) {
    // TODO orm??? raw query???
    for (var i = 0; i < req.body.length; i++) {
      Activity.update({
        id: req.body[i]
      }, {
        order: req.body[i]
      }).exec(function(err, activity){
        //
      });
    }
  }
};
