var trackerAppControllers = angular.module('trackerAppControllers', []);


trackerAppControllers.controller("SignInFormCtrl", ["$scope", function ($scope) {
    $scope.title = "Sign In";
    $scope.submitButton = "Sign In";
    $scope.switch = "I don't have an account yet.";

    $scope.submitForm = function () {
        var creds = JSON.stringify({'username': $scope.username, 'password': $scope.password});
//        $.ajax({
//            url: 'http://cp317api.pythonanywhere.com/api/register',
//            data: creds,
//            type: 'POST',
//            contentType: 'application/json',
//            dataType: 'json',
//            success: function (data) {
//                localStorage['token'] = JSON.stringify(data);
//            }
//        });
        $.ajax({
            url: 'http://cp317api.pythonanywhere.com/api/login',
            type: 'POST',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic" + " " + btoa($scope.username + ":" + $scope.password));
            },
            success: function (data) {
                console.log(data);
            }
        });
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