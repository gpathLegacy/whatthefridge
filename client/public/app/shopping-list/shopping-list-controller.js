// Note: If the price is saved in any format other than "xxx.xx" where x are digits,
// the price will be dropped from the database. Need to add form validation to tell the
// user to enter the price correctly. Two digits after the decimal are REQUIRED

// Another issue - duplicate ingredients show up in the list. If the user enters two different prices,
// only the last one saved will persist in the database. This is expected. Need to find a way to only
// show ingredients once.

angular.module('wtf.shopping-list', [])
  .controller('ShoppingListController', function($scope, $window, Recipes) {

    $scope.shoppingList = [];

    $scope.populateList = function() {
      for (var i = 0; i < Recipes.selectedRecipes.length; i++) {
        for (var j = 0; j < Recipes.selectedRecipes[i].ingredients.length; j++) {
          $scope.shoppingList.push({ name: Recipes.selectedRecipes[i].ingredients[j] });

          // get and set price of most recently pushed ingredient object
          (function(index){
            Recipes.getIngredientPrice($scope.shoppingList[$scope.shoppingList.length-1]).then(function(price) {
              $scope.shoppingList[index].price = price.data;
            });
          })($scope.shoppingList.length-1)
        }
      }
    };

    $scope.savePrice = function(ingredient) {
      Recipes.setIngredientPrice($scope.shoppingList[$scope.shoppingList.indexOf(ingredient)]);
    };

    $scope.populateList();

  });