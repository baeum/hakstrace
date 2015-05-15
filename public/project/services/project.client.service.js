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

angular.module('project').factory('ErrorStream', ['$resource',
  function($resource) {
    return $resource('api/errors/:projectKey/stream',{},{cache:false});;
}]);
