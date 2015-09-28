angular.module('wtf', [
  'ngRoute',
  // 'ui.router',
  // 'wtf.about',
  // 'wtf.auth',
  // 'wtf.background',
  'wtf.create-recipes',
  'wtf.dashboard',
  // 'wtf.edit-recipes',
  // 'wtf.index',
  'wtf.fridge',
  'wtf.services',
  'wtf.nav-controller'
  // 'wtf.shopping-list'
  ]
)

.config(function($routeProvider, $httpProvider) {
  $routeProvider
    // .when('/', {
    //   templateUrl: 'index.html',
    //   controller: 'NavController'
    // })
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
    .when('/edit-recipes', {
      templateUrl: 'app/edit-recipes/edit-recipes.html',
      controller: 'EditRecipesController'
    })
    .when('/shopping-list', {
      templateUrl: 'app/shopping-list/shopping-list.html',
      controller: 'ShoppingListController'
    })
    .when('/fridge', {
      templateUrl: 'app/fridge/fridge.html',
      controller: 'FridgeController'
    })
    .otherwise('/');

  // Check for 401 (unauthorized) responses

  $httpProvider.interceptors.push(function($q, $location) { 
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
  }); 
});

