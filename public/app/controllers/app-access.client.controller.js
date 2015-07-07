'use strict';

/* Controllers */

angular.module('app')
  .controller('AppAccessCtrl', ['$scope', '$rootScope', '$state', 'AccessSignin', '$log', '$localStorage',
    function($scope, $rootScope, $state, AccessSignin, $log, $localStorage ) {

      $scope.app = $rootScope.app;

      $scope.login = function(){
        var signin = new AccessSignin({
          email: this.email,
          password: this.password
        });

        signin.$save(function(response) {
            if(response.name){
              $rootScope.session = {
                name: response.name,
                email: response.email,
                auth: response.auth
              };
              $localStorage.session = {
                name: response.name,
                email: response.email,
                auth: response.auth
              };
              $log.log("rootscope: " + $rootScope.session.name);
              $state.go('app.dashboard');
              //$log.log($state.href("app.dashboard"));
              //location.replace('/#/dashboard');
            }else{
              $scope.authError = 'Login failed';
            }
        });
      };

}]);
