angular.module('project').controller('ProjectCtrl', ['$rootScope', '$scope',
  function( $rootScope, $scope ) {


}]);

angular.module('project').controller('ProjectCreateCtrl',
  ['$rootScope', '$scope', '$location', 'Projects', 'toaster',
  function( $rootScope, $scope, $location, Projects, toaster ) {

    $scope.host = $location.host();

    $scope.create = function() {

      Projects.save({
          projectKey: this.projectKey
        },{
          projectKey: this.projectKey,
          name: this.name,
          address:this.address,
          host: this.host,
          description: this.description
        }, function(response) {
          toaster.pop({
            type: 'success',
            title: response.name,
            body: 'A New Project created'
        });
          //$location.path('articles/' + response._id);
      });
    };

}]);

angular.module('project').controller('ProjectSearchCtrl',
  ['$rootScope', '$scope', '$location', 'Projects',
  function( $rootScope, $scope, $location, Projects ) {

    $scope.listProjects = function(){
      var searchCond = $scope.searchFilterText ?  JSON.parse("{\"" + $scope.searchFilterText.replace(":","\":\"") + "\"}"):{};
      Projects.query(searchCond).$promise.then(function(projects) {
          $scope.projects = projects;
      });
    };

    $scope.listProjects();



}]);
