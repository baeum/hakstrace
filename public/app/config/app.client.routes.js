'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
  ['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

    }
  ]
)
  .config(
  ['$stateProvider', '$urlRouterProvider', '$routeProvider', 'JQ_CONFIG',
    function ($stateProvider, $urlRouterProvider, $routeProvider, JQ_CONFIG) {

      //$urlRouterProvider
      //      .otherwise('/dashboard-v2');

      $stateProvider
        .state('app', {
          abstract: true, // abstract <-- 이거 상속 같은 개념임. 중요함
          templateUrl: '/app/views/app.client.view.html'
        })
        // main -- on testing something(use project main page temporarily)
        // TODO : write main page for redirecting to signin page or dashboard
        .state('app.main', {
          url: '',
          templateUrl: '/project/views/project-list.client.view.html'
        })
        // main dashboard
        .state('app.dashboard', {
          url: '/dashboard',
          templateUrl: '/app/views/app_dashboard_v2.html'
        })

        .state('access', {
          abstract: true,
          template: '<div ui-view class="fade-in-right-big smooth"></div>'
        })
        .state('access.signin', {
          url: '/signin',
          templateUrl: 'app/views/app-access-signin.client.view.html'
        })
        .state('access.signout', {
          url: '/signout',
          controller: function ($scope, $http, $state, $localStorage) {
            delete $localStorage.session;
            $http({method: 'POST', url: '/api/access/signout'})
              .then(function (data) {
              $state.go('access.signin');
            });
          }
        })
        .state('access.signup', {
          url: '/signup',
          templateUrl: 'app/views/app-access-signup.client.view.html'
        })
        .state('access.forgotpwd', {
          url: '/forgotpwd',
          templateUrl: 'app/views/page_forgotpwd.html'
        })
        .state('access.404', {
          url: '/404',
          templateUrl: 'app/views/page_404.html'
        })


    }
  ]
);
