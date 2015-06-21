
angular.module('project').controller('ProjectDetailStreamCtrl',
  ['$rootScope', '$scope', '$location', 'ErrorStream', 'toaster', '$log',
  function( $rootScope, $scope, $location, ErrorStream, toaster, $log ) {

    $scope.project = $rootScope.project;
    $scope.pageLimit = 50;
    $scope.moreVisible = false;

    $scope.showMoreErros = function(){
      ErrorStream.query({projectKey: $scope.project.projectKey,
                        createdBefore: $scope.herrors[$scope.herrors.length-1].created,
                        limit: $scope.pageLimit}).$promise.then(function(herrors) {
          $scope.herrors = $scope.herrors.concat(herrors);
          $scope.moreVisible = (herrors.length == $scope.pageLimit);
      });
    };

    // watch 없이 하면 root 에 project 들어 오기 전에 호출되는 경우가 있음.
    $rootScope.$watch('project', function(){
      if( !$rootScope.project || $scope.herrors) return;
      $scope.project = $rootScope.project;
      ErrorStream.query({projectKey: $scope.project.projectKey,
                        createdBefore: Date.now(),
                        limit:$scope.pageLimit}).$promise.then(function(herrors) {
          $scope.herrors = herrors;
          $scope.moreVisible = (herrors.length == $scope.pageLimit);
      });
    });


}]);
