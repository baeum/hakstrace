'use strict';

var mainApplicationModuleName = 'hakstrace';

var mainApplicationModule = angular.module(mainApplicationModuleName, [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'app'
]);


angular.element(document).ready(function() {
  angular.bootstrap(document, [mainApplicationModuleName]);
});



// filter

mainApplicationModule
  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    }
  });

// lazyload config


