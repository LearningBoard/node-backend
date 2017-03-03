/**
 * Analytics.js
 *
 * @description :: Analytics model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: {
      model: 'user'
    },

    lb: {
      model: 'learningboard'
    },

    data: {
      type: 'json',
      defaultsTo: {}
    }
  }
};
