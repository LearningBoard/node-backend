/**
 * Category.js
 *
 * @description :: Category model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    category: {
      type: 'string',
      required: true,
      minLength: 1
    }
  }
};
