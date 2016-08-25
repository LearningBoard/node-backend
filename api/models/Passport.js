/**
 * Passport.js
 *
 * @description :: Passport model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var _ = require('lodash');
var _super = require('sails-permissions/api/models/Passport');

_.merge(exports, _super);
_.merge(exports, {

  attributes: {

    password: {
      type: 'string',
      minLength: 1
    }
  }

});
