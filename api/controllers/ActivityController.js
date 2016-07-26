/**
 * ActivityController
 *
 * @description :: Server-side logic for managing activity
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// Prepare data for model `data` column
var prepareFilteredData = function(input){
  var exclude_key = ['title', 'description', 'type', 'order', 'author', 'createdBy', 'owner'];
  var data = {};
  for (var key in input) {
    if (exclude_key.indexOf(key) === -1) {
      data[key] = input[key];
    }
  }
  return data;
};

module.exports = {

  // Get single activity
  get: function (req, res) {
    Activity.findOne({
      id: req.param('activity_id')
    }).populate('complete').then(function(activity){
      if (!activity) {
        return res.notFound({
          success: false,
          message: 'activity not found'
        });
      } else {
        return res.send({
          success: true,
          data: {
            activity: activity.toJSON(['complete'], req.user)
          }
        });
      }
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Create new activity
  create: function (req, res) {
    var data = prepareFilteredData(req.body);
    Activity.create(Object.assign(req.body, {data: data})).then(function(activity){
      return res.created({
        success: true,
        data: {
          activity: activity
        }
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Update existing activity
  update: function (req, res) {
    var data = prepareFilteredData(req.body);
    Activity.update({
      id: req.param('activity_id')
    }, Object.assign(req.body, {data: data})).then(function(activity){
      return res.send({
        success: true,
        data: {
          activity: activity
        }
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Delete existing activity
  delete: function (req, res) {
    Activity.destroy({
      id: req.param('activity_id')
    }).then(function(){
      return res.send({
        success: true
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Set activity public
  publish: function (req, res) {
    Activity.update({
      id: req.param('activity_id')
    }, {
      publish: req.body.publish || false
    }).then(function(activity){
      return res.send({
        success: true
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // User mark the activity as completed
  complete: function (req, res) {
    Activity.findOne({
      id: req.param('activity_id')
    }).then(function(activity){
      if (req.body.complete) {
        activity.complete.add(req.user.id);
      } else {
        activity.complete.remove(req.user.id);
      }
      return activity.save();
    }).then(function(activity){
      return res.send({
        success: true
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  }

};
