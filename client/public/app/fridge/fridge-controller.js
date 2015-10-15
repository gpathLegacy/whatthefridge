angular.module('wtf.fridge',[])
  .controller('FridgeController',["$scope", "$http", "$location", "Fridge", "Recipes", function($scope,$http, $location, Fridge, Recipes) {

    $scope.fridgePopulate = function(){
      var data = {
        name: "Pepperoni",
      }
      Fridge.addItem(data)
        .then(function() {
          window.location.reload();
        })
          .then(function() {
            alert("yo!");
        })
    };

    $scope.addModal = function() {
      $("#addItem").openModal();
    };

    $scope.addItem = function() {
      Fridge.addItem({name:$scope.itemToAdd}).then(function(){
        $("#addItem").closeModal();
        $scope.getFridge();
      });
    };

    $scope.checkPrice = function(index) {
      var formName = "priceForm" + index;
      var formCheck = $scope.$$childHead.$$childHead.$$childHead;

      // walk through scope objects to find the one containing the form in question
      while (formScope === undefined) {
        if(formCheck[formName]) {
          var formScope = formCheck[formName];
        } else {
          formCheck = formCheck.$parent.$$nextSibling.$$childHead;
        }
      }

      // if the form is invalid (doesn't match pattern), tell user what the format is. Return false so
      // the price won't be saved as undefined in the savePrice function
      if(formScope.$invalid) {
        Materialize.toast('Price must match format: 0.00', 4000);
        return false;
      } else return true;
    };

    $scope.savePrice = function(ingredient, prevPrice, index) {
      if(prevPrice) {
        if ($scope.checkPrice(index)) {
          $scope.totalPrice = parseFloat($scope.totalPrice) - parseFloat(prevPrice) + parseFloat(ingredient.price);
          Recipes.setIngredientPrice($scope.data[index]);
        }
      }
    };

    $scope.getFridge = function() {
      Fridge.getFridge().then(function(fridge) {
        $scope.data = fridge.data;
        $scope.today = Date.now();
        $scope.todayInISO = new Date($scope.today).toISOString().split('T')[0];
        $scope.twoFromToday = new Date($scope.today + 2*86400000);

        for (var i = 0; i < $scope.data.length; i++) {
          $scope.data[i].qty = parseFloat($scope.data[i].qty);
          $scope.data[i].expiration = new Date($scope.data[i].expiration);
          $scope.data[i].oldExpiration = new Date($scope.data[i].expiration);
        }

        $scope.expiring = $scope.data
                                .filter(function(entry){
                                  if(entry.expiration > $scope.today && entry.expiration < $scope.twoFromToday){
                                    return entry;
                                  }
                                });

        $scope.expireAmount = $scope.expiring
                                    .reduce(function(sum, entry){
                                        return sum+= Number(entry.qty) * Number(entry.price)
                                    }, 0 )

        if($scope.expiring.length){
          var item = $scope.expiring.length === 1 ? " item" : " items";
          Materialize.toast("You have " + $scope.expiring.length +
                            item + " worth $" +
                            $scope.expireAmount +
                            " expiring soon", 4000);
        }
      })
    };

    $scope.saveFridge = function() {
      var errorFlag = false;
      for (var i = 0; i<$scope.data.length; i++) {
        var iExp = $scope.data[i].expiration.toJSON().split("T")[0];
        for(var j = i+1; j<$scope.data.length; j++) {
          var jExp = $scope.data[j].expiration.toJSON().split("T")[0];
          if ($scope.data[i].ingredient_id === $scope.data[j].ingredient_id && iExp === jExp) {
            errorFlag = true;
          }
        }
      }
      if (!errorFlag) {
        Fridge.updateFridge($scope.data);
      } else {
        Materialize.toast("Entries for the same ingredient must have different expirations!", 4000);
      }
    };

    $scope.increaseQty = function(ingredient) {
      ingredient.qty = ingredient.qty + 0.25
      $scope.saveFridge();
    };

    $scope.decreaseQty = function(ingredient) {
      if (ingredient.qty > 0){
        ingredient.qty-=0.25;
        $scope.saveFridge();
      }

      if ($scope.data.every(function(entry){return entry.qty === 0})){
        $scope.data = [];
        $scope.expiring = [];
      }
    }
    $scope.getFridge();
}]);
