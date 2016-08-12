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

  me: function (req, res) {
    return res.send({
      success: true,
      data: req.user
    });
  }

});
