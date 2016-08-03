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
        constraint.or = [
          {publish: true},
          {author: req.user.id}
        ];
      }
    } else {
      constraint.publish = true;
    }
    LearningBoard.find(constraint)
    .populate('author', {select: ['id', 'username']})
    .populate('category', {select: ['id', 'name']})
    .populate('tags', {select: ['id', 'tag']})
    .populate('activities', {where: {publish: true}})
    .populate('follow')
    .populate('endorsement').then(function(learningboard){
      var jobs = [];
      var learningboard = learningboard.map(function(lb){
        if (req.query.hasOwnProperty('user')) {
          for (var user of lb.follow) {
            if (user.id === req.user.id) {
              jobs.push(lb.toJSON(['activities', 'like', 'follow', 'endorsement']).then(function(lb){
                return lb;
              }));
              break;
            }
          }
        } else {
          jobs.push(lb.toJSON(['activities', 'like', 'follow', 'endorsement']).then(function(lb){
            return lb;
          }));
        }
        return null;
      });
      Promise.all(jobs).then(function(result){
        return res.send({
          success: true,
          data: {
            learningboard: result
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
    .populate('follow')
    .populate('endorsement').then(function(learningboard){
      if (!learningboard) {
        return res.notFound({
          success: false,
          message: 'Learning Board not found'
        });
      } else {
        return learningboard.toJSON(['like', 'follow', 'endorsement'], req.user).then(function(lb){
          return res.send({
            success: true,
            data: {
              learningboard: lb
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
      // Assign board id to tag
      if (req.body.tags) {
        learningboard.tags.add(req.body.tags);
        return learningboard.save();
      }
      return Promise.resolve();
    }).then(function(){
      return updateActivityOrder(req.body.activities)
    }).then(function(){
      return res.created({
        success: true,
        data: {
          learningboard: lb.toObject()
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
    }, Object.assign(req.body, {tags: []})).then(function(learningboard){
      lb = learningboard[0];
      // Assign board id to tag
      if (req.body.tags && req.body.tags.length > 0) {
        learningboard.tags.add(req.body.tags);
        return learningboard.save();
      }
      return Promise.resolve();
    }).then(function(){
      return updateActivityOrder(req.body.activities);
    }).then(function(){
      return res.send({
        success: true,
        data: {
          learningboard: lb.toObject()
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

  // Handle user request for following Learning Board
  follow: function (req, res) {
    LearningBoard.findOne({
      id: req.param('board_id')
    }).populate('follow').then(function(learningboard){
      if (req.body.follow) {
        learningboard.follow.add(req.user.id);
      } else {
        learningboard.follow.remove(req.user.id);
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
  }

};
