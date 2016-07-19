/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  'GET /category': 'CategoryController.getAll',

  'GET /lb/get/:board_id': 'LearningBoardController.get',
  'GET /lb/load': 'LearningBoardController.getAll',
  'GET /lb/user_load': 'LearningBoardController.getAllByUser',
  'POST /lb/add': 'LearningBoardController.create',
  'PUT /lb/edit/:board_id': 'LearningBoardController.update',
  'DELETE /lb/delete/:board_id': 'LearningBoardController.delete',
  'POST /lb/publish/:board_id': 'LearningBoardController.publish',
  'POST /lb/unpublish/:board_id': 'LearningBoardController.unpublish',
  'POST /lb/follow': 'LearningBoardController.follow',
  'POST /lb/unfollow': 'LearningBoardController.unfollow',

  'GET /activity/get/:activity_id': 'ActivityController.get',
  'POST /activity/add/': 'ActivityController.create',
  'PUT /activity/edit/:activity_id': 'ActivityController.update',
  'DELETE /activity/delete/:activity_id': 'ActivityController.delete',
  'POST /activity/publish/:activity_id': 'ActivityController.publish',
  'POST /activity/unpublish/:activity_id': 'ActivityController.unpublish',
  'POST /activity/orderchange': 'ActivityController.orderchange',

  'GET /tag': 'TagController.getAll',
  'POST /tag': 'TagController.create',

  // 'GET /news/getAll': 'NewsController.getAll',
  'POST /news/add': 'NewsController.create'

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
