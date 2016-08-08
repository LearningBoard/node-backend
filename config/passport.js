// config/passport.js

var _ = require('lodash');
var _super = require('sails-auth/config/passport');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.
  passport: {
    facebook: {
      name: 'Facebook',
      protocol: 'oauth2',
      strategy: require('passport-facebook').Strategy,
      options: {
        clientID: '1677882592535443',
        clientSecret: '4d3684f12d348f91c5f63891c2f4fb27',
        enableProof: true,
        scope: ['public_profile', 'email'],
        profileFields: ['id', 'displayName', 'name', 'gender', 'link', 'email']
      }
    }
  }

});
