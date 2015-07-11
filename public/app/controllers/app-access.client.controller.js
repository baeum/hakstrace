'use strict';

/* Controllers */

angular.module('app')
  .controller('AppAccessCtrl', ['$scope', '$rootScope', '$state', 'AccessSignin', '$log', '$localStorage', 'myCookie',
    function($scope, $rootScope, $state, AccessSignin, $log, $localStorage, myCookie ) {

      $scope.app = $rootScope.app;
      //myCookie.setCookie('haksTestId', '', 365);
      //myCookie.setCookie('haksTestPw', '', 365);

      //for Testing ...
      var emailFromCookie = myCookie.getCookie('haksTestId');
      var passwordFromCookie = myCookie.getCookie('haksTestPw');
      if(emailFromCookie) $scope.email = emailFromCookie;
      if(passwordFromCookie) $scope.password = passwordFromCookie;


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
              /*$timeout(function() {
                //location.href='/#/dashboard';
                location.replace('/#/dashboard');
              }, 100);*/
              $state.go('app.dashboard');
            }else{
              $scope.authError = 'Login failed';
            }
        });
      };
}]);


//blank init page ( unsigned user --> move to login page / signed user --> dashboard )
angular.module('app')
  .controller('AppBlankCtrl', ['$scope', '$state', '$resource',
    function($scope, $state, $resource ) {
      var ResourceIsLogin = $resource('/api/access/isLogin', {}, {cache: false});
      ResourceIsLogin.query({})
        .$promise.then(function () {
          $state.go('app.dashboard');
        });
    }]);
