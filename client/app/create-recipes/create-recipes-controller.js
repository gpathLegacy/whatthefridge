angular.module('wtf.create-recipes', [])
  .controller('CreateRecipesController', function($scope, $window, $http, $location) {

    $scope.recipe = {ingredients: []};

    $scope.addIngredient = function() {
        $scope.recipe.ingredients.push($scope.newIngredient);
        $scope.newIngredient = "";
    };

    $scope.saveRecipe = function() {

        // Put this into the factory
        $http.post('/api/recipes/createRecipe', $scope.recipe)
          .then(function(res) {
            $location.path("/dashboard");
          })
    };

    // $scope.$watch(Auth.isAuth, function(authed) {
    //   if (authed) {
    //     $location.path('/create-recipes');
    //   } else {
    //     $location.path('/');
    //   }
    // }, true);

    // $scope.submit = function(ingredient) {
    //   Recipe.createRecipe(recipe).then(function(data, err) {
    //     if (err) console.log(err);
    //     $scope.getData();
    //     $scope.recipe = {};
    //   });
    });