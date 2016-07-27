/**
 * Comment.js
 *
 * @description :: Comment model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    comment: {
      type: 'text',
      required: true
    },

    author: {
      model: 'user',
      required: true
    },

    activity: {
      model: 'activity',
      required: true
    }

  }
};
