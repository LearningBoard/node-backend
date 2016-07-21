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
        return res.status(403).send({
          success: false,
          message: 'Login required'
        });
      } else {
        constraint['follow.user'] = req.user.id;
      }
    }
    LearningBoard.find(constraint)
    .populate('author', {select: ['id', 'username']})
    .populate('category')
    .populate('tags')
    .populate('activities', {where: {publish: true}})
    .populate('follow')
    .populate('endorsement').exec(function(err, learningboard){
      if (err) {
        return res.serverError({
          success: false,
          message: err
        });
      } else {
        return res.send({
          success: true,
          data: {
            learningboard: learningboard
          }
        });
      }
    });
  },

  // Get single learning board
  get: function (req, res) {
    LearningBoard.findOne({
      id: req.param('board_id')
    })
    .populate('author', {select: ['id', 'username']})
    .populate('category')
    .populate('tags')
    .populate('activities', {where: {publish: true}})
    .populate('follow')
    .populate('endorsement').exec(function(err, learningboard){
      if (err) {
        return res.status(500).send({
          success: false,
          message: err
        });
      } else if (!learningboard) {
        return res.status(404).send({
          success: false,
          message: 'Learning Board not found'
        });
      } else {
        return res.send({
          success: true,
          data: {
            learningboard: learningboard.toJSON(true)
          }
        });
      }
    });
  },

  // Create new Learning Board
  create: function (req, res) {
    LearningBoard.create({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author_id,
      category: req.body.category,
      level: req.body.contentLevel
    }).exec(function(err, learningboard){
      if (err) {
        return res.status(500).send({
          success: false,
          message: err
        });
      } else {
        // Assign board id to tag
        // TODO need testing
        if (req.body['tag_list[]']) {
          learningboard.tag.add(req.body['tag_list[]']);
        }
        // Assign board id to previous saved activity
        // TODO need testing
        if (req.body['activity_list[]']) {
          learningboard.activity.add(req.body['activity_list[]']);
        }
        // TODO cover image
        // req.body.cover_img
        return res.send({
          success: true,
          data: {
            learningboard: learningboard
          }
        });
      }
    });
  },

  // Update existing Learning Board
  update: function (req, res) {
    LearningBoard.update({
      id: req.param('board_id')
    }, {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author_id,
      category: req.body.category,
      level: req.body.contentLevel
    }).exec(function(err, learningboard){
      if (err) {
        return res.status(500).send({
          success: false,
          message: err
        });
      } else {
        // TODO tag list
        // TODO cover image
        return res.send({
          success: true,
          data: {
            learningboard: learningboard
          }
        });
      }
    });
  },

  // Delete existing Learning Board
  delete: function (req, res) {
    LearningBoard.destroy({
      id: req.param('board_id')
    }).exec(function(err){
      if (err) {
        return res.status(500).send({
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

  // Set Learning Board public
  publish: function (req, res) {
    LearningBoard.update({
      id: req.param('board_id')
    }, {
      publish: req.body.publish || false
    }).exec(function(err, learningboard){
      if (err) {
        return res.status(500).send({
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

  // Handle user request for following Learning Board
  follow: function (req, res) {
    Follow.findOrCreate({
      user: req.user.id,
      learningboard: req.param('board_id')
    }).exec(function(err, follow){
      if (err) {
        return res.status(500).send({
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

  // Handle user request for unfollowing Learning Board
  unfollow: function (req, res) {
    Follow.destroy({
      user: req.user.id,
      learningboard: req.param('board_id')
    }).exec(function(err, follow){
      if (err) {
        return res.status(500).send({
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

  // Change activities order inside Learning Board
  orderchange: function (req, res) {
    var keys = [], values = [];
    for (var key in req.body) {
      keys.push({id: key});
      values.push({order: req.body[key]});
    }
    Activity.update(keys, values).exec(function(err, activity){
      if (err) {
        return res.status(500).send({
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
