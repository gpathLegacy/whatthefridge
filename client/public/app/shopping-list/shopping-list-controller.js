// Note: If the price is saved in any format other than "xxx.xx" where x are digits,
// the price will be dropped from the database. Need to add form validation to tell the
// user to enter the price correctly. Two digits after the decimal are REQUIRED

// Another issue - duplicate ingredients show up in the list. If the user enters two different prices,
// only the last one saved will persist in the database. This is expected. Need to find a way to only
// show ingredients once.

angular.module('wtf.shopping-list', [])
  .controller('ShoppingListController', function($scope, $window, $location, Recipes, Fridge, SavedLists) {

    $scope.shoppingList = [];

    $scope.checkPrice = function() {
      $('form[name="priceForm{{$index}}]"')
    }

    $scope.populateList = function() {
      // When we initialize this page, set fridgeFlag to true, enabling the fridge button.
      // Also set notSavedFlag to true, enabling the save button
      $scope.fridgeFlag = true;
      $scope.notSavedFlag = true;

      for (var i = 0; i < Recipes.selectedRecipes.length; i++) {
        for (var j = 0; j < Recipes.selectedRecipes[i].ingredients.length; j++) {

          // Look to see if ingredient already exists in shopping list
          var existingItem = $scope.shoppingList.filter(function(item) {
            return item.name === Recipes.selectedRecipes[i].ingredients[j]
          });

          // If item exists, increase its quantity
          if (existingItem.length) {
            $scope.shoppingList[$scope.shoppingList.indexOf(existingItem[0])].qty++;
          }

          // If item doesn't exist, add it to shopping list
          else {
            $scope.shoppingList.push({ name: Recipes.selectedRecipes[i].ingredients[j], qty:1 });
          
            // get and set price of most recently pushed ingredient object
            // (self calling function is required in order to update the correct index inside the promise)
            (function(index){
              Recipes.getIngredientPrice($scope.shoppingList[$scope.shoppingList.length-1]).then(function(price) {
                $scope.shoppingList[index].price = price.data;
              });
            })($scope.shoppingList.length-1)
          }
        }
      }
      Recipes.selectedRecipes = [];
    };

    $scope.savePrice = function(ingredient) {
      Recipes.setIngredientPrice($scope.shoppingList[$scope.shoppingList.indexOf(ingredient)]);
    };

    $scope.addToFridge = function() {
      if ($scope.fridgeFlag) {
        Fridge.addList($scope.shoppingList).then(function(){
          // Show a message that confirms success and disable the button
          $('.fridgeButton').addClass('disabled');
          $scope.fridgeFlag = false;
        });
      }
    };

    $scope.saveList = function() {
      if ($scope.notSavedFlag) {
        SavedLists.saveList($scope.shoppingList).then(function(){
          // Show a message that confirms success and disable the button
          $('.saveButton').addClass('disabled');
          $scope.notSavedFlag = false;
        });
        
      }
    };

    $scope.populateList();

  });