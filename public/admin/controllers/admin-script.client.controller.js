angular.module('admin').controller('AdminScriptCtrl',
  ['$rootScope', '$scope', 'Scripts', 'ScriptLatest', 'toaster', 'DTOptionsBuilder',
  function( $rootScope, $scope, Scripts, ScriptLatest, toaster, DTOptionsBuilder ) {

    $scope.scriptDtOptions = DTOptionsBuilder.newOptions().withOption('order', [[1, 'desc']]);

    $scope.initialize = function(){
      ScriptLatest.get(function(script){
        $scope.script = script;
      });

      Scripts.query().$promise.then(function(scripts) {
          $scope.scripts = scripts;
      });
    };

    $scope.initialize();

    $scope.save = function() {
      var script = new ScriptLatest({
          script: this.script.script
      });

      script.$save(function(response) {
          toaster.pop({
            type: 'success',
            title: 'New Version',
            body: 'A Script has been updated'
          });
          $scope.initialize();
      });

    };
}]);
