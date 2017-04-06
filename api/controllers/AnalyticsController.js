/**
 * AnalyticsController
 *
 * @description :: Server-side logic for managing analytics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var kmeans = require('ml-kmeans');

module.exports = {

  _config: {
    rest: true
  },

  postLbClustering: function(req, res) {
    var totalActivity = 0;
    LearningBoard.findOne({
      id: req.param('lb')
    }).populate('activities').then(function(lb) {
      totalActivity = lb.activities.length;
      return Analytics.find({
        lb: req.param('lb'),
        activity: {
          '>': 0
        }
      }).populate('activity').sort('createdAt ASC');
    }).then(function(data) {
      // prepare k-means data
      var kmeansPrepareData = {};
      /* sum interaction times per activity per session */
      for (var i = 0; i < data.length; i++) {
        if (!kmeansPrepareData[data[i].session]) {
          kmeansPrepareData[data[i].session] = {};
          for (var j = 0; j < totalActivity; j++) {
            kmeansPrepareData[data[i].session][j] = 0;
          }
        }
        var order = parseInt(data[i].activity.order);
        kmeansPrepareData[data[i].session][order]++;
      }
      /* reformat data */
      var kmeansData = [];
      for (var id in kmeansPrepareData) {
        var row = [];
        for (var order in kmeansPrepareData[id]) {
          row.push(kmeansPrepareData[id][order]);
        }
        kmeansData.push(row);
      }
      var cluster = parseInt(req.param('cluster', 1));
      var result = kmeans(kmeansData, cluster);
      return res.send({
        success: true,
        data: result.centroids
      });
    }).catch(function(err) {
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Get board analytics summary
  getLBData: function (req, res) {
    Analytics.find({
      lb: req.param('board_id')
    }).populate('activity').sort('createdAt ASC').then(function(data){
      var userArray = [];
      var session = {};
      for (var i = 0; i < data.length; i++) {
        if (!session[data[i].session]) {
          session[data[i].session] = [];
        }
        if (userArray.indexOf(data[i].user) === -1) {
          userArray.push(data[i].user);
        }
        session[data[i].session].push(data[i]);
      }
      return res.send({
        success: true,
        data: {
          totalUser: userArray.length,
          session: session
        }
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Get activity analytics summary
  getActivityData: function (req, res) {
    Analytics.find({
      activity: req.param('activity_id')
    }).then(function(data){
      var userArray = [];
      var session = {};
      for (var i = 0; i < data.length; i++) {
        if (!session[data[i].session]) {
          session[data[i].session] = [];
        }
        if (userArray.indexOf(data[i].user) === -1) {
          userArray.push(data[i].user);
        }
        session[data[i].session].push(data[i]);
      }
      return res.send({
        success: true,
        data: {
          totalUser: userArray.length,
          session: session
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
