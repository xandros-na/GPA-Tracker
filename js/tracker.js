var trackerApp = angular.module('tracker', [
    'ui.bootstrap',
    'ngRoute',
    'trackerAppControllers'
]);

trackerApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/assessments', {
                templateUrl: 'html/assessment.html',
		controller: 'AccordionDemoCtrl'
//                controller: 'CourseCtrl'
//        controller: 'SignInFormCtrl'
            }).
            otherwise({
                redirectTo: '/assessments'
            });
    }]);