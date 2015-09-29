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

    //this is run from the dashboard html, on clicking a specific recipe
    $scope.editRecipes = function() {
      //call edit-recipe controller function and pass the variables
      //or share the variables and redirect to edit html path
      
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