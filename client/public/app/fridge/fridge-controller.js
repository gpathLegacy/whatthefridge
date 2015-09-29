angular.module('wtf.fridge',[])
  .controller('FridgeController',function($scope,$http, $location, Fridge) {
    // $scope.testData = [
    //   {ingredient: "meat", price: "$5", quantity: 3, unit:"lbs."},
    //   {ingredient: "pasta", price: "$2", quantity: 4, unit:"packages"},
    //   {ingredient: "chocolate", price:"$3", quantity: 5, unit:"pieces"},
    //   {ingredient: "flour", price: "$2", quantity: 3, unit:"lbs."}
    // ];

    $scope.getFridge = function() {
      Fridge.getFridge().then(function(fridge) {
        console.log("Fridge: ", fridge.data);
        $scope.testData = fridge.data;
      })
    };

    $scope.getFridge();
});
