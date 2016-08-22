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
      via: 'lb'
    },

    subscribe: {
      collection: 'user',
      via: 'subscribedlb'
    },

    like: {
      collection: 'user',
      via: 'likedlb'
    },

    toJSON: function (filter, user) {
      var obj = this.toObject();
      // statistics
      obj.activity_num = obj.activities.reduce(function(count, item) {
        if (item.publish) {
          return ++count;
        } else {
          return count;
        }
      }, 0);
      obj.activity_num_all = obj.activities ? obj.activities.length : 0;
      obj.like_num = obj.like ? obj.like.length : 0;
      obj.subscribing_num = obj.subscribe ? obj.subscribe.length : 0;
      var calculateCompletedNum = new Promise(function(resolve, reject) {
        if (!obj.activity_num) {
          obj.completed_num = 0;
          return resolve();
        }
        User.find({
          select: ['id', 'completedactivities']
        }).populate('completedactivities', {where: {lb: obj.id}, select: ['id']}).then(function(result) {
          var count = result.reduce(function(prev, item) {
            if (item.completedactivities.length === obj.activity_num) {
              return prev + 1;
            } else {
              return prev;
            }
          }, 0);
          obj.completed_num = count;
          resolve();
        }).catch(function(err) {
          obj.completed_num = 0;
          reject(err);
        });
      });
      // parse related info
      if (user && user.id) {
        var keyMapping = {subscribe: 'subscribing', like: 'liked'};
        for (var key in keyMapping) {
          if (!obj[key]) continue;
          obj[keyMapping[key]] = obj[key].filter(function(item){
            return item.id === user.id;
          }).length === 1;
        }
      }
      // delete unwanted info
      if (filter && typeof filter.forEach === 'function') {
        filter.forEach(function(item){
          if (obj[item]) {
            delete obj[item];
          }
        });
      }
      // Fetch activity details (currently ORM lack of deep populate support)
      var fetchActivityComment = null;
      if (obj.activities) {
        fetchActivityComment = new Promise(function(resolve, reject){
          var ids = [];
          obj.activities = obj.activities.reduce(function(array, item){
            if (item.publish || (user && obj.author.id === user.id)) {
              array.push(item);
              ids.push(item.id);
            }
            return array;
          }, []);
          Activity.find({
            id: ids
          }).sort('order ASC')
          .populate('author', {select: ['id', 'username']})
          .populate('complete')
          .populate('like')
          .then(function(act){
            var jobs = [];
            act.forEach(function(item, i){
              obj.activities[i] = item.toJSON(['complete', 'like'], user);
              jobs.push(Comment.find({
                activity: item.id
              }).populate('author', {select: ['id', 'username']}));
            });
            Promise.all(jobs).then(function(result) {
              result.forEach(function(item, i) {
                obj.activities[i]['comments'] = item;
              });
              resolve();
            });
          }).catch(function(err){
            reject(err);
          });
        });
      }
      return Promise.all([calculateCompletedNum, fetchActivityComment]).then(function(){
        return obj;
      }).catch(function(err){
        return obj;
      });
    }
  }
};
