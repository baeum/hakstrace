angular.module('admin').controller('AdminCtrl', ['$rootScope', '$scope',
  function( $rootScope, $scope ) {

  // config
  $rootScope.app = {
    settings: {
      asideFixed: true
    }
  };

  $scope.folds = [
    {name: 'Inbox', filter:''},
    {name: 'Starred', filter:'starred'},
    {name: 'Sent', filter:'sent'},
    {name: 'Important', filter:'important'},
    {name: 'Draft', filter:'draft'},
    {name: 'Trash', filter:'trash'}
  ];

  $scope.labels = [
    {name: 'Angular', filter:'angular', color:'#23b7e5'},
    {name: 'Bootstrap', filter:'bootstrap', color:'#7266ba'},
    {name: 'Client', filter:'client', color:'#fad733'},
    {name: 'Work', filter:'work', color:'#27c24c'}
  ];

  $scope.addLabel = function(){
    $scope.labels.push(
      {
        name: $scope.newLabel.name,
        filter: angular.lowercase($scope.newLabel.name),
        color: '#ccc'
      }
    );
    $scope.newLabel.name = '';
  }

  $scope.labelClass = function(label) {
    return {
      'b-l-info': angular.lowercase(label) === 'angular',
      'b-l-primary': angular.lowercase(label) === 'bootstrap',
      'b-l-warning': angular.lowercase(label) === 'client',
      'b-l-success': angular.lowercase(label) === 'work'
    };
  };

}]);


angular.module('admin').controller('AdminUserCtrl', ['$rootScope', '$scope', '$modal', '$log', '$resource',
  function( $rootScope, $scope, $modal, $log, $resource ) {

    //http://l-lin.github.io/angular-datatables
    $scope.listUsers = function(){
      $resource('/api/admin/users').query().$promise.then(function(users) {
          $scope.users = users;
      });
    };

    $scope.listUsers();

    $scope.openUserCreateModal = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'admin-user-create.template',
          controller: 'AdminUserCreateModalInstanceCtrl',
          size: 'lg'
        });

        modalInstance.result.then(function (rtn) {
          if(rtn.success) $scope.listUsers();
        }, function () {
          //$log.info('Modal dismissed at: ' + new Date());
        });

      };

}]);

angular.module('admin').controller('AdminUserCreateModalInstanceCtrl',
  ['$scope', '$modalInstance', 'Users', 'toaster',
  function( $scope, $modalInstance, Users, toaster ) {

    $scope.create = function() {
      var user = new Users({
          name: this.name,
          email: this.email,
          password: this.password
      });
      user.$save(function(response) {
          toaster.pop({
            type: 'success',
            title: response.name,
            body: 'A New User added'
          });
          $modalInstance.close({success:true});
          //$location.path('articles/' + response._id);
      });
    };


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

}]);
