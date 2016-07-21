/**
 * jwtAuth
 *
 * If HTTP JWT Bearer Auth credentials are present in the headers, then authenticate the
 * user for a single request.
 */
var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  var auth = req.headers.authorization;
  if (!auth || auth.search('Bearer ') !== 0) {
    return next();
  }

  var authString = auth.split(' ');
  var token = authString[1];

  sails.log.silly('authenticating using JWT Bearer auth:', req.url);

  jwt.verify(token, sails.config.session.secret, function(err, user) {
    if (err || !user) {
      return res.forbidden({
        success: false,
        message: 'Invalid token'
      });
    }
    req.user = user;
    req.session.authenticated = true;
    return next();
  });
};
