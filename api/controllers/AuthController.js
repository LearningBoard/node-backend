/**
 * AuthController
 *
 * @description :: Server-side logic for managing auth
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');
var _super = require('sails-auth/api/controllers/AuthController');
var jwt = require('jsonwebtoken');

_.merge(exports, _super);
_.merge(exports, {

  // Override sails-auth success response
  callback: function (req, res) {
    var action = req.param('action');

    function negotiateError (err) {
      if (action === 'register') {
        res.redirect('/register');
      }
      else if (action === 'login') {
        res.redirect('/login');
      }
      else if (action === 'disconnect') {
        res.redirect('back');
      }
      else {
        // make sure the server always returns a response to the client
        // i.e passport-local bad username/email or password
        res.send(403, err);
      }
    }

    sails.services.passport.callback(req, res, function (err, user) {
      if (err || !user) {
        sails.log.warn(user, err);
        return negotiateError(err);
      }

      req.login(user, function (err) {
        if (err) {
          sails.log.warn(err);
          return negotiateError(err);
        }

        req.session.authenticated = true;

        // Upon successful login, optionally redirect the user if there is a
        // `next` query param
        if (req.query.next) {
          var url = sails.services.authservice.buildCallbackNextUrl(req);
          res.status(302).set('Location', url);
        }

        sails.log.info('user', user, 'authenticated successfully');
        User.findOne({username: user.username})
        .populate('roles', {select: ['id', 'name'], where: {active: true}})
        .exec(function(err, user){
          return res.json({
            success: true,
            data: {
              token: jwt.sign(user, sails.config.session.secret),
              user: user
            }
          });
        });
      });
    });
  }
});
