
var trackerApp = angular.module('tracker', [
  'ngRoute',
  'trackerAppControllers'
]);

trackerApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/assessment', {
        templateUrl: 'html/assessment.html',
		controller: 'AssessmentsCtrl'
        //controller: 'SignInFormCtrl'
      }).
      otherwise({
        redirectTo: '/assessment'
      });
  }]);