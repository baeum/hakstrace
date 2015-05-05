


angular.module('project').controller('ProjectDetailSettingsCtrl',
  ['$rootScope', '$scope', '$location', 'Projects', 'toaster',
  function( $rootScope, $scope, $location, Projects, toaster ) {


}]);

angular.module('project').controller('ProjectDetailSettingsBasicCtrl',
  ['$rootScope', '$scope', '$location', '$stateParams', 'Projects', 'toaster', '$state',
  function( $rootScope, $scope, $location, $stateParams, Projects, toaster, $state ) {

    Projects.get({projectKey:$stateParams.projectKey}, function(project){
      $scope.project = project;
    });

    $scope.save = function() {

      Projects.update({projectKey: $scope.project.projectKey}, $scope.project).$promise.then(function(project) {
        toaster.pop({
          type: 'success',
          title: project.name,
          body: 'A Project Info has been changed.'
        });
        //$scope.$parent.project = $scope.project;
        $state.reload(); // 상단 프로젝트 이름같은 거 refresh 할려고 걍 페이지 reload. 이거 좀 그렇네..
        //$state.go('app.project-detail.settings');
        //$state.go($state.current, {}, {reload: true});
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
  ['$rootScope', '$scope', '$location', '$stateParams', 'Projects', 'toaster', '$state',
  function( $rootScope, $scope, $location, $stateParams, Projects, toaster, $state ) {

    Projects.get({projectKey:$stateParams.projectKey}, function(project){
      $scope.project = project;
    });


}]);
