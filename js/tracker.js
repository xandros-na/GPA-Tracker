var trackerApp = angular.module('tracker', [
    'ui.bootstrap',
    'ngRoute',
    'trackerAppControllers'
]);
var opened = false;  
trackerApp.config(['$routeProvider',
    function ($routeProvider) {
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
            when('/course/:termName/:courseName', {
                templateUrl: 'html/assessment.html',
                controller: 'AssessmentsCtrl'
            }).
            when('/assessments', {
                templateUrl: 'html/assessment.html',
                controller: 'AssessmentsCtrl'
            }).
            when('/', {
                redirectTo: '/login'
            }).
            otherwise({
               //controller: '404Ctrl',
               templateUrl: 'html/404.html'
            });

    }]);