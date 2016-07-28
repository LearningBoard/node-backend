/**
 * LearningBoard.js
 *
 * @description :: Learning Board model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var sortActivityOrder = function(a, b){ // currently ORM populate sort have some problem
  if (a.order > b.order) {
    return 1;
  }
  if (a.order < b.order) {
    return -1;
  }
  return 0;
};

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
        var keyMapping = {follow: 'following', endorsement: 'endorsed', like: 'liked'};
        for (var key in keyMapping) {
          if (!obj[key]) continue;
          obj[keyMapping[key]] = obj[key].filter(function(item){
            return item.id === user.id;
          }).length === 1;
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
      // Fetch activity comment (currently ORM lack of deep populate support)
      var fetchActivityComment = null;
      if (obj.activities && filter.indexOf('activities') === -1) {
        fetchActivityComment = new Promise(function(resolve, reject){
          var ids = obj.activities.map(function(item){
            return item.id;
          });
          Activity.find({
            id: ids
          }).populate('comments').then(function(comment){
            comment.forEach(function(item, i){
              obj.activities[i] = item;
            });
            resolve();
          }).catch(function(err){
            reject(err);
          });
        });
      }
      return Promise.all([fetchActivityComment]).then(function(){
        if (obj.activities) {
          obj.activities.sort(sortActivityOrder);
        }
        return obj;
      }).catch(function(err){
        if (obj.activities) {
          obj.activities.sort(sortActivityOrder);
        }
        return obj;
      });
    }
  }
};
