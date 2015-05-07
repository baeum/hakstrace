'use strict';

/**
 * Config for the router
 */
angular.module('admin').config(['$stateProvider', '$routeProvider',
  function($stateProvider, $routeProvider) {

  $stateProvider
      .state('app.admin', {
          url: '/admin',
          templateUrl: '/admin'
      })
      .state('app.admin.user', {
          url: '/user',
          templateUrl: '/admin/views/admin-user-list.client.view.html'
      })
      .state('app.admin.script', {
          url: '/script',
          templateUrl: '/admin/views/admin-script.client.view.html'
      });
      // main dashboard



	//$routeProvider.when('/admin/user', {
	//		templateUrl: '/admin/views/admin-user-list.client.view.html'
 	//	});
	//}
}]);
