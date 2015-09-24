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

    // $scope.submit = function(ingredient) {
    //   Recipe.createRecipe(recipe).then(function(data, err) {
    //     if (err) console.log(err);
    //     $scope.getData();
    //     $scope.recipe = {};
    //   });
    // };