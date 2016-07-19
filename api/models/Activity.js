/**
 * Activity.js
 *
 * @description :: Activity model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: 'string'
    },

    description: {
      type: 'text'
    },

    type: {
      type: 'string',
      required: true
    },

    data: {
      type: 'json'
    },

    learningboard: {
      model: 'learningboard'
    },

    publish: {
      type: 'boolean',
      defaultsTo: false
    },

    order: {
      type: 'integer',
      defaultsTo: 0
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

  beforeUpdate: function (activity, next) {
    activity.last_modified = Date.now;
    next();
  }
};
