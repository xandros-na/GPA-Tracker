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

trackerApp.run(function ($rootScope, $location) { //Insert in the function definition the dependencies you need.
    //Do your $on in here, like this:
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        var to = (next.substring($location.absUrl().length - $location.url().length));
        var from = (current.substring($location.absUrl().length - $location.url().length));

        if ((to != '/login' && from == '/login') && typeof localStorage['token'] == 'undefined') {
            window.history.go(-2);
            console.log(window.history);
            event.preventDefault();

        } else {

        }
    });
});