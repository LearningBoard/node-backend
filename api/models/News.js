/**
 * News.js
 *
 * @description :: News model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: 'string'
    },

    text: {
      type: 'text'
    },

    learningboard: {
      model: 'learningboard'
    },

    author: {
      // TODO
    },

    last_modified: {
      type: 'datetime'
    },

    post_time: {
      type: 'datetime',
      defaultsTo: Date.now
    }
  },

  beforeUpdate: function (news, next) {
    news.last_modified = Date.now;
    next();
  }
};
