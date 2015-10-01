angular.module('wtf.fridge',[])
  .controller('FridgeController',function($scope,$http, $location, Fridge) {

    $scope.getFridge = function() {
      Fridge.getFridge().then(function(fridge) {
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

      if ($scope.data.every(function(entry){return entry.qty === 0})){
        $scope.data = [];
      }
    }

    $scope.getFridge();
});
