'use strict';

var mainApplicationModuleName = 'hakstrace';

var mainApplicationModule = angular.module(mainApplicationModuleName, [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ngRoute',
    'toaster',
    'xeditable',
    'angularMoment',
    'chart.js',
    'app',
    'datatables',
    'admin',
    'project',
    'nvd3',
    'btford.socket-io'
]);

mainApplicationModule.constant('angularMomentConfig', {
  preprocess: 'utc',
  timezone: 'Korea/Seoul'
});

mainApplicationModule.factory('mySocket', function (socketFactory) {
  return socketFactory();
});

angular.element(document).ready(function() {
  angular.bootstrap(document, [mainApplicationModuleName]);
});

// xeditable default setting (http://vitalets.github.io/angular-xeditable)
mainApplicationModule.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';
});

// 요건 global error handle 할려고
mainApplicationModule.config(function ($provide, $httpProvider){
  $httpProvider.interceptors.push(function($q, $log, toaster, $injector) {
    return {
      /*
      'request': function(config) {
       return config;
      },

      'response': function(response) {
        return response;
      },
      */

      'responseError': function(rejection) {
        if(rejection.status == 403){
          $injector.get('$state').transitionTo('access.signin');
          //state 를 바로 접근하면 오류남 (http://stackoverflow.com/questions/20230691/injecting-state-ui-router-into-http-interceptor-causes-circular-dependency)
          //$state.go('access.signin');
        }
        toaster.pop({
          type: 'error',
          title: rejection.status + ' ' + rejection.statusText,
          body: rejection.data.message
        });
        return $q.reject(rejection);
      }
    };
  });

});

// x-requested-with 가 안 붙어 날라감.
mainApplicationModule.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);


// filter

mainApplicationModule
  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    }
  });


// global directives
mainApplicationModule.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

//connect to socket
//var socketDashboard = io.connect('http://localhost:3000');
