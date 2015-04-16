'use strict';

angular.module('admin').factory('Users', ['$resource',
  function($resource) {
    return $resource('api/admin/users/:email');
}]);

angular.module('admin').factory('UserAuths', ['$resource',
  function($resource) {
    return $resource('/api/admin/user-auths/:code');
}]);
