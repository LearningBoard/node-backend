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
      defaultsTo: true
    },

    order: {
      type: 'integer',
      defaultsTo: 0
    },

    author: {
      model: 'user',
      required: true
    },

    like: {
      collection: 'user',
      via: 'likedactivities'
    }
  }
};
