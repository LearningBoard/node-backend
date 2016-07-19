/**
 * LearningBoard.js
 *
 * @description :: Learning Board model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: 'string',
      required: true
    },

    description: {
      type: 'text'
    },

    coverImage: {
      type: 'string'
    },

    author: {
      // TODO
    },

    category: {
      model: 'category'
    },

    level: {
      type: 'integer',
      enum: [0, 1, 2],
      defaultsTo: 0
    },

    tags: {
      model: 'tag'
    },

    publish: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
