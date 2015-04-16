'use strict';

angular.module('admin').factory('Users', ['$resource',
  function($resource) {
    return $resource('api/admin/users/:userId', {
        articleId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
}]);

angular.module('admin').factory('UserAuths', ['$resource',
  function($resource) {
    return $resource('/api/admin/user-auths/:code');
}]);
