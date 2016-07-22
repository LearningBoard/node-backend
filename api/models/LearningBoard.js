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

    // TODO may need to consider the type
    coverImage: {
      type: 'string'
    },

    author: {
      model: 'user',
      required: true
    },

    category: {
      model: 'category'
    },

    level: {
      type: 'integer',
      enum: [0, 1, 2], // 0 = beginner 1 = intermediate 2 = advanced
      defaultsTo: 0
    },

    tags: {
      collection: 'tag'
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
      collection: 'user',
      via: 'followedlearningboard'
    },

    endorsement: {
      collection: 'user',
      via: 'endorsedlearningboard'
    },

    like: {
      collection: 'user',
      via: 'likedlearningboard'
    },

    news: {
      collection: 'news',
      via: 'learningboard'
    },

    toJSON: function (filter, user) {
      var obj = this.toObject();
      // statistics
      obj.activity_num = obj.activities ? obj.activities.length : 0;
      obj.like_num = obj.like ? obj.like.length : 0;
      obj.following_num = obj.follow ? obj.follow.length : 0;
      obj.completed_num = -1; // TODO
      obj.endorsed_num = obj.endorsement ? obj.endorsement.length : 0;
      // parse related info
      if (user && user.id) {
        keyMapping = {follow: 'following', endorsement: 'endorsed', like: 'liked'};
        for (var key in keyMapping) {
          obj[keyMapping[key]] = obj[key].filter(function(item){
            return item.id === user.id;
          }).length > 0;
        }
      }
      obj.image_url = -1; // TODO
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
