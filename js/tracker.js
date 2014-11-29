
var trackerApp = angular.module('tracker', [
  'ngRoute',
  'trackerAppControllers'
]);

trackerApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'html/login.html',
        controller: 'SignInFormCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);