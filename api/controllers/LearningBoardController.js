/**
 * LearningBoardController
 *
 * @description :: Server-side logic for managing Learning Board
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  get: function (req, res) {
    LearningBoard.find({
      id: req.param('board_id')
    }).exec(function(err, learningboard){
      if (learningboard.length < 1) {
        res.status(404).send({
          success: false,
          message: 'target not found'
        });
      } else {
        res.send({
          success: true,
          data: {
            // TODO serialize, tag + activity
            learningboard: learningboard
          }
        });
      }
    });
  },

  getAll: function (req, res) {
    LearningBoard.find({
      publish: true
    }).exec(function(err, learningboard){
      res.send({
        success: true,
        data: {
          learningboard: learningboard
        }
      });
    });
  },

  getAllByUser: function (req, res) {
    if (!req.body || !req.body.user_id) {
      res.status(403).send({
        success: false,
        message: 'Login required'
      })
      return;
    }
    // TODO fix correct query
    LearningBoard.find().exec(function(err, learningboard){
      res.send({
        success: true,
        data: {
          learningboard: learningboard
        }
      })
    });
  },

  create: function (req, res) {
    LearningBoard.create({
      // TODO missing parameters
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      level: req.body.contentLevel
    }).exec(function(err, learningboard){
      res.send({
        success: true,
        data: {
          learningboard: learningboard
        }
      })
    });
  },

  update: function (req, res) {
    LearningBoard.update({
      id: req.param('board_id')
    }, {
      // TODO missing parameters
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      level: req.body.contentLevel
    }).exec(function(err, learningboard){
      res.send({
        success: true,
        data: {
          learningboard: learningboard
        }
      });
    });
  },

  delete: function (req, res) {
    LearningBoard.destroy({
      id: req.param('board_id')
    }).exec(function(err){
      res.send({
        success: true
      });
    });
  },

  publish: function (req, res) {
    LearningBoard.update({
      id: req.param('board_id')
    }, {
      publish: true
    }).exec(function(err, learningboard){
      res.send({
        success: true
      })
    });
  },

  unpublish: function (req, res) {
    LearningBoard.update({
      id: req.param('board_id')
    }, {
      publish: false
    }).exec(function(err, learningboard){
      res.send({
        success: true
      })
    });
  },

  follow: function (req, res) {
    Follow.findOrCreate({
      // TODO correct param name
      user: req.body.user,
      learningboard: req.body.learningboard
    }).exec(function(err, follow){
      res.send({
        success: true
      });
    });
  },

  unfollow: function (req, res) {
    Follow.destroy({
      // TODO correct param name
      user: req.body.user,
      learningboard: req.body.learningboard
    }).exec(function(err, follow){
      res.send({
        success: true
      });
    });
  }

};
