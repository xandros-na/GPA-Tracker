
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
	  when('/term', {
        templateUrl: 'html/term.html',
		controller: 'TermCtrl'
      }).
	  when('/courseList/:termName', {
        templateUrl: 'html/course.html',
		controller: 'CourseCtrl'
      }).
	  when('/course/:courseName', {
		templateUrl: 'html/courseDetail.html',
    	controller: 'AssessmentCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);