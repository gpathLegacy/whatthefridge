angular.module('wtf.create-recipes', [])
  .controller('CreateRecipesController', function($scope, $window, Auth, Recipe) {

    $scope.recipe = {};

    $scope.$watch(Auth.isAuth, function(authed) {
      if (authed) {
        $location.path('/create-recipes');
      } else {
        $location.path('/');
      }
    }, true);

    $scope.root = 

    $scope.submit = function(ingredient) {
      Recipe.createRecipe(recipe).then(function(data, err) {
        if (err) console.log(err);
        $scope.getData();
        $scope.recipe = {};
      });
    };

    $scope.getData = function() {
      Auth.getAllData()
        .then(function(data) {
          $scope.recipe = data.slice(1);
        })
        .catch(function(error){
          console.err(error)
        });
    };
    $scope.getData();
  })