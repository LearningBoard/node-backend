// services/passport.js

var _ = require('lodash');
var _super = require('sails-auth/api/services/passport');

_.merge(exports, _super);
_.merge(exports, { // Override sails-auth method

  connect: function (req, query, profile, next) {
    var user = { };

    req.session.tokens = query.tokens;

    // Get the authentication provider from the query.
    query.provider = req.param('provider');

    // Use profile.provider or fallback to the query.provider if it is undefined
    // as is the case for OpenID, for example
    var provider = profile.provider || query.provider;

    // If the provider cannot be identified we cannot match it to a passport so
    // throw an error and let whoever's next in line take care of it.
    if (!provider){
      return next(new Error('No authentication provider was identified.'));
    }

    sails.log.debug('auth profile', profile);

    // If the profile object contains a list of emails, grab the first one and
    // add it to the user.
    if (profile.emails && profile.emails[0]) {
      user.email = profile.emails[0].value;
    }
    // If the profile object contains a username, add it to the user.
    if (_.has(profile, 'username')) {
      user.username = profile.username;
    }

    // If neither an email or a username was available in the profile, we don't
    // have a way of identifying the user in the future. Throw an error and let
    // whoever's next in the line take care of it.
    if (!user.username && !user.email) {
      return next(new Error('Neither a username nor email was available'));
    }

    sails.models.passport.findOne({
        provider: provider,
        identifier: query.identifier.toString()
      })
      .then(function (passport) {
        if (!req.user) {
          // Scenario: A new user is attempting to sign up using a third-party
          //           authentication provider.
          // Action:   Create a new user and assign them a passport.
          if (!passport) {
            return sails.models.user.create(user)
              .then(function (_user) {
                user = _user;
                return sails.models.passport.create(_.extend({ user: user.id }, query))
              })
              .then(function (passport) {
                next(null, user);
              })
              .catch(next);

          }
          // Scenario: An existing user is trying to log in using an already
          //           connected passport.
          // Action:   Get the user associated with the passport.
          else {
            // If the tokens have changed since the last session, update them
            if (_.has(query, 'tokens') && query.tokens != passport.tokens) {
              passport.tokens = query.tokens;
            }

            // Save any updates to the Passport before moving on
            return passport.save()
              .then(function () {

                // Fetch the user associated with the Passport
                return sails.models.user.findOne(passport.user);
              })
              .then(function (user) {
                next(null, user);
              })
              .catch(next);
          }
        }
        else {
          // Scenario: A user is currently logged in and trying to connect a new
          //           passport.
          // Action:   Create and assign a new passport to the user.
          if (!passport) {
            return sails.models.passport.create(_.extend({ user: req.user.id }, query))
              .then(function (passport) {
                next(null, req.user);
              })
              .catch(next);
          }
          // Scenario: The user is a nutjob or spammed the back-button.
          // Action:   Simply pass along the already established session.
          else {
            next(null, req.user);
          }
        }
      })
      .catch(next)
  }

});
