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
            $scope.drawNavtimingSummary(navtimingSummary.list);
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
            $scope.navtimingHistoryData.push(navtimingHistoryDataEachLoad);
            $scope.navtimingHistoryData.push(navtimingHistoryDataEachRes);
            $scope.navtimingHistoryData.push(navtimingHistoryDataEachWait);
            $scope.navtimingHistoryData.push(navtimingHistoryDataEachReq);
            $scope.navtimingHistoryData.push(navtimingHistoryDataEachPre);

            $scope.navtimingHistorySeries = ['complete','response', 'wait', 'request', 'prepare'];
            $scope.navtimingHistoryColor = [{fillColor:"#CECEF6"},{fillColor:"#2E9AFE"},{fillColor:"#0080FF"},{fillColor:"#0174DF"},{fillColor:"#08298A"}];
          });

      };

      $scope.drawNavtimingSummary = function(navtimingSummary){

        var chartValuesPre = [], chartValuesReq =[], chartValuesWait=[], chartValuesRes=[], chartValuesLoad = [];
        for( inx = 0 ; inx < navtimingSummary.length ; inx++ ){
          if(inx > 20) break;
          chartValuesPre.push({
            "x": navtimingSummary[inx]._id,
            "y": navtimingSummary[inx].prepareAvg
          });
          chartValuesReq.push({
            "x": navtimingSummary[inx]._id,
            "y": navtimingSummary[inx].requestAvg
          });
          chartValuesWait.push({
            "x": navtimingSummary[inx]._id,
            "y": navtimingSummary[inx].waitAvg
          });
          chartValuesRes.push({
            "x": navtimingSummary[inx]._id,
            "y": navtimingSummary[inx].responseAvg
          });
          chartValuesLoad.push({
            "x": navtimingSummary[inx]._id,
            "y": navtimingSummary[inx].pageLoadAvg
          });
        }

        var chartData = [{
          "key": "prepare",
          "values": chartValuesPre
        },{
          "key": "request",
          "values": chartValuesReq
        },{
          "key": "wait",
          "values": chartValuesWait
        },{
          "key": "response",
          "values": chartValuesRes
        },{
          "key": "loadDom",
          "values": chartValuesLoad
        }];

        $scope.navtimingHistoryChart.data = chartData;

      };

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

      $scope.navtimingHistoryChart = {
            options:{
                chart: {
                  type: 'multiBarHorizontalChart',
                  height: 450,
                  margin : {
                      top: 20,
                      right: 20,
                      bottom: 60,
                      left: 245
                  },
                  clipEdge: true,
                  staggerLabels: true,
                  transitionDuration: 500,
                  stacked: true,
                  xAxis: {
                      showMaxMin: false
                  },
                  yAxis: {
                      axisLabel: 'Time (ms)',
                      axisLabelDistance: 40
                  }
              }
            },
          data : []
      };






      $scope.clearNavtimingDetail = function () {
        $scope.navtimingHistoryLabel = [];
        $scope.navtimingHistoryData = [];
      };

    }]);
