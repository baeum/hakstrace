


angular.module('project').controller('ProjectDetailSettingsCtrl',
  ['$rootScope', '$scope', '$location', 'Projects', 'toaster',
  function( $rootScope, $scope, $location, Projects, toaster ) {



}]);

angular.module('project').controller('ProjectDetailSettingsBasicCtrl',
  ['$rootScope', '$scope', '$location', '$stateParams', 'Projects', 'toaster', '$state',
  function( $rootScope, $scope, $location, $stateParams, Projects, toaster, $state ) {

    $scope.project = $rootScope.project;

    $scope.save = function() {
      Projects.update({projectKey: $scope.project.projectKey}, $scope.project).$promise.then(function(project) {
        toaster.pop({
          type: 'success',
          title: project.name,
          body: 'A Project Info has been changed.'
        });
      });
    };

    $scope.delete = function() {
      Projects.delete({projectKey: $scope.project.projectKey}).$promise.then(function() {
        toaster.pop({
          type: 'success',
          title: $scope.project.name,
          body: 'A Project has been deleted.'
        });
        $state.go('app.projects');
      });
    };

}]);


angular.module('project').controller('ProjectDetailSettingsScriptCtrl',
  ['$rootScope', '$scope', '$location', '$stateParams', 'Projects', 'toaster', '$state', 'ProjectsApiKeyRegen', 'ScriptLatest',
  function( $rootScope, $scope, $location, $stateParams, Projects, toaster, $state, ProjectsApiKeyRegen, ScriptLatest ) {

    $scope.regenerateScriptCode = function(){
      $scope.generatedScript = angular.copy($scope.script);
      $scope.generatedScript.script = $scope.script.script.replace('{{host}}', $scope.project.host);
      $scope.generatedScript.script = $scope.generatedScript.script.replace('{{projectKey}}', $scope.project.projectKey);
      $scope.generatedScript.script = $scope.generatedScript.script.replace('{{apiKey}}', $scope.project.apiKey);
    };

    $scope.project = $rootScope.project;
    ScriptLatest.get(function(script){
      $scope.script = script;
      $scope.regenerateScriptCode();
    });

    $scope.regenerateApiKey = function(){
      ProjectsApiKeyRegen.get({projectKey:$scope.project.projectKey}, function(regenApiKey){
        $scope.project.apiKey = regenApiKey.apiKey;
        $scope.regenerateScriptCode();
      });
    }

    $scope.save = function() {
      Projects.update({projectKey: $scope.project.projectKey}, $scope.project).$promise.then(function(project) {
        toaster.pop({
          type: 'success',
          title: project.name,
          body: 'A Project Info has been changed.'
        });
      });
    };
}]);
