/**
 * ActivityController
 *
 * @description :: Server-side logic for managing activity
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // Get single activity
  get: function (req, res) {
    Activity.findOne({
      id: req.param('activity_id')
    }).exec(function(err, activity){
      if (err) {
        return res.status(err.status || 500).send({
          success: false,
          message: err
        });
      } else if (!activity) {
        return res.notFound({
          success: false,
          message: 'activity not found'
        });
      } else {
        return res.send({
          success: true,
          data: {
            activity: activity
          }
        });
      }
    });
  },

  // Create new activity
  create: function (req, res) {
    var exclude_key = ['pk', 'title', 'description', 'type', 'activity_id', 'author_id', 'order'];
    var data = {};
    for (var key in req.body) {
      if (exclude_key.indexOf(key) === -1) {
        data[key] = req.body[key];
      }
    }
    Activity.create(Object.assign(req.body, {data: data})).exec(function(err, activity){
      if (err) {
        return res.status(err.status || 500).send({
          success: false,
          message: err
        });
      } else {
        return res.created({
          success: true,
          data: {
            activity: activity
          }
        });
      }
    });
  },

  // Update existing activity
  update: function (req, res) {
    var exclude_key = ['pk', 'title', 'description', 'type', 'activity_id', 'author_id', 'order'];
    var data = {};
    for (var key in req.body) {
      if (exclude_key.indexOf(key) === -1) {
        data[key] = req.body[key];
      }
    }
    Activity.update({
      id: req.param('activity_id')
    }, Object.assign(req.body, {data: data})).exec(function(err, activity){
      if (err) {
        return res.status(err.status || 500).send({
          success: false,
          message: err
        });
      } else {
        return res.send({
          success: true,
          data: {
            activity: activity
          }
        });
      }
    });
  },

  // Delete existing activity
  delete: function (req, res) {
    Activity.destroy({
      id: req.param('activity_id')
    }).exec(function(err){
      if (err) {
        return res.status(err.status || 500).send({
          success: false,
          message: err
        });
      } else {
        return res.send({
          success: true
        });
      }
    });
  },

  // Set activity public
  publish: function (req, res) {
    Activity.update({
      id: req.param('activity_id')
    }, {
      publish: req.body.publish || false
    }).exec(function(err, activity){
      if (err) {
        return res.status(err.status || 500).send({
          success: false,
          message: err
        });
      } else {
        return res.send({
          success: true
        });
      }
    });
  }

};
