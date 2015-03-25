'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', '$routeProvider', 'JQ_CONFIG',
      function ($stateProvider,   $urlRouterProvider,  $routeProvider, JQ_CONFIG) {

          $routeProvider
              .when('/', {
                  templateUrl: 'app'
              });
              //.otherwise('/app/dashboard-v2');

          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: '/app'
              })
              .state('app.dashboard-v1', {
                  url: '/dashboard-v1',
                  //templateUrl: 'app/views/app_dashboard_v1.html',
                  templateUrl: 'app/views/app_dashboard_v1.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['app/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.dashboard-v2', {
                  url: '/dashboard-v2',
                  templateUrl: 'app/views/app_dashboard_v2.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['app/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.ui', {
                  url: '/ui',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.ui.buttons', {
                  url: '/buttons',
                  templateUrl: 'app/views/ui_buttons.html'
              })
              .state('app.ui.icons', {
                  url: '/icons',
                  templateUrl: 'app/views/ui_icons.html'
              })
              .state('app.ui.grid', {
                  url: '/grid',
                  templateUrl: 'app/views/ui_grid.html'
              })
              .state('app.ui.widgets', {
                  url: '/widgets',
                  templateUrl: 'app/views/ui_widgets.html'
              })
              .state('app.ui.bootstrap', {
                  url: '/bootstrap',
                  templateUrl: 'app/views/ui_bootstrap.html'
              })
              .state('app.ui.sortable', {
                  url: '/sortable',
                  templateUrl: 'app/views/ui_sortable.html'
              })
              .state('app.ui.scroll', {
                  url: '/scroll',
                  templateUrl: 'app/views/ui_scroll.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load('app/controllers/scroll.js');
                      }]
                  }
              })
              .state('app.ui.portlet', {
                  url: '/portlet',
                  templateUrl: 'app/views/ui_portlet.html'
              })
              .state('app.ui.timeline', {
                  url: '/timeline',
                  templateUrl: 'app/views/ui_timeline.html'
              })
              .state('app.ui.tree', {
                  url: '/tree',
                  templateUrl: 'app/views/ui_tree.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                              function(){
                                 return $ocLazyLoad.load('app/controllers/tree.js');
                              }
                          );
                        }
                      ]
                  }
              })
              .state('app.ui.toaster', {
                  url: '/toaster',
                  templateUrl: 'app/views/ui_toaster.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('toaster').then(
                              function(){
                                 return $ocLazyLoad.load('app/controllers/toaster.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.ui.jvectormap', {
                  url: '/jvectormap',
                  templateUrl: 'app/views/ui_jvectormap.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('app/controllers/vectormap.js');
                      }]
                  }
              })
              .state('app.ui.googlemap', {
                  url: '/googlemap',
                  templateUrl: 'app/views/ui_googlemap.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( [
                            'app/widgets/map/load-google-maps.js',
                            'app/widgets/map/ui-map.js',
                            'app/widgets/map/map.js'] ).then(
                              function(){
                                return loadGoogleMaps();
                              }
                            );
                      }]
                  }
              })
              .state('app.chart', {
                  url: '/chart',
                  templateUrl: 'app/views/ui_chart.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load('app/controllers/chart.js');
                      }]
                  }
              })
              // table
              .state('app.table', {
                  url: '/table',
                  template: '<div ui-view></div>'
              })
              .state('app.table.static', {
                  url: '/static',
                  templateUrl: 'app/views/table_static.html'
              })
              .state('app.table.datatable', {
                  url: '/datatable',
                  templateUrl: 'app/views/table_datatable.html'
              })
              .state('app.table.footable', {
                  url: '/footable',
                  templateUrl: 'app/views/table_footable.html'
              })
              .state('app.table.grid', {
                  url: '/grid',
                  templateUrl: 'app/views/table_grid.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ngGrid').then(
                              function(){
                                  return $ocLazyLoad.load('app/controllers/grid.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.table.uigrid', {
                  url: '/uigrid',
                  templateUrl: 'app/views/table_uigrid.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ui.grid').then(
                              function(){
                                  return $ocLazyLoad.load('app/controllers/uigrid.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.table.editable', {
                  url: '/editable',
                  templateUrl: 'app/views/table_editable.html',
                  controller: 'XeditableCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('xeditable').then(
                              function(){
                                  return $ocLazyLoad.load('app/controllers/xeditable.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.table.smart', {
                  url: '/smart',
                  templateUrl: 'app/views/table_smart.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('smart-table').then(
                              function(){
                                  return $ocLazyLoad.load('app/controllers/table.js');
                              }
                          );
                      }]
                  }
              })
              // form
              .state('app.form', {
                  url: '/form',
                  template: '<div ui-view class="fade-in"></div>',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load('app/controllers/form.js');
                      }]
                  }
              })
              .state('app.form.components', {
                  url: '/components',
                  templateUrl: 'app/views/form_components.html',
                  resolve: {
                      deps: ['uiLoad', '$ocLazyLoad',
                        function( uiLoad, $ocLazyLoad ){
                          return uiLoad.load( JQ_CONFIG.daterangepicker )
                          .then(
                              function(){
                                return uiLoad.load('app/controllers/form.components.js');
                              }
                          ).then(
                              function(){
                                return $ocLazyLoad.load('ngBootstrap');
                              }
                          );
                        }
                      ]
                  }
              })
              .state('app.form.elements', {
                  url: '/elements',
                  templateUrl: 'app/views/form_elements.html'
              })
              .state('app.form.validation', {
                  url: '/validation',
                  templateUrl: 'app/views/form_validation.html'
              })
              .state('app.form.wizard', {
                  url: '/wizard',
                  templateUrl: 'app/views/form_wizard.html'
              })
              .state('app.form.fileupload', {
                  url: '/fileupload',
                  templateUrl: 'app/views/form_fileupload.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('angularFileUpload').then(
                              function(){
                                 return $ocLazyLoad.load('app/controllers/file-upload.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.imagecrop', {
                  url: '/imagecrop',
                  templateUrl: 'app/views/form_imagecrop.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('ngImgCrop').then(
                              function(){
                                 return $ocLazyLoad.load('app/controllers/imgcrop.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.select', {
                  url: '/select',
                  templateUrl: 'app/views/form_select.html',
                  controller: 'SelectCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ui.select').then(
                              function(){
                                  return $ocLazyLoad.load('app/controllers/select.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.slider', {
                  url: '/slider',
                  templateUrl: 'app/views/form_slider.html',
                  controller: 'SliderCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('vr.directives.slider').then(
                              function(){
                                  return $ocLazyLoad.load('app/controllers/slider.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.editor', {
                  url: '/editor',
                  templateUrl: 'app/views/form_editor.html',
                  controller: 'EditorCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('textAngular').then(
                              function(){
                                  return $ocLazyLoad.load('app/controllers/editor.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.xeditable', {
                  url: '/xeditable',
                  templateUrl: 'app/views/form_xeditable.html',
                  controller: 'XeditableCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('xeditable').then(
                              function(){
                                  return $ocLazyLoad.load('app/controllers/xeditable.js');
                              }
                          );
                      }]
                  }
              })
              // pages
              .state('app.page', {
                  url: '/page',
                  template: '<div ui-view class="fade-in-down"></div>'
              })
              .state('app.page.profile', {
                  url: '/profile',
                  templateUrl: 'app/views/page_profile.html'
              })
              .state('app.page.post', {
                  url: '/post',
                  templateUrl: 'app/views/page_post.html'
              })
              .state('app.page.search', {
                  url: '/search',
                  templateUrl: 'app/views/page_search.html'
              })
              .state('app.page.invoice', {
                  url: '/invoice',
                  templateUrl: 'app/views/page_invoice.html'
              })
              .state('app.page.price', {
                  url: '/price',
                  templateUrl: 'app/views/page_price.html'
              })
              .state('app.docs', {
                  url: '/docs',
                  templateUrl: 'app/views/docs.html'
              })
              // others
              .state('lockme', {
                  url: '/lockme',
                  templateUrl: 'app/views/page_lockme.html'
              })
              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })
              .state('access.signin', {
                  url: '/signin',
                  templateUrl: 'app/views/page_signin.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['app/controllers/signin.js'] );
                      }]
                  }
              })
              .state('access.signup', {
                  url: '/signup',
                  templateUrl: 'app/views/page_signup.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['app/controllers/signup.js'] );
                      }]
                  }
              })
              .state('access.forgotpwd', {
                  url: '/forgotpwd',
                  templateUrl: 'app/views/page_forgotpwd.html'
              })
              .state('access.404', {
                  url: '/404',
                  templateUrl: 'app/views/page_404.html'
              })

              // fullCalendar
              .state('app.calendar', {
                  url: '/calendar',
                  templateUrl: 'app/views/app_calendar.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['$ocLazyLoad', 'uiLoad',
                        function( $ocLazyLoad, uiLoad ){
                          return uiLoad.load(
                            JQ_CONFIG.fullcalendar.concat('app/widgets/calendar/calendar.js')
                          ).then(
                            function(){
                              return $ocLazyLoad.load('ui.calendar');
                            }
                          )
                      }]
                  }
              })

              // mail
              .state('app.mail', {
                  abstract: true,
                  url: '/mail',
                  templateUrl: 'app/views/mail.html',
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

              .state('layout', {
                  abstract: true,
                  url: '/layout',
                  templateUrl: 'app/views/layout.html'
              })
              .state('layout.fullwidth', {
                  url: '/fullwidth',
                  views: {
                      '': {
                          templateUrl: 'app/views/layout_fullwidth.html'
                      },
                      'footer': {
                          templateUrl: 'app/views/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['app/controllers/vectormap.js'] );
                      }]
                  }
              })
              .state('layout.mobile', {
                  url: '/mobile',
                  views: {
                      '': {
                          templateUrl: 'app/views/layout_mobile.html'
                      },
                      'footer': {
                          templateUrl: 'app/views/layout_footer_mobile.html'
                      }
                  }
              })
              .state('layout.app', {
                  url: '/app',
                  views: {
                      '': {
                          templateUrl: 'app/views/layout_app.html'
                      },
                      'footer': {
                          templateUrl: 'app/views/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['app/controllers/tab.js'] );
                      }]
                  }
              })
              .state('apps', {
                  abstract: true,
                  url: '/apps',
                  templateUrl: 'app/views/layout.html'
              })
              .state('apps.note', {
                  url: '/note',
                  templateUrl: 'app/views/apps_note.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['app/widgets/note/note.js',
                                               JQ_CONFIG.moment] );
                      }]
                  }
              })
              .state('apps.contact', {
                  url: '/contact',
                  templateUrl: 'app/views/apps_contact.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['app/widgets/contact/contact.js'] );
                      }]
                  }
              })
              .state('app.weather', {
                  url: '/weather',
                  templateUrl: 'app/views/apps_weather.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(
                              {
                                  name: 'angular-skycons',
                                  files: ['app/widgets/weather/skycons.js',
                                          'app/widgets/weather/angular-skycons.js',
                                          'app/widgets/weather/ctrl.js',
                                          JQ_CONFIG.moment ]
                              }
                          );
                      }]
                  }
              })
              .state('app.todo', {
                  url: '/todo',
                  templateUrl: 'app/views/apps_todo.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['app/widgets/todo/todo.js',
                                               JQ_CONFIG.moment] );
                      }]
                  }
              })
              .state('app.todo.list', {
                  url: '/{fold}'
              })
              .state('music', {
                  url: '/music',
                  templateUrl: 'app/views/music.html',
                  controller: 'MusicCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load([
                            'com.2fdevs.videogular',
                            'com.2fdevs.videogular.plugins.controls',
                            'com.2fdevs.videogular.plugins.overlayplay',
                            'com.2fdevs.videogular.plugins.poster',
                            'com.2fdevs.videogular.plugins.buffering',
                            'app/widgets/music/ctrl.js',
                            'app/widgets/music/theme.css'
                          ]);
                      }]
                  }
              })
                .state('music.home', {
                    url: '/home',
                    templateUrl: 'app/views/music.home.html'
                })
                .state('music.genres', {
                    url: '/genres',
                    templateUrl: 'app/views/music.genres.html'
                })
                .state('music.detail', {
                    url: '/detail',
                    templateUrl: 'app/views/music.detail.html'
                })
                .state('music.mtv', {
                    url: '/mtv',
                    templateUrl: 'app/views/music.mtv.html'
                })
                .state('music.mtvdetail', {
                    url: '/mtvdetail',
                    templateUrl: 'app/views/music.mtv.detail.html'
                })
                .state('music.playlist', {
                    url: '/playlist/{fold}',
                    templateUrl: 'app/views/music.playlist.html'
                })
      }
    ]
  );
