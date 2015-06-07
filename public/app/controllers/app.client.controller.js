'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', '$rootScope', '$log',
    function(              $scope,   $translate,   $localStorage,   $window,  $rootScope, $log ) {
      // add 'ie' classes to html


      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // 기본 테마와 메뉴 같은거 설정

      // config
      $scope.app =  {
  			name: 'Hakstrace',
  			version: '0.0.1b',
  			// for chart colors
  			color: {
  				primary: '#7266ba',
  				info:    '#23b7e5',
  				success: '#27c24c',
  				warning: '#fad733',
  				danger:  '#f05050',
  				light:   '#e8eff0',
  				dark:    '#3a3f51',
  				black:   '#1c2b36'
  			},
  			settings: {
  				themeID: 1,
  				navbarHeaderColor: 'bg-info dker',
  				navbarCollapseColor: 'bg-info dker',
  				asideColor: 'bg-light dker b-r',
  				headerFixed: true,
  				asideFixed: false,
  				asideFolded: true,
  				asideDock: true,
  				container: false
  			}
  		};

      $rootScope.app = $scope.app;
      //$scope.session = $rootScope.session;
      //$log.log($scope.session + ": session");

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }

      if ( angular.isDefined($localStorage.session) ) {
        $scope.app.session = $localStorage.session;
      } else {
        $localStorage.session = $scope.app.session;
      }
      //$scope.$watch('app.settings', function(){
      //  if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
      //    // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
      //  }
        // save to local storage
      //  $localStorage.settings = $scope.app.settings;

      //}, true);

      // angular translate
      /*
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };
*/
      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

  }]);
