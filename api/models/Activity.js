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
    },

    complete: {
      collection: 'user',
      via: 'completedactivities'
    },

    toJSON: function (filter, user) {
      var obj = this.toObject();
      if (user && user.id && obj.complete) {
        obj.completed = obj.complete.filter(function(item){
          return item.id === user.id;
        }).length === 1;
      }
      // delete unwanted info
      if (filter && typeof filter.forEach === 'function') {
        filter.forEach(function(item){
          if (obj[item]) {
            delete obj[item];
          }
        });
      }
      return obj;
    }
  }
};
