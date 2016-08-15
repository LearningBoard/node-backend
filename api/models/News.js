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
      type: 'text',
      required: true
    },

    lb: {
      model: 'learningboard',
      required: true
    },

    author: {
      model: 'user',
      required: true
    }
  }
};
