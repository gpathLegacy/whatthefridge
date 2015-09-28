angular.module('wtf.fridge',[])
  .controller('FridgeController',function($scope,$http, $location) {
    // $scope.cold = "I am very cold"
    $scope.testData = [
      {ingredient: "meat", price: "$5", quantity: 3},
      {ingredient: "pasta", price: "$2", quantity: 4},
      {ingredient: "chocolate", price:"$3", quantity: 5},
      {ingredient: "flour", price: "$2", quantity: 3}
    ]
});
