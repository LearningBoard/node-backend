/**
 * UserController
 *
 * @description :: Server-side logic for managing user
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');
var _super = require('sails-auth/api/controllers/UserController');

_.merge(exports, _super);
_.merge(exports, { // Override sails-auth method

  get: function (req, res) {
    var userObj;
    // Get basic info
    User.findOne({
      id: req.param('user_id')
    }).then(function(user) {
      if (!user) {
        return res.notFound({
          success: false,
          message: 'User not found'
        });
      }
      userObj = user.toObject();
      // Get followed board
      return LearningBoard.find({select: ['id', 'title']}).populate('follow', {where: {id: user.id}});
    }).then(function(learningboard) {
      var lb = learningboard.map(function(item) {
        var obj = item.toObject();
        if (item.follow.length < 1) {
          return null;
        }
        delete obj.follow;
        return obj;
      });
      userObj['followedlearningboard'] = lb.filter(function(item) {
        return item != null;
      });
      return Promise.resolve();
    }).then(function() {
      // Get recent activities
      return RequestLog.find({
        where: {
          user: req.param('user_id'),
          method: ['POST', 'PUT'],
          model: ['learningboard', 'activity']
        },
        select: ['method', 'url', 'body', 'model', 'createdAt'],
        sort: 'createdAt DESC',
        limit: 30
      });
    }).then(function(log) {
      // Filter log data
      var lbJobs = [];
      var hideFollowIdList = [];
      log = log.map(function(item) {
        var obj = item.toObject();
        // Map method to action
        switch (obj.method) {
          case 'POST': obj.action = 'create'; break;
          case 'PUT': obj.action = 'update'; break;
        }
        delete obj.method;
        // Filter unfollow
        var isFollowAction = obj.url.match(/\/follow\/(.*)$/);
        if (isFollowAction) {
          if (hideFollowIdList.indexOf(isFollowAction[1]) !== -1) {
            return null;
          } else if (obj.body.follow === false) {
            hideFollowIdList.push(isFollowAction[1]);
            return null;
          } else {
            obj.body['learningboard'] = isFollowAction[1];
          }
        }
        // Filter search
        var isSearch = obj.url.match(/\/search\//);
        if (isSearch) return null;
        // Fetch learning board detail for activity
        if (obj.body.learningboard) {
          lbJobs.push(
            LearningBoard.findOne({
              where: {
                id: obj.body.learningboard
              },
              select: ['id', 'title']
            })
          );
        } else {
          lbJobs.push(null);
        }
        delete obj.url;
        return obj;
      });
      Promise.all(lbJobs).then(function(result) {
        log.map(function(item, i) {
          if (item.body.learningboard) {
            item.body.learningboard = result[i];
          }
        });
        log.filter(function(item) {
          return item != null;
        });
        userObj['recentActivity'] = log.slice(0, 10);
        return res.send({
          success: true,
          data: {
            user: userObj
          }
        });
      });
    }).catch(function(err) {
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  update: function (req, res) {
    var allowKeys = ['email', 'info'];
    var data = Object.keys(req.body).reduce(function(result, key) {
      if (allowKeys.indexOf(key) !== -1) {
        result[key] = req.body[key];
      }
      return result;
    }, {});
    User.update({
      id: req.param('user_id')
    }, data).then(function(user){
      return res.send({
        success: true,
        data: {
          user: user[0]
        }
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  me: function (req, res) {
    return res.send({
      success: true,
      data: req.user
    });
  }

});
