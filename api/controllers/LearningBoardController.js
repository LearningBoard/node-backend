/**
 * LearningBoardController
 *
 * @description :: Server-side logic for managing Learning Board
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // Get all published learning board general infomation
  getAll: function (req, res) {
    var constraint = {
      publish: true
    };
    if (req.query.hasOwnProperty('user')) {
      if (!req.session.authenticated) {
        return res.forbidden({
          success: false,
          message: 'Login required'
        });
      } else {
        constraint['follow.user'] = req.user.id;
      }
    }
    LearningBoard.find(constraint)
    .populate('author', {select: ['id', 'username']})
    .populate('category', {select: ['id', 'name']})
    .populate('tags', {select: ['id', 'tag']})
    .populate('activities', {where: {publish: true}})
    .populate('follow')
    .populate('endorsement').then(function(learningboard){
      var learningboard = learningboard.map(function(lb){
        return lb.toJSON(['activities', 'like', 'follow', 'endorsement']);
      });
      return res.send({
        success: true,
        data: {
          learningboard: learningboard
        }
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
        return res.send({
          success: true,
          data: {
            learningboard: learningboard.toJSON(['like', 'follow', 'endorsement'], req.user)
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

  // Create new Learning Board
  create: function (req, res) {
    LearningBoard.create(req.body).then(function(learningboard){
      Promise.resolve(learningboard);
    }).then(function(learningboard){
      var needUpdate = false;
      // Assign board id to tag
      if (req.body['tag_list[]']) {
        learningboard.tags.add(req.body['tag_list[]']);
        needUpdate = true;
      }
      // Assign board id to previous saved activity
      if (req.body['activity_list[]']) {
        learningboard.activities.add(req.body['activity_list[]']);
        needUpdate = true;
      }
      // TODO handle cover image
      if (needUpdate) {
        learningboard.save();
      } else {
        Promise.resolve(learningboard);
      }
    }).then(function(learningboard){
      return res.created({
        success: true,
        data: {
          learningboard: learningboard
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
    LearningBoard.update({
      id: req.param('board_id')
    }, Object.assign(req.body, {tags: []})).then(function(learningboard){
      Promise.resolve(learningboard);
    }).then(function(learningboard){
      var needUpdate = false;
      // Assign board id to tag
      if (req.body['tag_list[]']) {
        learningboard.tags.add(req.body['tag_list[]']);
        needUpdate = true;
      }
      // TODO handle cover image
      if (needUpdate) {
        learningboard.save();
      } else {
        Promise.resolve(learningboard);
      }
    }).then(function(learningboard){
      return res.send({
        success: true,
        data: {
          learningboard: learningboard
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
      learningboard.save();
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

  // Change activities order inside Learning Board
  orderchange: function (req, res) {
    var keys = [], values = [];
    for (var key in req.body) {
      keys.push({id: key});
      values.push({order: req.body[key]});
    }
    Activity.update(keys, values).then(function(activity){
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
