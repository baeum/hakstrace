//angular.module('app', []);


angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'ui.load',
    'ui.jq',
    'oc.lazyLoad',
    'pascalprecht.translate'
]);

angular.module('app')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {

        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
    }
  ])
  .config(['$translateProvider', function($translateProvider){
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'resources/l10n/',
      suffix: '.js'
    });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
  }]);

angular.module('app')
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
      easyPieChart:   [   '/lib/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js'],
      sparkline:      [   '/lib/jquery.sparkline/dist/jquery.sparkline.retina.js'],
      plot:           [   '/lib/flot/jquery.flot.js',
                          '/lib/flot/jquery.flot.pie.js',
                          '/lib/flot/jquery.flot.resize.js',
                          '/lib/flot.tooltip/js/jquery.flot.tooltip.js',
                          '/lib/flot.orderbars/js/jquery.flot.orderBars.js',
                          '/lib/flot-spline/js/jquery.flot.spline.js'],
      moment:         [   '/lib/moment/moment.js'],
      screenfull:     [   '/lib/screenfull/dist/screenfull.min.js'],
      slimScroll:     [   '/lib/slimscroll/jquery.slimscroll.min.js'],
      sortable:       [   '/lib/html5sortable/jquery.sortable.js'],
      nestable:       [   '/lib/nestable/jquery.nestable.js',
                          '/lib/nestable/jquery.nestable.css'],
      filestyle:      [   '/lib/bootstrap-filestyle/src/bootstrap-filestyle.js'],
      slider:         [   '/lib/bootstrap-slider/bootstrap-slider.js',
                          '/lib/bootstrap-slider/bootstrap-slider.css'],
      chosen:         [   '/lib/chosen/chosen.jquery.min.js',
                          '/lib/bootstrap-chosen/bootstrap-chosen.css'],
      TouchSpin:      [   '/lib/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js',
                          '/lib/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],
      wysiwyg:        [   '/lib/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                          '/lib/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
      dataTable:      [   '/lib/datatables/media/js/jquery.dataTables.min.js',
                          '/lib/plugins/integration/bootstrap/3/dataTables.bootstrap.js',
                          '/lib/plugins/integration/bootstrap/3/dataTables.bootstrap.css'],
      vectorMap:      [   '/lib/bower-jvectormap/jquery-jvectormap-1.2.2.min.js',
                          '/lib/bower-jvectormap/jquery-jvectormap-world-mill-en.js',
                          '/lib/bower-jvectormap/jquery-jvectormap-us-aea-en.js',
                          '/lib/bower-jvectormap/jquery-jvectormap-1.2.2.css'],
      footable:       [   '/lib/footable/dist/footable.all.min.js',
                          '/lib/footable/css/footable.core.css'],
      fullcalendar:   [   '/lib/moment/moment.js',
                          '/lib/fullcalendar/fullcalendar.min.js',
                          '/lib/fullcalendar/fullcalendar.css'],
      daterangepicker:[   '/lib/moment/moment.js',
                          '/lib/bootstrap-daterangepicker/daterangepicker.js',
                          '/lib/bootstrap-daterangepicker/daterangepicker-bs3.css'],
      tagsinput:      [   '/lib/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
                          '/lib/bootstrap-tagsinput/dist/bootstrap-tagsinput.css']

    }
  )
  // oclazyload config
  .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
      // We configure ocLazyLoad to use the lib script.js as the async loader
      $ocLazyLoadProvider.config({
          debug:  true,
          events: true,
          modules: [
              {
                  name: 'ngGrid',
                  files: [
                      '/lib/ng-grid/build/ng-grid.min.js',
                      '/lib/ng-grid/ng-grid.min.css',
                      '/lib/ng-grid/ng-grid.bootstrap.css'
                  ]
              },
              {
                  name: 'ui.grid',
                  files: [
                      '/lib/angular-ui-grid/ui-grid.min.js',
                      '/lib/angular-ui-grid/ui-grid.min.css',
                      '/lib/angular-ui-grid/ui-grid.bootstrap.css'
                  ]
              },
              {
                  name: 'ui.select',
                  files: [
                      '/lib/angular-ui-select/dist/select.min.js',
                      '/lib/angular-ui-select/dist/select.min.css'
                  ]
              },
              {
                  name:'angularFileUpload',
                  files: [
                    '/lib/angular-file-upload/angular-file-upload.min.js'
                  ]
              },
              {
                  name:'ui.calendar',
                  files: ['/lib/angular-ui-calendar/src/calendar.js']
              },
              {
                  name: 'ngImgCrop',
                  files: [
                      '/lib/ngImgCrop/compile/minified/ng-img-crop.js',
                      '/lib/ngImgCrop/compile/minified/ng-img-crop.css'
                  ]
              },
              {
                  name: 'angularBootstrapNavTree',
                  files: [
                      '/lib/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                      '/lib/angular-bootstrap-nav-tree/dist/abn_tree.css'
                  ]
              },
              {
                  name: 'toaster',
                  files: [
                      '/lib/angularjs-toaster/toaster.js',
                      '/lib/angularjs-toaster/toaster.css'
                  ]
              },
              {
                  name: 'textAngular',
                  files: [
                      '/lib/textAngular/dist/textAngular-sanitize.min.js',
                      '/lib/textAngular/dist/textAngular.min.js'
                  ]
              },
              {
                  name: 'vr.directives.slider',
                  files: [
                      '/lib/venturocket-angular-slider/build/angular-slider.min.js',
                      '/lib/venturocket-angular-slider/build/angular-slider.css'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular',
                  files: [
                      '/lib/videogular/videogular.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.controls',
                  files: [
                      '/lib/videogular-controls/controls.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.buffering',
                  files: [
                      '/lib/videogular-buffering/buffering.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.overlayplay',
                  files: [
                      '/lib/videogular-overlay-play/overlay-play.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.poster',
                  files: [
                      '/lib/videogular-poster/poster.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.imaads',
                  files: [
                      '/lib/videogular-ima-ads/ima-ads.min.js'
                  ]
              },
              {
                  name: 'xeditable',
                  files: [
                      '/lib/angular-xeditable/dist/js/xeditable.min.js',
                      '/lib/angular-xeditable/dist/css/xeditable.css'
                  ]
              },
              {
                  name: 'smart-table',
                  files: [
                      '/lib/angular-smart-table/dist/smart-table.min.js'
                  ]
              }
          ]
      });
  }])
;
