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
        })
        .state('app.project-detail.stream', {
            url: '/stream',
            templateUrl: 'project/views/project-detail-stream.client.view.html'
        })
        .state('app.project-detail.errors', {
            url: '/errors',
            templateUrl: 'project/views/project-detail-errors.client.view.html'
        })
        .state('app.project-detail.settings', {
            url: '/settings',
            templateUrl: 'project/views/project-detail-settings.client.view.html'
        });
}]);
