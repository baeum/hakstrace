var adminUserServerController = require('../controllers/admin-user.server.controller');

module.exports = function(app) {
  //app.get('/admin', adminServerController.renderAdmin);

  //app.get('/admin/blocks/adminHeader', adminServerController.renderAdminHeader);


  app.route('/api/admin/users')
    .get(adminUserServerController.listUserSearchFilter, adminUserServerController.listUser)
    //.post(users.requiresLogin, articles.create);
    .post(adminUserServerController.createUser);
  app.route('/api/admin/users/:email')
    .get(adminUserServerController.getUser)
    .put(adminUserServerController.updateUser)
    .delete(adminUserServerController.deleteUser);
    /*
  app.route('/api/articles/:articleId')
    .get(articles.read)
    .put(users.requiresLogin, articles.hasAuthorization, articles.update)
    .delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

  app.param('articleId', articles.articleByID); // 파라미터에 articleId 가 있으면 저 펑션 호출
  */

  app.route('/api/admin/user-auths')
    .get(adminUserServerController.listUserAuth);

};
