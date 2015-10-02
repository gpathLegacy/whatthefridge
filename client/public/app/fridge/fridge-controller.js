angular.module('wtf.fridge',[])
  .controller('FridgeController',function($scope,$http, $location, Fridge) {

    $scope.addModal = function() {
      $("#addItem").openModal();
    };

    $scope.addItem = function() {
      Fridge.addItem({name:$scope.itemToAdd}).then(function(){
        $("#addItem").closeModal();
        $scope.getFridge();
      });
    };

    $scope.getFridge = function() {
      Fridge.getFridge().then(function(fridge) {
        $scope.data = fridge.data;
        $scope.today = Date.now();
        $scope.twoFromToday = new Date($scope.today + 2*86400000);
        
        $scope.expiring = $scope.data
                                .filter(function(entry){
                                  var entry_expires =  new Date(entry.expiration);
                                  if(entry_expires < $scope.twoFromToday){
                                    return entry;
                                  }
                                });

        $scope.expireAmount = $scope.expiring
                                    .reduce(function(sum, entry){
                                        return sum+= Number(entry.qty) * Number(entry.price)
                                    }, 0 )
        
        Materialize.toast("You have have " + $scope.expiring.length + 
                        " items" + " worth $" + 
                        $scope.expireAmount + 
                        " expiring in 2 days", 4000)
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
        $scope.expiring = [];
      }
    }
    $scope.getFridge();
});
