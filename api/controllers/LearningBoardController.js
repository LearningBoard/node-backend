/**
 * LearningBoardController
 *
 * @description :: Server-side logic for managing Learning Board
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 // Change activities order inside Learning Board
 var updateActivityOrder = function(activityIds) {
   var order = 0;
   var jobs = [];
   for (var key of activityIds) {
     jobs.push(Activity.update(key, {
       order: order++
     }));
   }
   return Promise.all(jobs);
 };

module.exports = {

  // Get all published learning board general infomation
  getAll: function (req, res) {
    var constraint = {};
    if (req.query.hasOwnProperty('user')) {
      if (!req.session.authenticated) {
        return res.forbidden({
          success: false,
          message: 'Login required'
        });
      } else {
        if (req.param('user')) {
          constraint.publish = true;
          constraint.author = req.param('user');
        } else {
          constraint.or = [
            {publish: true},
            {author: req.user.id}
          ];
        }
      }
    } else {
      constraint.publish = true;
    }
    LearningBoard.find(constraint)
    .populate('author', {select: ['id', 'username']})
    .populate('category', {select: ['id', 'name']})
    .populate('tags', {select: ['id', 'tag']})
    .populate('activities', {where: {publish: true}})
    .populate('subscribe')
    .populate('endorsement').then(function(learningboard){
      var hiddenForOutput = ['activities', 'like', 'subscribe', 'endorsement', 'createdBy', 'owner', 'createdAt', 'updatedAt'];
      var jobs = [];
      var learningboard = learningboard.map(function(lb){
        if (req.query.hasOwnProperty('user') && !req.param('user')) {
          if (lb.author.id === req.user.id) {
            return jobs.push(lb.toJSON(hiddenForOutput).then(function(lb){
              return lb;
            }));
          }
          for (var user of lb.subscribe) {
            if (user.id === req.user.id) {
              jobs.push(lb.toJSON(hiddenForOutput).then(function(lb){
                return lb;
              }));
              break;
            }
          }
        } else {
          jobs.push(lb.toJSON(hiddenForOutput).then(function(lb){
            return lb;
          }));
        }
        return null;
      });
      Promise.all(jobs).then(function(result){
        return res.send({
          success: true,
          data: {
            lb: result
          }
        });
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Get single learning board
  get: function (req, res) {
    LearningBoard.findOne({
      id: req.param('board_id')
    })
    .populate('author', {select: ['id', 'username']})
    .populate('category', {select: ['id', 'name']})
    .populate('tags', {select: ['id', 'tag']})
    .populate('activities', {where: {publish: true}})
    .populate('subscribe')
    .populate('endorsement').then(function(learningboard){
      if (!learningboard) {
        return res.notFound({
          success: false,
          message: 'Learning Board not found'
        });
      } else {
        var hiddenForOutput = ['like', 'subscribe', 'endorsement', 'createdBy', 'owner', 'createdAt', 'updatedAt'];
        return learningboard.toJSON(hiddenForOutput, req.user).then(function(lb){
          return res.send({
            success: true,
            data: {
              lb: lb
            }
          });
        });
      }
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Create new Learning Board
  create: function (req, res) {
    var lb;
    LearningBoard.create(req.body).then(function(learningboard){
      lb = learningboard;
      return updateActivityOrder(req.body.activities)
    }).then(function(){
      return res.created({
        success: true,
        data: {
          lb: lb.toObject()
        }
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Update existing Learning Board
  update: function (req, res) {
    var lb;
    LearningBoard.update({
      id: req.param('board_id')
    }, req.body).then(function(learningboard){
      lb = learningboard[0];
      return updateActivityOrder(req.body.activities);
    }).then(function(){
      return res.send({
        success: true,
        data: {
          lb: lb.toObject()
        }
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  },

  // Delete existing Learning Board
  delete: function (req, res) {
    LearningBoard.destroy({
      id: req.param('board_id')
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

  // Set Learning Board public
  publish: function (req, res) {
    LearningBoard.update({
      id: req.param('board_id')
    }, {
      publish: req.body.publish || false
    }).then(function(learningboard){
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

  // Handle user request for subscribing Learning Board
  subscribe: function (req, res) {
    LearningBoard.findOne({
      id: req.param('board_id')
    }).populate('subscribe').then(function(learningboard){
      if (req.body.subscribe) {
        learningboard.subscribe.add(req.user.id);
      } else {
        learningboard.subscribe.remove(req.user.id);
      }
      return learningboard.save();
    }).then(function(learningboard){
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

  search : function (req, res) {
    LearningBoard.find({
      title: {
        'contains': req.param('keyword')
      },
      publish: true
    })
    .populate('author', {select: ['id', 'username']})
    .populate('category', {select: ['id', 'name']})
    .populate('tags', {select: ['id', 'tag']})
    .populate('activities', {where: {publish: true}})
    .populate('subscribe')
    .populate('endorsement').then(function(learningboard){
      var hiddenForOutput = ['activities', 'like', 'subscribe', 'endorsement', 'createdBy', 'owner', 'createdAt', 'updatedAt'];
      var jobs = [];
      var learningboard = learningboard.map(function(lb){
        jobs.push(lb.toJSON(hiddenForOutput).then(function(lb){
          return lb;
        }));
        return null;
      });
      Promise.all(jobs).then(function(result){
        return res.send({
          success: true,
          data: {
            lb: result
          }
        });
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  }

};
