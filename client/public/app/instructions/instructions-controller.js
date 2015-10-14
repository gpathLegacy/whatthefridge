angular.module('wtf.instructions', [])
  .controller('InstructionsController', ["$scope", "$window", "$location", "Recipes", function($scope, $window, $location, Recipes) {
    $scope.getInstructions = function() {
      console.log(Recipes.idForInstructions)
      Recipes.getInstructions({"id":Recipes.idForInstructions})
        .then(function(res){
          $scope.title = res.data[0].title;
          $scope.instructions = res.data[0].instructions;
          $scope.ingredients = [];

          for(var i = 0; i < res.data.length; i++){
            $scope.ingredients.push(res.data[i].name);
          }

        })
    };
    $scope.getInstructions();

  }]);
