angular.module('wtf.dashboard', [])
  .controller('DashboardController', ["$scope", "$window", "$location", "Fridge", "SavedLists", "Recipes", function($scope, $window, $location, Fridge, SavedLists, Recipes){
   $scope.getAllRecipes = function() {
      Recipes.getRecipes()
      .success(function(data){
        $scope.allRecipes = data;

        $scope.mostExpensiveRecipe = data.reduce(function(most, test){
          if (test.price > most.price){
            return test
          }else{
            return most
          }
        })

        $scope.leastExpensiveRecipe = data.reduce(function(least, test){
          if(test.price < least.price){
            return test
          }else{
            return least
          }
        })

        if($scope.leastExpensiveRecipe.id === $scope.mostExpensiveRecipe.id){
          $scope.hide = true;
        }

        $scope.ingredientsUnique = data.map(function(entry){
          return  entry.ingredients
        })
        .reduce(function(itemsMaster, entry){
          return itemsMaster = itemsMaster.concat(entry);
        })
        .filter(function(item, i, arr){
          return arr.indexOf(item) === i
        }).length

      })
      .catch(function(err){
        console.log(err);
      })
    }

    $scope.getFridge = function() {
      Fridge.getFridge().then(function(fridge) {
        $scope.fridgeData = fridge.data;
        $scope.today = Date.now();
        $scope.todayInISO = new Date().toISOString().split('T')[0];
        $scope.twoFromToday = new Date($scope.today + 2*86400000);
        
        $scope.freshItems = fridge.data.filter(function(entry){
          if(entry.expiration && (entry.expiration.split('T')[0] >= $scope.todayInISO)){
            return entry;
          }
        })
       
        $scope.expired = fridge.data.filter(function(entry){
          if(entry.expiration && entry.expiration.split('T')[0] < $scope.todayInISO){
            return entry;
          };
        })

        $scope.expiringToday = fridge.data.filter(function(entry){
          if(entry.expiration && entry.expiration.split('T')[0] === $scope.todayInISO){
            return entry;
          }
        })

        $scope.expiring = $scope.freshItems.filter(function(entry){
          var entry_expires =  new Date(entry.expiration);
          if(entry_expires > $scope.today && entry_expires < $scope.twoFromToday){
            return entry;
          }
        });
        
        var valueCalculator = function(arr){
          return arr.reduce(function(sum, entry){
            return sum+=Number(entry.qty) * Number(entry.price)
          }, 0);
        }

        $scope.freshValue = valueCalculator($scope.freshItems);

        $scope.expiredValue = valueCalculator($scope.expired);

        $scope.expireAmount = valueCalculator($scope.expiring);

        $scope.highestQtyFridge = $scope.freshItems
          .filter(function(entry){
            return entry.qty > 2
          })

        $scope.lowestQtyFridge = $scope.freshItems
          .filter(function(entry){
            return entry.qty === "1.00"
        })
      })
    };

    $scope.getLists = function() {  
      SavedLists.getLists().then(function(lists) {
        $scope.lists = lists.data;
         $scope.listsCount = Object.keys($scope.lists).length
        console.log($scope.listsCount)
      });
    };

    $scope.getAllRecipes();
    $scope.getFridge();
    $scope.getLists();
  }]);
