'use strict';


angular.module('project').config(['$stateProvider', '$routeProvider',
  function($stateProvider, $routeProvider) {

    $stateProvider
        .state('app.project-new', {
            url: '/projects/new',
            templateUrl: 'project/views/project-create.client.view.html'
        })
        .state('app.projects', {
            url: '/projects',
            templateUrl: 'project/views/project-list.client.view.html'
        })
        .state('app.project-detail', {
            url: '/projects/{projectKey}',
            templateUrl: 'project/views/project-detail.client.view.html'
        });
}]);
