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
    var logObj;
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
      userObj['followedlearningboard'] = learningboard.reduce(function(result, item) {
        if (item.follow.length > 0) {
          var obj = item.toObject();
          delete obj.follow;
          result.push(obj);
        }
        return result;
      }, []);
      return Promise.resolve();
    }).then(function() {
      // Get recent activities
      return RequestLog.find({
        where: {
          user: req.param('user_id'),
          method: ['POST', 'PUT'],
          model: ['learningboard', 'activity', 'comment']
        },
        select: ['method', 'url', 'body', 'model', 'createdAt'],
        sort: 'createdAt DESC',
        limit: 30
      });
    }).then(function(log) {
      logObj = log;
      // Filter log data
      var lbJobs = [];
      var hideIdList = {};
      logObj = logObj.reduce(function(result, item) {
        var obj = item.toObject();
        // Map method to action
        switch (obj.method) {
          case 'POST': obj.action = 'create'; break;
          case 'PUT': obj.action = 'update'; break;
        }
        delete obj.method;
        // Filter actions on Learning Board / Activity
        var actionFilterMapping = [
          {key: 'follow', value: false, regex: /\/follow\/(\d+)\/?$/, position: 1},
          {key: 'like', value: false, regex: /\/like\/(\d+)\/?$/, position: 1},
          {key: 'complete', value: false, regex: /\/complete\/(\d+)\/?$/, position: 1},
          {key: 'publish', value: false, regex: /\/publish\/(\d+)\/?$/, position: 1}
        ];
        var shouldFilter = actionFilterMapping.some(function(filter) {
          var isAction = obj.url.match(filter.regex);
          if (isAction) {
            if (!hideIdList[filter.key] || typeof hideIdList[filter.key].push !== 'function') {
              hideIdList[filter.key] = [];
            }
            if (hideIdList[filter.key].indexOf(isAction[filter.position]) !== -1) {
              return true;
            } else if (obj.body[filter.key] === filter.value) {
              hideIdList[filter.key].push(isAction[filter.position]);
              return true;
            } else {
              obj.body['learningboard'] = isAction[filter.position];
            }
          }
        });
        if (shouldFilter) return result;
        // Filter search
        var isSearch = obj.url.match(/\/search\//);
        if (isSearch) return result;
        // Fetch learning board detail for activity
        if (obj.body && obj.body.learningboard) {
          lbJobs.push(
            LearningBoard.findOne({
              where: {
                id: obj.body.learningboard
              },
              select: ['id', 'title']
            })
          );
        // Fetch activity detail
        } else if (obj.body && obj.body.activity) {
          lbJobs.push(
            Activity.findOne({
              where: {
                id: obj.body.activity
              },
              select: ['id', 'title', 'learningboard']
            }).populate('learningboard', {select: ['id', 'title']})
          );
        } else {
          lbJobs.push(null);
        }
        delete obj.url;
        result.push(obj);
        return result;
      }, []);
      return Promise.all(lbJobs);
    }).then(function(jobResult) {
      userObj['recentActivity'] = logObj.reduce(function(result, item, i) {
        if (i > 10) return result;
        if (item.body && item.body.learningboard) {
          item.body.learningboard = jobResult[i].toObject();
        } else if (item.body && item.body.activity) {
          jobResult[i].learningboard = jobResult[i].learningboard.toObject();
          item.body.activity = jobResult[i].toObject();
        }
        result.push(item);
        return result;
      }, []);
      return res.send({
        success: true,
        data: {
          user: userObj
        }
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
