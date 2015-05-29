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
    return $resource('api/errors/:projectKey/stream',{},{cache:false});
}]);

angular.module('project').factory('ErrorsErrorTypes', ['$resource',
  function($resource) {
    return $resource('api/errors/:projectKey/errors/errortypes',{},{cache:false});
}]);

angular.module('project').factory('ErrorsErrorTypesHistory', ['$resource',
  function($resource) {
    return $resource('api/errors/:projectKey/errors/errortypes/:errorType/history',{},{cache:false});
}]);

angular.module('project').factory('ErrorsErrorTypesBrowserShare', ['$resource',
  function($resource) {
    return $resource('api/errors/:projectKey/errors/errortypes/:errorType/browserShare',{},{cache:false});
}]);

angular.module('project').factory('ErrorsErrorTypesDeviceShare', ['$resource',
  function($resource) {
    return $resource('api/errors/:projectKey/errors/errortypes/:errorType/deviceShare',{},{cache:false});
}]);

angular.module('project').factory('ErrorsErrorTypesOSShare', ['$resource',
  function($resource) {
    return $resource('api/errors/:projectKey/errors/errortypes/:errorType/osShare',{},{cache:false});
}]);
