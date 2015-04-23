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


angular.module('admin').controller('AdminUserCtrl', ['$rootScope', '$scope', '$modal', 'Users', '$log',
  function( $rootScope, $scope, $modal, Users, $log ) {

    //http://l-lin.github.io/angular-datatables
    $scope.listUsers = function(){
      var searchCond = $scope.searchFilterText ?  JSON.parse("{\"" + $scope.searchFilterText.replace(":","\":\"") + "\"}"):{};
      Users.query(searchCond).$promise.then(function(users) {
          $scope.users = users;
      });
    };

    $scope.listUsers();

    $scope.listUsersByFilter = function(auth){
      $scope.searchFilterText = (auth && auth.length > 0 ) ? ('auth:' + auth): '';
      $scope.listUsers();
    };

    $scope.openUserCreateModal = function () {
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

    $scope.openUserDetailModal = function (email) {
        var modalInstance = $modal.open({
          templateUrl: 'admin-user-detail.template',
          controller: 'AdminUserDetailModalInstanceCtrl',
          resolve: {
            email: function(){
              return email;
            }
          }
        });

        modalInstance.result.then(function (rtn) {
          if(rtn.success) $scope.listUsers();
        });
    };

}]);

angular.module('admin').controller('AdminUserCreateModalInstanceCtrl',
  ['$scope', '$modalInstance', 'Users', 'toaster', 'UserAuths', '$log',
  function( $scope, $modalInstance, Users, toaster, UserAuths, $log ) {

    UserAuths.query().$promise.then(function(userAuths) {
        $scope.userAuths = userAuths;
        $scope.userAuth = userAuths[0];
    });

    $scope.create = function() {
      var user = new Users({
          name: this.name,
          email: this.email,
          password: this.password,
          auth: this.userAuth.code
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

angular.module('admin').controller('AdminUserDetailModalInstanceCtrl',
  ['$scope', '$modalInstance', 'Users', 'toaster', 'UserAuths', '$log', 'email',
  function( $scope, $modalInstance, Users, toaster, UserAuths, $log, email ) {

    Users.get({email:email}, function(user){
      $scope.user = user;
      //$scope.userAuth = user.auth;
    });

    UserAuths.query().$promise.then(function(userAuths) {
        $scope.userAuths = userAuths;
    });

    $scope.save = function() {
      Users.update({email: $scope.user.email}, $scope.user).$promise.then(function(user) {
        toaster.pop({
          type: 'success',
          title: user.name,
          body: 'A User Info has been changed.'
        });
        $modalInstance.close({success:true});
      });
    };

    $scope.delete = function() {
      Users.delete({email: $scope.user.email}).$promise.then(function() {
        toaster.pop({
          type: 'success',
          title: $scope.user.email,
          body: 'A User has been deleted.'
        });
        $modalInstance.close({success:true});
      });
    };


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

}]);
