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
            $scope.drawNavtimingHistory(navtimingHitory);
        });

      };

      $scope.drawNavtimingSummary = function(navtimingSummary){

        var chartValuesPre = [], chartValuesReq =[], chartValuesWait=[], chartValuesRes=[], chartValuesLoad = [];
        for( inx = 0 ; inx < navtimingSummary.length ; inx++ ){
          if(inx > 9) break;
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

        $scope.navtimingSummaryChart.data = chartData;

      };


      $scope.drawNavtimingHistory = function(navtimingHistory){
        var chartValuesPre = [], chartValuesReq =[], chartValuesWait=[], chartValuesRes=[], chartValuesLoad = [];
        for( inx = 0 ; inx < navtimingHistory.length ; inx++ ){
          chartValuesPre.push([
            navtimingHistory[inx].label,
            navtimingHistory[inx].prepareAvg?navtimingHistory[inx].prepareAvg:0
          ]);
          chartValuesReq.push([
            navtimingHistory[inx].label,
            navtimingHistory[inx].requestAvg? navtimingHistory[inx].requestAvg:0
          ]);
          chartValuesWait.push([
            navtimingHistory[inx].label,
            navtimingHistory[inx].waitAvg?navtimingHistory[inx].waitAvg:0
          ]);
          chartValuesRes.push([
            navtimingHistory[inx].label,
            navtimingHistory[inx].responseAvg?navtimingHistory[inx].responseAvg:0
          ]);
          chartValuesLoad.push([
            navtimingHistory[inx].label,
            navtimingHistory[inx].pageLoadAvg? navtimingHistory[inx].pageLoadAvg:0
          ]);
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
        $scope.navtimingHistoryChart.data =chartData;
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

      $scope.navtimingSummaryChart = {
            options:{
                chart: {
                  type: 'multiBarHorizontalChart',
                  height: 400,
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
                  tooltips:true,
                  yAxis: {
                      axisLabel: 'Time (ms)',
                      axisLabelDistance: 40
                  }
              }
            },
          data : []
      };

      $scope.navtimingHistoryChart = {
        options:{
          chart: {
                type: 'stackedAreaChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 40
                },
                x: function(d){return d[0];},
                y: function(d){return d[1];},
                useVoronoi: false,
                clipEdge: true,
                transitionDuration: 500,
                useInteractiveGuideline: true,
                xAxis: {
                    showMaxMin: false,
                    tickFormat: function(d) {
                        return d3.time.format('%b %d %H:%M %p')(new Date(d))
                    }
                }
            }
        },
        data:[]
      };






    }]);
