/**
 * Follow.js
 *
 * @description :: Follow model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: {
      type: 'user'
    },

    learningboard: {
      model: 'learningboard'
    }
  }
};
