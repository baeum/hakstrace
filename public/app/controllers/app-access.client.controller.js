'use strict';

/* Controllers */

angular.module('app')
  .controller('AppAccessCtrl', ['$scope', '$rootScope',
    function($scope, $rootScope ) {

      $scope.app = $rootScope.app;
}]);
