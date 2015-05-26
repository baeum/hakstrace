
angular.module('project').controller('ProjectDetailErrorsCtrl',
  ['$rootScope', '$scope', '$location', 'toaster', '$log', 'ErrorsErrorTypes', 'ErrorsErrorTypesHistory',
  function( $rootScope, $scope, $location, toaster, $log, ErrorsErrorTypes, ErrorsErrorTypesHistory ) {

    $scope.project = $rootScope.project;
    $scope.dateRange = {};

    $scope.getErrorTypeSummary = function(start, end){
      $scope.dateRange = {start: start, end: end};
      ErrorsErrorTypes.get({projectKey: $scope.project.projectKey,
                        start: start,
                        end: end}).$promise.then(function(errorTypeSummary) {
        $scope.errorTypeSummary = errorTypeSummary;
        $scope.errorTypeHistoryLabel = [];
        $scope.errorTypeHistoryData = [];
        if( errorTypeSummary.list.length > 0 ){
          $scope.getErrorTypeHistory(errorTypeSummary.list[0]._id._id);
        }
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

    $scope.getErrorTypeHistory = function(errorType){
      $scope.errorTypeHistoryLabel = [];
      $scope.errorTypeHistoryData = [];
      
      ErrorsErrorTypesHistory.query({projectKey: $scope.project.projectKey,
                        errorType: errorType,
                        start: $scope.dateRange.start,
                        end: $scope.dateRange.end}).$promise.then(function(errorTypeHistory) {
        var errorTypeHistoryLabelEach = [];
        var errorTypeHistoryDataEach = [];
        errorTypeHistory.forEach(function(e) {
          errorTypeHistoryLabelEach.push(e.timestamp.month + "/" + e.timestamp.day);
          errorTypeHistoryDataEach.push(e.count);
        });
        angular.copy(errorTypeHistoryLabelEach, $scope.errorTypeHistoryLabel);
        $scope.errorTypeHistoryData.push(errorTypeHistoryDataEach);
      });

    };





}]);
