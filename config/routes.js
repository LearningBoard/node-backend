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

  'GET /user/me': 'UserController.me',

  'GET /category': 'CategoryController.getAll',

  'POST /lb/publish/:board_id': 'LearningBoardController.publish',
  'POST /lb/follow/:board_id': 'LearningBoardController.follow',
  'GET /lb': 'LearningBoardController.getAll',
  'POST /lb': 'LearningBoardController.create',
  'GET /lb/:board_id': 'LearningBoardController.get',
  'PUT /lb/:board_id': 'LearningBoardController.update',
  'DELETE /lb/:board_id': 'LearningBoardController.delete',

  'POST /activity/publish/:activity_id': 'ActivityController.publish',
  'POST /activity/complete/:activity_id': 'ActivityController.complete',
  'POST /activity/like/:activity_id': 'ActivityController.like',
  'POST /activity': 'ActivityController.create',
  'GET /activity/:activity_id': 'ActivityController.get',
  'PUT /activity/:activity_id': 'ActivityController.update',
  'DELETE /activity/:activity_id': 'ActivityController.delete',

  'POST /comment': 'CommentController.create',

  'GET /tag': 'TagController.getAll',
  'POST /tag': 'TagController.create',

  'GET /news': 'NewsController.getAll',
  'POST /news': 'NewsController.create',

  'POST /search/lb': 'LearningBoard.search',

  'POST /media': 'FileController.create'

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
