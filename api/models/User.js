/**
 * User.js
 *
 * @description :: User model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var _ = require('lodash');
var _super = require('sails-permissions/api/models/User');

_.merge(exports, _super);
_.merge(exports, {

  attributes: {
    followedlearningboard: {
      collection: 'learningboard',
      via: 'follow',
      dominant: true
    },

    endorsedlearningboard: {
      collection: 'learningboard',
      via: 'endorsement',
      dominant: true
    },

    likedlearningboard: {
      collection: 'learningboard',
      via: 'like',
      dominant: true
    },

    likedactivities: {
      collection: 'activity',
      via: 'like',
      dominant: true
    }
  }

});
