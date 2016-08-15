/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

 // Init permission for different roles
  var registeredPermission = [
    {role: 'registered', model: 'LearningBoard', action: 'update', relation: 'owner'},
    {role: 'registered', model: 'LearningBoard', action: 'delete', relation: 'owner'},
    {role: 'registered', model: 'Activity', action: 'update', relation: 'owner'},
    {role: 'registered', model: 'Activity', action: 'delete', relation: 'owner'},
    {role: 'registered', model: 'Comment', action: 'update', relation: 'owner'},
    {role: 'registered', model: 'Comment', action: 'delete', relation: 'owner'},
    {role: 'registered', model: 'News', action: 'update', relation: 'owner'},
    {role: 'registered', model: 'News', action: 'delete', relation: 'owner'},
    {role: 'registered', model: 'User', action: 'read', relation: 'role'}
  ];
  var revokePermission = [
    {role: 'registered', model: 'SecurityLog', action: 'read', relation: 'role'},
    {role: 'registered', model: 'Category', action: 'create', relation: 'role'}
  ];
  var revokeJobs = revokePermission.map(function(value){
    return PermissionService.revoke(value);
  });
  Promise.all(revokeJobs).then(function(){
    return Role.findOne({
      name: 'registered'
    });
  }).then(function(role){
    var grantJobs = registeredPermission.map(function(value){
      return Model.findOne({name: value.model}).then(function(model){
        return Permission.findOrCreate(Object.assign(value, {role: role.id, model: model.id}))
      });
    });
    return Promise.all(grantJobs);
  }).then(function(result){
    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
  }).catch(function(err){
    cb();
  });
};
