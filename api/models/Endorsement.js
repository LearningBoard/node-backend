/**
 * Endorsement.js
 *
 * @description :: Endorsement model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: {
      type: 'user'
    },

    learningboard: {
      type: 'learningboard'
    }
  }
};
