angular.module('wtf.nav-controller',[])
  .controller('NavController',["$scope", "$http", "$location", "Navbar", function($scope,$http, $location, Navbar) {

  $scope.loggedIn = false;

  $scope.isLoggedIn = function() {
    Navbar.isLoggedIn().then(function(data){
      $scope.loggedIn = data.data
    })
  };

  $scope.isLoggedIn();

  $scope.logOut = function(){
    $scope.loggedIn=false;
    $location.path('/')
    Navbar.logOut()
  }

  $scope.isActive = function (viewLocation) {
     var active = (viewLocation === $location.url());
     return active;
};
}]);
