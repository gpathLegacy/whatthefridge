angular.module('wtf', [
  'ngRoute',
  'ui.router',
  'wtf.about',
  'wtf.auth',
  'wtf.background',
  'wtf.create-recipes',
  'wtf.dashboard',
  'wtf.edit-recipes',
  'wtf.index',
  'wtf.services',
  'wtf.shopping-list'
  ]
)

.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/about', {
      templateUrl: 'app/about/about.html'
    })
    .when('/', {
      templateUrl: 'app/auth/landing.html',
      controller: 'BackgroundController'
    })
    .when('/login', {
      templateUrl: 'app/auth/login.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/logout', {
      templateUrl: 'app/auth/landing.html',
      controller: 'AuthController',
      resolve: { function(Auth) {
        Auth.signout();
      }}
    })
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
    when('/shopping-list', {
      templateUrl: 'app/shopping-list/shopping-list.html',
      controller: 'ShoppingListController'
    })
    .otherwise('/')
});