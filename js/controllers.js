var trackerAppControllers = angular.module('trackerAppControllers', []);


trackerAppControllers.controller("SignInFormCtrl", ["$scope", function ($scope) {
    $scope.title = "Sign In";
    $scope.submitButton = "Sign In";
    $scope.switch = "I don't have an account yet.";

    $scope.submitForm = function (user) {
        if (!($scope.switch === "Sign In")) {
            //check with server and download profile
        }
        else {
            //check with server and create profile
        }

    };

    $scope.contentSwitch = function () {
        if (!($scope.switch === "Sign In")) {
            $scope.title = "Sign Up";
            $scope.submitButton = "Register";
            $scope.switch = "Sign In";
        }
        else {
            $scope.title = "Sign In";
            $scope.submitButton = "Sign In";
            $scope.switch = "I don't have an account yet.";
        }
    };
}]);

trackerAppControllers.controller("TermCtrl", ["$scope", function ($scope) {
    //get term list from DB
    var data = {'2014':
                    {'cp':
                        {'goal': 100, 'distance': 100, 'details':
                            {'quizzes':
                                {'weight': 10, 'overall': 10, 'list':
                                    {'q1': 5, 'q2': 5}
                                }
                            }
                        },
                    'ma222': null
                    },

                '2015':
                    {'ma': null},
                '2016': null};
    localStorage['gpa_user'] = JSON.stringify(data);
    $scope.terms = get_terms();
}]);

trackerAppControllers.controller("CourseCtrl", ["$scope", "$routeParams", function ($scope, $routeParams) {
    //get termName
    var term = $routeParams.termName;
    //get course list from DB
    $scope.courses = get_courses(term);
}]);

trackerAppControllers.controller("AssessmentCtrl", ["$scope", "$routeParams", function ($scope, $routeParams) {
    //get courseName
    console.log($routeParams.courseName);
    //get course list from DB
    $scope.assessment = [];
}]);
