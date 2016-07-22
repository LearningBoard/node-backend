/**
 * CategoryController
 *
 * @description :: Server-side logic for managing category
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // Get all category
  getAll: function (req, res) {
    Category.find({
      select: ['id', 'category']
    }).exec(function(err, category){
      if (err) {
        return res.serverError({
          success: false,
          message: err
        });
      } else {
        return res.send({
          success: true,
          data: {
            category: category
          }
        });
      }
    });
  }

};
