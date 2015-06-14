'use strict';

/* Controllers */

angular.module('app')
    .controller('MainDashboardCtrl', ['$scope',
      function($scope) {

        $scope.options = {
          chart: {
            type: 'stackedAreaChart',
            height: 180,
            margin : {
              top: 20,
              right: 20,
              bottom: 40,
              left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            transitionDuration:1,
            yDomain: [0,100],
            yAxis: {
              tickFormat: function(d){
                return d3.format('.01f')(d);
              }
            }
          }
        };

        $scope.data = [{ values: [], key: 'All errors - Random Test Data' }];

        var max=200;
        for(var i=0; i<max; i++) {
          $scope.data[0].values.push({ x: i,	y:0});
        }

        $scope.run = true;

        var x = max;
        setInterval(function(){
          if (!$scope.run) return;
          $scope.data[0].values.push({ x: x,	y: Math.random()*100});
          if ($scope.data[0].values.length > max) $scope.data[0].values.shift();
          x++;
          $scope.$apply();
        }, 3000);
}]);
