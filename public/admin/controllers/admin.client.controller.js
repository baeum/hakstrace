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


angular.module('admin').controller('AdminUserCtrl', ['$rootScope', '$scope', '$modal', '$log',
  function( $rootScope, $scope, $modal, $log ) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.openUserCreateModal = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'admin-user-create.template',
          //controller: 'ModalInstanceCtrl',
          size: 'lg',
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    $scope.closeUserCreateModal = function(){
        $modal.dismiss('cancel');
    };

}]);
