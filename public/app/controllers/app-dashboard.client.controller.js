'use strict';

/* Controllers */
angular.module('app')
    .controller('MainDashboardCtrl', ['$scope', 'mySocket',
      function($scope, mySocket) {
        var maxY = 10;

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
            showControls: false,
            clipEdge: true,
            transitionDuration: 1,
            yDomain: [0,maxY],
            yAxis: {
              tickFormat: function(d){
                return d3.format('d')(d);
              }
            },
            xAxis: {
              tickFormat: function(d){
                return d3.time.format('%H:%M:%S')(new Date(d));
              }
            }
          }
        };

        $scope.data = [{ values: [], key: 'All errors' }];

        var interval = 3;
        var max=10*60/interval;

        for(var i=0; i<max; i++) {
          $scope.data[0].values.push({ x: Date.now()-(max-i)*interval*1000,	y:0});
        }
        $scope.run = true;

        //connect to socket
        mySocket.forward('allErrorCount', $scope);
        $scope.$on('socket:allErrorCount', function (ev, data) {
          //console.log('received from socket - %s', JSON.stringify(data));
          //resize y axis scale
          if(data.y > maxY) {
            maxY = data.y;
            $scope.options.chart.yDomain = [0,maxY];
          }

          //put data & graph shift
          $scope.data[0].values.push({ x: Date.now(),	y: data.y});
          if ($scope.data[0].values.length > max) $scope.data[0].values.shift();

          $scope.$apply();
        });

        mySocket.emit('signin');
      }]);
