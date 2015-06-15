'use strict';

/* Controllers */

angular.module('app')
    .controller('MainDashboardCtrl', ['$scope', '$ocLazyLoad',
      function($scope, $ocLazyLoad) {
        console.log('log, log, log');

        //$ocLazyLoad.config({events: true});

        //$ocLazyLoad.load('/socket.io/socket.io.js');
        //
        //$scope.$on('ocLazyLoad.moduleLoaded', function(e, module) {
        //  console.log('module loaded', module);
        //});
        //var socket = io.connect('http://localhost:3000');
        //socket.on('news', function (data) {
        //  console.log(data);
        //  socket.emit('my other event', { my: 'data' });
        //});
        //console.log('test log 1234 - main dashboard controller');


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
