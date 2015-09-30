angular.module('wtf.fridge',[])
  .controller('FridgeController',function($scope,$http, $location, Fridge) {

    $scope.getFridge = function() {
      Fridge.getFridge().then(function(fridge) {
        console.log("Fridge: ", fridge.data);
        $scope.data = fridge.data;
      })
    };

    $scope.saveFridge = function() {
      Fridge.updateFridge($scope.data);
    };

    $scope.increaseQty = function(ingredient) {
      ingredient.qty++;
      $scope.saveFridge();
    };

    $scope.decreaseQty = function(ingredient) {
      if (ingredient.qty > 0) ingredient.qty--;
      $scope.saveFridge();
    }

    $scope.getFridge();
});
