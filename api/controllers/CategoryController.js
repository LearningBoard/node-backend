/**
 * CategoryController
 *
 * @description :: Server-side logic for managing category
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  getAll: function (req, res) {
    Category.find().exec(function(err, category){
      res.send({
        success: true,
        data: {
          category: category
        }
      });
    });
  }

};
