/**
 * AnalyticsController
 *
 * @description :: Server-side logic for managing analytics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  _config: {
    rest: true
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
        if (userArray.indexOf(data[i].user)) {
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
