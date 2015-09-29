angular.module('wtf.dashboard', ['checklist-model'])
  .controller('DashboardController', function($scope, $window, Recipes) {

    $scope.getAllRecipes = function() {
      Recipes.getRecipes()
      .success(function(data){
        $scope.allRecipes = data;
      })
      .catch(function(err){
        console.log(err);
      })
    }

    $scope.recipes  = {
      selected: Recipes.selectedRecipes
    }

    // $scope.$watch(Auth.isAuth, function(authed) {
    //   if (authed) {
    //     $location.path('/create-recipes');
    //   } else {
    //     $location.path('/');
    //   }
    // }, true);

    $scope.getShoppingList = function() {
      console.log($scope.recipes.selected)
    };

    $scope.getAllRecipes();
  });