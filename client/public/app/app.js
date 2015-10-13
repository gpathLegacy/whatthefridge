angular.module('wtf', [
  'ngRoute',
  // 'ui.router',
  // 'wtf.about',
  // 'wtf.auth',
  // 'wtf.background',
  'wtf.create-recipes',
  'wtf.recipes',
  'wtf.dashboard',
  'wtf.edit-recipes',
  'wtf.instructions',
  // 'wtf.index',
  'wtf.services',
  'wtf.create-shopping-list',
  'wtf.shopping-list',
  'wtf.fridge',
  'wtf.services',
  'wtf.nav-controller',
  'wtf.saved-lists'
  ]
)

.config(["$routeProvider", "$httpProvider", function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/auth/landing.html',
    //   controller: 'NavController'
    })
    .when('/about', {
      templateUrl: 'app/about/about.html'
    })
    // .when('/login', {
    //   templateUrl: 'app/auth/login.html',
    //   controller: 'AuthController'
    // })
    // .when('/signup', {
    //   templateUrl: 'app/auth/signup.html',
    //   controller: 'AuthController'
    // })
    // .when('/logout', {
    //   templateUrl: 'app/auth/landing.html',
    //   controller: 'AuthController',
    //   resolve: { function(Auth) {
    //     Auth.signout();
    //   }
    //   }
    // })
    .when('/create-recipes', {
      templateUrl: 'app/create-recipes/create-recipes.html',
      controller: 'CreateRecipesController'
    })
    .when('/dashboard', {
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardController'
    })
    .when('/recipes', {
      templateUrl: 'app/recipes/recipes.html',
      controller: 'RecipesController'
    })
    .when('/edit-recipes', {
      templateUrl: 'app/edit-recipes/edit-recipes.html',
      controller: 'EditRecipesController'
    })
    .when('/create-list', {
      templateUrl: 'app/create-shopping-list/create-shopping-list.html',
      controller: 'CreateShoppingListController'
    })
    .when('/shopping-list', {
      templateUrl: 'app/shopping-list/shopping-list.html',
      controller: 'ShoppingListController'
    })
    .when('/saved-lists', {
      templateUrl: 'app/saved-lists/saved-lists.html',
      controller: 'SavedListsController'
    })
    .when('/fridge', {
      templateUrl: 'app/fridge/fridge.html',
      controller: 'FridgeController'
    })
    .when('/instructions', {
      templateUril: 'app/instructions/instructions.html',
      controller: 'InstructionsController'
    })
    .otherwise('/');

  // Check for 401 (unauthorized) responses

  $httpProvider.interceptors.push(["$q", "$location", function($q, $location) {
    return {
      response: function(response) {
      // do something on success
      return response;
      },

      responseError: function(response) {
        if (response.status === 401) $location.url('/');
        return $q.reject(response);
      }
    };
  }]);
}]);

