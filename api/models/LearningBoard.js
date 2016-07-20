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
      model: 'user'
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
    },

    activities: {
      collection: 'activity',
      via: 'learningboard'
    },

    follow: {
      collection: 'follow',
      via: 'learningboard'
    },

    endorsement: {
      collection: 'endorsement',
      via: 'learningboard'
    },

    toJSON: function(returnDetail) {
      var obj = this.toObject();
      // statistics
      obj.activity_num = obj.activity ? obj.activity.length : 0;
      obj.following_num = obj.follow ? obj.follow.length : 0;
      obj.completed_num = -1; // TODO
      obj.endorsed_num = obj.endorsement ? obj.endorsement.length : 0;
      // parse related info
      if (!obj.tags) {
        obj.tags = [];
      }
      obj.image_url = -1; // TODO
      // delete unwanted info
      if (!returnDetail) {
        delete obj.activity;
      }
      delete obj.follow;
      delete obj.endorsement;
      return obj;
    }
  }
};
