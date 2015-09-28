angular.module('wtf.nav-controller',[])
  .controller('NavController',function($scope,$http, $location, Navbar) {

  $scope.loggedIn = false;

  $scope.isLoggedIn = function() {
    Navbar.isLoggedIn().then(function(data){
      $scope.loggedIn = data.data
    })
  };

  $scope.isLoggedIn();

  $scope.logOut = function(){
    $scope.loggedIn = false;
    Navbar.logOut()
  }
});
