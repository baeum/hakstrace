angular.module('project').controller('ProjectDetailNavtimingCtrl',
  ['$rootScope', '$scope', '$location', 'toaster', '$log',
    'NavtimingsSummary', 'NavtimingsHistory',
    function ($rootScope, $scope, $location, toaster, $log,
              NavtimingsSummary, NavtimingsHistory) {

      $scope.project = $rootScope.project;
      $scope.dateRange = {};

      $scope.getNavtimingSummary = function (start, end) {
        $scope.dateRange = {start: start, end: end};
        NavtimingsSummary.get({
          projectKey: $scope.project.projectKey,
          start: start,
          end: end
        }).$promise.then(function (navtimingSummary) {
            $scope.navtimingSummary = navtimingSummary;
            $scope.clearNavtimingDetail();
            if (navtimingSummary.list.length > 0) {
              $scope.getNavtimingDetail(navtimingSummary.list[0]);
            }
          });
      };

      $scope.getNavtimingSummaryMinutesAgo = function (ago) {
        var agoDate = new Date();
        agoDate.setTime(agoDate.getTime() - ago * 60 * 1000);
        $scope.getNavtimingSummary(agoDate, new Date());
      };

      // watch 없이 하면 root 에 project 들어 오기 전에 호출되는 경우가 있음.
      $rootScope.$watch('project', function () {
        if (!$rootScope.project || $scope.navtimingSummary) return;
        $scope.project = $rootScope.project;
        $scope.getNavtimingSummaryMinutesAgo(60 * 24 * 14);  //default 2 weeks
      });

      $scope.getNavtimingHistory = function () {
        $scope.navtimingHistoryLabel = [];
        $scope.navtimingHistoryData = [];

        NavtimingsHistory.query({
          projectKey: $scope.project.projectKey,
          uri: $scope.navtiming._id,
          start: $scope.dateRange.start,
          end: $scope.dateRange.end
        }).$promise.then(function (navtimingHitory) {
            var navtimingHistoryLabelEach = [];
            var navtimingHistoryDataEachPre = [];
            var navtimingHistoryDataEachReq = [];
            var navtimingHistoryDataEachWait = [];
            var navtimingHistoryDataEachRes = [];
            var navtimingHistoryDataEachLoad = [];
            navtimingHitory.forEach(function (e) {
              navtimingHistoryLabelEach.push(e.label);
              navtimingHistoryDataEachPre.push(e.prepareAvg);
              navtimingHistoryDataEachReq.push(e.prepareAvg + e.requestAvg);
              navtimingHistoryDataEachWait.push(e.prepareAvg + e.requestAvg + e.waitAvg);
              navtimingHistoryDataEachRes.push(e.prepareAvg + e.requestAvg + e.waitAvg + e.responseAvg);
              navtimingHistoryDataEachLoad.push(e.prepareAvg + e.requestAvg + e.waitAvg + e.responseAvg + e.pageLoadAvg);
            });
            angular.copy(navtimingHistoryLabelEach, $scope.navtimingHistoryLabel);
            $scope.navtimingHistoryData.push(navtimingHistoryDataEachPre);
            $scope.navtimingHistoryData.push(navtimingHistoryDataEachReq);
            $scope.navtimingHistoryData.push(navtimingHistoryDataEachWait);
            $scope.navtimingHistoryData.push(navtimingHistoryDataEachRes);
            $scope.navtimingHistoryData.push(navtimingHistoryDataEachLoad);

            $scope.navtimingHistorySeries = ['Series1','Series2', 'Series3', 'Series4', 'Series5'];
            $scope.navtimingHistoryColor = [{fillColor:"#FF0000"},{fillColor:"#00FF00"},{fillColor:"#0000FF"},{fillColor:"#00FFFF"},{fillColor:"#FFFF00"}];
          });

      };

/*
      $scope.getErrorTypeBrowserShare = function () {
        $scope.errorTypeBrowserShareLabel = [];
        $scope.errorTypeBrowserShareData = [];
        var noFilter = angular.isUndefined($scope.errorTypeShareFilter.browser.device._id) && angular.isUndefined($scope.errorTypeShareFilter.browser.os._id);
        if (noFilter) $scope.errorTypeBrowserShareList = [];

        ErrorsErrorTypesBrowserShare.query({
          projectKey: $scope.project.projectKey,
          errorType: $scope.errorType._id._id,
          filter: !noFilter,
          device: $scope.errorTypeShareFilter.browser.device,
          os: $scope.errorTypeShareFilter.browser.os,
          start: $scope.dateRange.start,
          end: $scope.dateRange.end
        }).$promise.then(function (errorTypeBrowserShare) {
            var errorTypeBrowserShareLabelEach = [];
            var errorTypeBrowserShareDataEach = [];
            var total = 0;
            errorTypeBrowserShare.forEach(function (e) {
              errorTypeBrowserShareLabelEach.push(e._id.name + " " + e._id.major);
              errorTypeBrowserShareDataEach.push(e.count);
              total += e.count;
            });
            $scope.errorTypeBrowserShareHighest = {
              name: errorTypeBrowserShareLabelEach.length > 0 ? errorTypeBrowserShareLabelEach[0] : 'N/A',
              occupancy: errorTypeBrowserShareLabelEach.length > 0 ? (((errorTypeBrowserShareDataEach[0] * 100) / total)) : 0
            };
            angular.copy(errorTypeBrowserShareLabelEach, $scope.errorTypeBrowserShareLabel);
            angular.copy(errorTypeBrowserShareDataEach, $scope.errorTypeBrowserShareData);
            if (noFilter) angular.copy(errorTypeBrowserShare, $scope.errorTypeBrowserShareList);
          });
      };

      $scope.getErrorTypeBrowserShareByDevice = function (device) {
        $scope.errorTypeShareFilter.browser.device = device ? device : {};
        $scope.getErrorTypeBrowserShare();
      };

      $scope.getErrorTypeBrowserShareByOS = function (os) {
        $scope.errorTypeShareFilter.browser.os = os ? os : {};
        $scope.getErrorTypeBrowserShare();
      };

      $scope.getErrorTypeDeviceShare = function () {
        $scope.errorTypeDeviceShareLabel = [];
        $scope.errorTypeDeviceShareData = [];
        var noFilter = angular.isUndefined($scope.errorTypeShareFilter.device.browser._id) && angular.isUndefined($scope.errorTypeShareFilter.device.os._id);
        if (noFilter) $scope.errorTypeDeviceShareList = [];

        ErrorsErrorTypesDeviceShare.query({
          projectKey: $scope.project.projectKey,
          errorType: $scope.errorType._id._id,
          filter: !noFilter,
          browser: $scope.errorTypeShareFilter.device.browser,
          os: $scope.errorTypeShareFilter.device.os,
          start: $scope.dateRange.start,
          end: $scope.dateRange.end
        }).$promise.then(function (errorTypeDeviceShare) {
            var errorTypeDeviceShareLabelEach = [];
            var errorTypeDeviceShareDataEach = [];
            var total = 0;
            errorTypeDeviceShare.forEach(function (e) {
              errorTypeDeviceShareLabelEach.push(e._id.vendor + " " + e._id.model);
              errorTypeDeviceShareDataEach.push(e.count);
              total += e.count;
            });
            $scope.errorTypeDeviceShareHighest = {
              name: errorTypeDeviceShareLabelEach.length > 0 ? errorTypeDeviceShareLabelEach[0] : 'N/A',
              occupancy: errorTypeDeviceShareLabelEach.length > 0 ? (((errorTypeDeviceShareDataEach[0] * 100) / total)) : 0
            };
            angular.copy(errorTypeDeviceShareLabelEach, $scope.errorTypeDeviceShareLabel);
            angular.copy(errorTypeDeviceShareDataEach, $scope.errorTypeDeviceShareData);
            if (noFilter) angular.copy(errorTypeDeviceShare, $scope.errorTypeDeviceShareList);
          });
      };

      $scope.getErrorTypeDeviceShareByBrowser = function (browser) {
        $scope.errorTypeShareFilter.device.browser = browser ? browser : {};
        $scope.getErrorTypeDeviceShare();
      };

      $scope.getErrorTypeDeviceShareByOS = function (os) {
        $scope.errorTypeShareFilter.device.os = os ? os : {};
        $scope.getErrorTypeDeviceShare();
      };

      $scope.getErrorTypeOSShare = function () {
        $scope.errorTypeOSShareLabel = [];
        $scope.errorTypeOSShareData = [];
        var noFilter = angular.isUndefined($scope.errorTypeShareFilter.os.browser._id) && angular.isUndefined($scope.errorTypeShareFilter.os.device._id);
        if (noFilter) $scope.errorTypeOSShareList = [];

        ErrorsErrorTypesOSShare.query({
          projectKey: $scope.project.projectKey,
          errorType: $scope.errorType._id._id,
          filter: !noFilter,
          browser: $scope.errorTypeShareFilter.os.browser,
          device: $scope.errorTypeShareFilter.os.device,
          start: $scope.dateRange.start,
          end: $scope.dateRange.end
        }).$promise.then(function (errorTypeOSShare) {
            var errorTypeOSShareLabelEach = [];
            var errorTypeOSShareDataEach = [];
            var total = 0;
            errorTypeOSShare.forEach(function (e) {
              errorTypeOSShareLabelEach.push(e._id.name + " " + e._id.version);
              errorTypeOSShareDataEach.push(e.count);
              total += e.count;
            });
            $scope.errorTypeOSShareHighest = {
              name: errorTypeOSShareLabelEach.length > 0 ? errorTypeOSShareLabelEach[0] : 'N/A',
              occupancy: errorTypeOSShareLabelEach.length > 0 ? (((errorTypeOSShareDataEach[0] * 100) / total)) : 0
            };
            angular.copy(errorTypeOSShareLabelEach, $scope.errorTypeOSShareLabel);
            angular.copy(errorTypeOSShareDataEach, $scope.errorTypeOSShareData);
            if (noFilter) angular.copy(errorTypeOSShare, $scope.errorTypeOSShareList);
          });
      };

      $scope.getErrorTypeOSShareByBrowser = function (browser) {
        $scope.errorTypeShareFilter.os.browser = browser ? browser : {};
        $scope.getErrorTypeOSShare();
      };

      $scope.getErrorTypeOSShareByDevice = function (device) {
        $scope.errorTypeShareFilter.os.device = device ? device : {};
        $scope.getErrorTypeOSShare();
      };

      $scope.getErrorTypeStream = function () {
        ErrorsErrorTypesStream.query({
          projectKey: $scope.project.projectKey,
          errorType: $scope.errorType._id._id,
          start: $scope.dateRange.start,
          end: $scope.dateRange.end
        }).$promise.then(function (errorTypeStream) {
            $scope.errorTypeStream = errorTypeStream;
          });
      };
*/

      $scope.getNavtimingDetail = function (navtiming) {
        //$scope.errorTypeShareFilter = {
        //  browser: {device: {}, os: {}}, device: {browser: {}, os: {}}, os: {browser: {}, device: {}}
        //};
        $scope.navtiming = navtiming;
        $scope.getNavtimingHistory();
        //$scope.getErrorTypeBrowserShare();
        //$scope.getErrorTypeDeviceShare();
        //$scope.getErrorTypeOSShare();
        //$scope.getErrorTypeStream();
      };

      $scope.isActiveNavtiming = function (uri) {
        return $scope.navtiming._id == uri;
      };

      $scope.clearNavtimingDetail = function () {
        $scope.navtimingHistoryLabel = [];
        $scope.navtimingHistoryData = [];
        /*
        $scope.errorTypeBrowserShareLabel = [];
        $scope.errorTypeBrowserShareData = [];
        $scope.errorTypeBrowserShareList = [];
        $scope.errorTypeBrowserShareHighest = {
          name: 'N/A',
          occupancy: 0
        };
        $scope.errorTypeDeviceShareLabel = [];
        $scope.errorTypeDeviceShareData = [];
        $scope.errorTypeDeviceShareList = [];
        $scope.errorTypeDeviceShareHighest = {
          name: 'N/A',
          occupancy: 0
        };
        $scope.errorTypeOSShareLabel = [];
        $scope.errorTypeOSShareData = [];
        $scope.errorTypeOSShareList = [];
        $scope.errorTypeOSShareHighest = {
          name: 'N/A',
          occupancy: 0
        };
        */
      };

    }]);
