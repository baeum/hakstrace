
angular.module('project').controller('ProjectDetailErrorsCtrl',
  ['$rootScope', '$scope', '$location', 'toaster', '$log',
    'ErrorsErrorTypes', 'ErrorsErrorTypesHistory', 'ErrorsErrorTypesBrowserShare', 'ErrorsErrorTypesDeviceShare',
  function( $rootScope, $scope, $location, toaster, $log,
      ErrorsErrorTypes, ErrorsErrorTypesHistory, ErrorsErrorTypesBrowserShare, ErrorsErrorTypesDeviceShare ) {

    $scope.project = $rootScope.project;
    $scope.dateRange = {};

    $scope.getErrorTypeSummary = function(start, end){
      $scope.dateRange = {start: start, end: end};
      ErrorsErrorTypes.get({projectKey: $scope.project.projectKey,
                        start: start,
                        end: end}).$promise.then(function(errorTypeSummary) {
        $scope.errorTypeSummary = errorTypeSummary;
        $scope.clearErrorTypeDetail();
        if( errorTypeSummary.list.length > 0 ){
          $scope.getErrorTypeDetail(errorTypeSummary.list[0]._id._id);
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
          errorTypeHistoryLabelEach.push(e.label);
          errorTypeHistoryDataEach.push(e.count);
        });
        angular.copy(errorTypeHistoryLabelEach, $scope.errorTypeHistoryLabel);
        $scope.errorTypeHistoryData.push(errorTypeHistoryDataEach);
      });

    };

    $scope.getErrorTypeBrowserShare = function(errorType){
      $scope.errorTypeBrowserShareLabel = [];
      $scope.errorTypeBrowserShareData = [];

      ErrorsErrorTypesBrowserShare.query({projectKey: $scope.project.projectKey,
                        errorType: errorType,
                        start: $scope.dateRange.start,
                        end: $scope.dateRange.end}).$promise.then(function(errorTypeBrowserShare) {
        var errorTypeBrowserShareLabelEach = [];
        var errorTypeBrowserShareDataEach = [];
        var total = 0;
        errorTypeBrowserShare.forEach(function(e) {
          errorTypeBrowserShareLabelEach.push(e._id.name + " " + e._id.major);
          errorTypeBrowserShareDataEach.push(e.count);
          total += e.count;
        });
        $scope.errorTypeBrowserShareHighest = {
          name : errorTypeBrowserShareLabelEach.length > 0 ? errorTypeBrowserShareLabelEach[0]:'N/A',
          occupancy : errorTypeBrowserShareLabelEach.length > 0 ? (((errorTypeBrowserShareDataEach[0]*100)/total)):0
        };
        angular.copy(errorTypeBrowserShareLabelEach, $scope.errorTypeBrowserShareLabel);
        angular.copy(errorTypeBrowserShareDataEach, $scope.errorTypeBrowserShareData);
      });
    };

    $scope.getErrorTypeDeviceShare = function(errorType){
      $scope.errorTypeDeviceShareLabel = [];
      $scope.errorTypeDeviceShareData = [];

      ErrorsErrorTypesDeviceShare.query({projectKey: $scope.project.projectKey,
                        errorType: errorType,
                        start: $scope.dateRange.start,
                        end: $scope.dateRange.end}).$promise.then(function(errorTypeDeviceShare) {
        var errorTypeDeviceShareLabelEach = [];
        var errorTypeDeviceShareDataEach = [];
        var total = 0;
        errorTypeDeviceShare.forEach(function(e) {
          errorTypeDeviceShareLabelEach.push(e._id.vendor + " "  + e._id.model);
          errorTypeDeviceShareDataEach.push(e.count);
          total += e.count;
        });
        $scope.errorTypeDeviceShareHighest = {
          name : errorTypeDeviceShareLabelEach.length > 0 ? errorTypeDeviceShareLabelEach[0]:'N/A',
          occupancy : errorTypeDeviceShareLabelEach.length > 0 ? (((errorTypeDeviceShareDataEach[0]*100)/total)):0
        };
        angular.copy(errorTypeDeviceShareLabelEach, $scope.errorTypeDeviceShareLabel);
        angular.copy(errorTypeDeviceShareDataEach, $scope.errorTypeDeviceShareData);
      });
    };

    $scope.getErrorTypeDetail = function(errorType){
      $scope.getErrorTypeHistory(errorType);
      $scope.getErrorTypeBrowserShare(errorType);
      $scope.getErrorTypeDeviceShare(errorType);
    };

    $scope.clearErrorTypeDetail = function(){
      $scope.errorTypeHistoryLabel = [];
      $scope.errorTypeHistoryData = [];
      $scope.errorTypeBrowserShareLabel = [];
      $scope.errorTypeBrowserShareData = [];
      $scope.errorTypeBrowserShareHighest = {
        name : 'N/A',
        occupancy : 0
      };
      $scope.errorTypeDeviceShareLabel = [];
      $scope.errorTypeDeviceShareData = [];
      $scope.errorTypeDeviceShareHighest = {
        name : 'N/A',
        occupancy : 0
      };
    };

}]);
