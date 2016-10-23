/**
 * AuthController
 *
 * @description :: Server-side logic for managing auth
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');
var _super = require('sails-auth/api/controllers/AuthController');
var jwt = require('jsonwebtoken');
var request = require('request-promise-native');

var tokenExpiresIn = 60 * 60 * 24; // second
if (sails.config.session && sails.config.session.cookie && sails.config.session.cookie.maxAge) {
  tokenExpiresIn = sails.config.session.cookie.maxAge / 1000;
}

_.merge(exports, _super);
_.merge(exports, { // Override sails-auth method

  logout: function (req, res) {
    req.logout();
    delete req.user;
    delete req.session.passport;
    req.session.authenticated = false;
    res.send({
      success: true
    });
  },

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
        res.send(403, {
          success: false,
          message: err
        });
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
        User.findOne({id: user.id})
        .populate('roles', {select: ['id', 'name'], where: {active: true}})
        .populate('passports', {select: ['protocol', 'provider', 'identifier', 'tokens']})
        .then(function(user){
          return res.json({
            success: true,
            data: {
              token: jwt.sign(user, sails.config.session.secret, {
                expiresIn: tokenExpiresIn
              }),
              user: user
            }
          });
        }).catch(function(err){
          return res.status(err.status || 500).send({
            success: false,
            message: err
          });
        });
      });
    });
  },

  // Special endpoint for oauth access token callback
  callbackAccessToken: function (req, res) {
    Promise.resolve().then(function() {
      if (req.param('provider') === 'facebook') { // Verify access token
        return request({
          url: `https://graph.facebook.com/${req.body.identifier}?access_token=${req.body.accessToken}`
        });
      }
      return Promise.resolve();
    }).then(function() {
      var query = {
        identifier: req.body.identifier,
        protocol: 'oauth2',
        tokens: { accessToken: req.body.accessToken }
      };

      if (!_.isUndefined(req.body.refreshToken)) {
        query.tokens.refreshToken = req.body.refreshToken;
      }

      var profile = {};
      if (req.body.username) {
        profile.username = req.body.username;
      }
      if (req.body.email) {
        profile.emails = [req.body.email];
      }

      sails.services.passport.connect(req, query, profile, function (err, user) {
        if (err || !user) {
          sails.log.warn(user, err);
          return res.send(403, {
            success: false,
            message: err
          });
        }

        req.login(user, function (err) {
          if (err) {
            sails.log.warn(err);
            return res.send(403, {
              success: false,
              message: err
            });
          }

          req.session.authenticated = true;

          // Upon successful login, optionally redirect the user if there is a
          // `next` query param
          if (req.query.next) {
            var url = sails.services.authservice.buildCallbackNextUrl(req);
            res.status(302).set('Location', url);
          }

          sails.log.info('user', user, 'authenticated successfully');
          User.findOne({id: user.id})
          .populate('roles', {select: ['id', 'name'], where: {active: true}})
          .populate('passports', {select: ['protocol', 'provider', 'identifier', 'tokens']})
          .then(function(user){
            return res.json({
              success: true,
              data: {
                token: jwt.sign(user, sails.config.session.secret, {
                  expiresIn: tokenExpiresIn
                }),
                user: user
              }
            });
          }).catch(function(err){
            return res.status(err.status || 403).send({
              success: false,
              message: err
            });
          });
        });
      });
    }).catch(function(err) {
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  }
});
