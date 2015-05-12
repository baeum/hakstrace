'use strict';

angular.module('project').factory('Projects', ['$resource',
  function($resource) {
    return $resource('api/projects/:projectKey', null,
              {'update': { method:'PUT' }});
}]);

angular.module('project').factory('ProjectsApiKeyRegen', ['$resource',
  function($resource) {
    return $resource('api/projects/:projectKey/regenerateApiKey');
}]);
