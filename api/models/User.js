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

    info: {
      type: 'json',
      defaultsTo: {}
    },

    subscribedlb: {
      collection: 'learningboard',
      via: 'subscribe',
      dominant: true
    },

    likedlb: {
      collection: 'learningboard',
      via: 'like',
      dominant: true
    },

    likedactivities: {
      collection: 'activity',
      via: 'like',
      dominant: true
    },

    completedactivities: {
      collection: 'activity',
      via: 'complete',
      dominant: true
    }
  }

});
