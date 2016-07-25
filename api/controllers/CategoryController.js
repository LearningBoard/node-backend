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
    }).then(function(category){
      return res.send({
        success: true,
        data: {
          category: category
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
