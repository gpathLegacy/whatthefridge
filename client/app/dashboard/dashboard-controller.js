angular.module('wtf.dashboard', ['checklist-model'])
  .controller('DashboardController', function($scope, $window) {
    $scope.allRecipes = [
      {id: 1, title: "Lasagna", ingredients: ['tomatoes', 'italian sauage', 'cheese']},
      {id: 2, title: "Turkey meatloaf", ingredients: ['tomatoes']},
      {id: 3, title: "Omelette", ingredients: ['eggs', 'milk', 'cheese']}
    ];

    $scope.recipes  = {
      selected:[]
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

    // $scope.getAllRecipes = function(){
    //   Recipes.getAllRecipes().
    //          .then(function(data){
    //            $scope.allRecipes = data;
    //          })
    // };


  });