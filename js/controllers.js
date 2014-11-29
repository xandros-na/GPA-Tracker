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

//$scope.object=
//$scope.keys= keys()
//
//repeat k in keys
//    <a>}{{k}} + : + {{object[k]}}

trackerAppControllers.controller("TermCtrl", ["$scope", function ($scope) {
    //get term list from DB

    $scope.terms = get_terms();
    $scope.addTerm=function(){
        var tempo = $scope.new_term;
        $scope.terms.push(tempo);
        add_term(tempo);
        console.log(JSON.parse(localStorage['gpa_user']));
    };

    $scope.deleteTerm=function(term){
        var index=$scope.terms.indexOf(term);
        $scope.terms.splice(index,1);
        delete_term(term);
    };

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
