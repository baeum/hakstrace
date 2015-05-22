
angular.module('project').controller('ProjectDetailErrorsCtrl',
  ['$rootScope', '$scope', '$location', 'toaster', '$log', 'ErrorsErrorTypes',
  function( $rootScope, $scope, $location, toaster, $log, ErrorsErrorTypes ) {

    $scope.project = $rootScope.project;
//    $scope.srchCond = {start: Date.now(), end: };

    $scope.getErrorTypeSummary = function(start, end){
      ErrorsErrorTypes.get({projectKey: $scope.project.projectKey,
                        start: start,
                        end: end}).$promise.then(function(errorTypeSummary) {
        $scope.errorTypeSummary = errorTypeSummary;
      });
    };

    $scope.getErrorTypeSummaryMinutesAgo = function(ago){
      var agoDate = new Date();
      agoDate.setTime(agoDate.getTime() - ago*60*1000);
      $scope.getErrorTypeSummary(agoDate, new Date());
    };

    // watch 없이 하면 root 에 project 들어 오기 전에 호출되는 경우가 있음.
    $rootScope.$watch('project', function(){
      if( !$rootScope.project || $scope.errorTypeSummary) return;
      $scope.project = $rootScope.project;
      $scope.getErrorTypeSummaryMinutesAgo(60*24*14);  //default 2 weeks
    });




}]);
