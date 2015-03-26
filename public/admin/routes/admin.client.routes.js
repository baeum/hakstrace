'use strict';

/**
 * Config for the router
 */
angular.module('admin').config(
    [ '$stateProvider', '$urlRouterProvider', '$routeProvider', 'JQ_CONFIG',
      function ($stateProvider,   $urlRouterProvider,  $routeProvider, JQ_CONFIG) {
/*
          $stateProvider
              .state('app.admin', {
                  abstract: true,
                  url: '/admin',
                  templateUrl: '/admin',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['app/widgets/mail/mail.js',
                                               'app/widgets/mail/mail-service.js',
                                               JQ_CONFIG.moment] );
                      }]
                  }
              })
              .state('app.mail.list', {
                  url: '/inbox/{fold}',
                  templateUrl: 'app/views/mail.list.html'
              })
              .state('app.mail.detail', {
                  url: '/{mailId:[0-9]{1,4}}',
                  templateUrl: 'app/views/mail.detail.html'
              })
              .state('app.mail.compose', {
                  url: '/compose',
                  templateUrl: 'app/views/mail.new.html'
              })

      }
    ]
    */
  );
