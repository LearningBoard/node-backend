/**
 * FileController
 *
 * @description :: Server-side logic for managing file
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var dataurl = require('dataurl');
var mime = require('mime-types')
var md5 = require('md5');

var createFolder = function (path) {
  try {
    fs.mkdirSync(path);
    return Promise.resolve();
  } catch (err) {
    if (err.code === 'EEXIST') {
      return Promise.resolve();
    }
    return Promise.reject(err);
  }
};

module.exports = {

  create: function (req, res) {
    var fileObj;
    var path = require('path').resolve(sails.config.appPath, 'assets/media');
    return new Promise(function(resolve, reject){
      var file = dataurl.parse(req.body.data);
      if (!file) {
        reject('Invalid file');
      } else {
        file.extension = mime.extension(file.mimetype);
        resolve(file);
      }
    }).then(function(file){
      fileObj = file;
      return createFolder(path);
    }).then(function(){
      var filename = md5(fileObj.data) + '.' + fileObj.extension;
      try {
        var stream = fs.createWriteStream(path + '/' + filename);
        stream.write(fileObj.data);
        stream.end();
        return Promise.resolve(filename);
      } catch (err) {
        return Promise.reject(err);
      }
    }).then(function(filename){
      return res.created({
        success: true,
        data: {
          file: filename
        }
      });
    }).catch(function(err){
      return res.status(err.status || 500).send({
        success: false,
        message: err
      });
    });
  }

};
