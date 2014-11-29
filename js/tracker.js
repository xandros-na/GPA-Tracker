var trackerApp = angular.module('tracker', [
    'ui.bootstrap',
    'ngRoute',
    'trackerAppControllers'
]);

trackerApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/course', {
                templateUrl: 'html/course.html',
//		controller: 'AssessmentsCtrl'
                controller: 'CourseCtrl'
//        controller: 'SignInFormCtrl'
            }).
            otherwise({
                redirectTo: '/course'
            });
    }]);