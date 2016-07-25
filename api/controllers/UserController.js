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

  me: function (req, res) {
    return res.send({
      success: true,
      data: req.user
    });
  }

});
