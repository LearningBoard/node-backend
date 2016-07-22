/**
 * Tag.js
 *
 * @description :: Tag model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    tag: {
      type: 'string',
      required: true,
      unique: true,
      minLength: 1
    }
  }
};
