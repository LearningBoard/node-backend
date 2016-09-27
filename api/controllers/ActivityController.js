/**
 * ActivityController
 *
 * @description :: Server-side logic for managing activity
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// Prepare data for model `data` column
var prepareFilteredData = function(input){
  var exclude_key = Object.keys(Activity.definition);
  var data = {};
  for (var key in input) {
    if (exclude_key.indexOf(key) === -1) {
      data[key] = input[key];
    }
  }
  return data;
};

module.exports = {

  _config: {
    rest: true
  },

  // Get single activity (mainly for edit activity use)
  get: function (req, res) {
    Activity.findOne({
      id: req.param('activity_id'),
      author: req.user.id // ensure user own the activity
    }).then(function(activity){
      if (!activity) throw {status: 404, message: 'Not found'};
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

  // Create new activity
  create: function (req, res) {
    var data = prepareFilteredData(req.body);
    var field = Object.assign(req.body, {data: data});
    if (!field.author) {
      field.author = req.user.id;
    }
    // Check board ownership before creating activity
    var checkBoardOwner = function() {
      return new Promise(function(resolve, reject) {
        if (req.body.lb) {
          LearningBoard.findOne({
            id: req.body.lb,
            author: req.user.id
          }).then(function(result) {
            if (!result) return reject({status: 403, message: 'Not owning the Learning Board'});
            resolve();
          });
        } else {
          resolve();
        }
      });
    };
    return checkBoardOwner().then(function() {
      return Activity.create(field);
    }).then(function(activity){
        return Activity.findOne({
          id: activity.id
        }).populate('author', {select: ['id', 'username']});
    }).then(function(activity) {
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
      return Activity.findOne({
        id: activity[0].id
      }).populate('author', {select: ['id', 'username']});
    }).then(function(activity){
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
  // Handle by blueprint to avoid bugs in some db
  /*
  delete: function (req, res) {
    Activity.destroy({
      id: req.param('activity_id'),
      author: req.user.id // ensure user own the activity
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
  */

  // Set activity public
  publish: function (req, res) {
    Activity.update({
      id: req.param('activity_id'),
      author: req.user.id // ensure user own the activity
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
  },

  like: function (req, res) {
    Activity.findOne({
      id: req.param('activity_id')
    }).then(function(activity){
      if (req.body.like) {
        activity.like.add(req.user.id);
      } else {
        activity.like.remove(req.user.id);
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
