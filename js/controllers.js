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

trackerAppControllers.controller("TermCtrl", ["$scope", function ($scope) {
    $scope.terms = [
        {'name': 'd2014'},
        {'name': 'b2003'},
        {'name': 'a2003'},
        {'name': 'c2003'}
    ];

}]);

trackerAppControllers.controller("CourseCtrl", ["$scope", function ($scope) {
    $scope.courses = [
        {'name': 'ma205'},
        {'name': 'cp114'},
        {'name': 'cp217'},
        {'name': 'ma218'}
    ];

}]);

trackerAppControllers.controller("AssessmentsCtrl", ["$scope", function ($scope) {
    var data = {'2014': {'cp': {'goal': 80, 'distance': 80, 'details': {'midterm': null, 'quizzes': null}}}};
    localStorage['gpa_user'] = JSON.stringify(data);
    //$scope.assessments = [ {'name': 'zzz'}, {'name': 'aaa'} ]
    var as = get_assessments('2014', 'cp');
    var a = [];
    for (var i in as) {
        var b = {};
        b['name'] = as[i]; // ->> {'name': as[i]}
        a.push(b); // ->> [ {'name': as[i]} ]
    }
    $scope.assessments = a; //-->> [ {'name': 'zzz'}, {'name': 'aaa'} ]
    $scope.orderProp = 'name';

}]);

trackerAppControllers.controller("MarksCtrl", ["$scope", function ($scope) {
    var data = {'2014': {'cp': {'goal': 80, 'distance': 80, 'details': {'midterm': {'list': {'m1': 80, 'm2': 80}}, 'quizzes': {'list': {'q1': 80, 'q2': 70}}}}}};
    localStorage['gpa_user'] = JSON.stringify(data);
    //$scope.assessments = [ {'name': 'zzz'}, {'name': 'aaa'} ]
    var as = get_marks('2014', 'cp', 'quizzes');
    var keys = Object.keys(as);
    console.log(keys.length == as.length);
    var a = [];
    for (var i = 0; i < keys.length; i++) {
        var b = {};
        console.log(keys[i], as[keys[i]]);
        b['name'] = keys[i];
        b['mark'] = as[keys[i]]; // ->> {'name': as[i]}
        a.push(b); // ->> [ {'name': as[i]} ]
    }
    $scope.marks = a; //-->> [ {'name': 'zzz'}, {'name': 'aaa'} ]
    $scope.orderProp = 'name';

}]);

trackerAppControllers.controller('AccordionDemoCtrl', function ($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
});