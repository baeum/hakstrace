'use strict';

/* Controllers */

angular.module('app')
  .controller('AppAccessCtrl', ['$scope', '$rootScope', '$state', 'AccessSignin', '$log', '$localStorage',
    function($scope, $rootScope, $state, AccessSignin, $log, $localStorage ) {

      $scope.app = $rootScope.app;
      //setCookie('haksTestId', '', 365);
      //setCookie('haksTestPw', '', 365);

      //for Testing ...
      var emailFromCookie = getCookie('haksTestId');
      var passwordFromCookie = getCookie('haksTestPw');
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
              $state.go('app.dashboard');
              //$log.log($state.href("app.dashboard"));
              //location.replace('/#/dashboard');
            }else{
              $scope.authError = 'Login failed';
            }
        });
      };

}]);;

function setCookie(cName, cValue, cDay){
  var expire = new Date();
  expire.setDate(expire.getDate() + cDay);
  var cookies = cName + '=' + encodeURI(cValue) + '; path=/ ';
  if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
  document.cookie = cookies;
}

function getCookie(cName) {
  cName = cName + '=';
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cName);
  var cValue = '';
  if(start != -1){
    start += cName.length;
    var end = cookieData.indexOf(';', start);
    if(end == -1)end = cookieData.length;
    cValue = cookieData.substring(start, end);
  }
  return decodeURI(cValue);
}
