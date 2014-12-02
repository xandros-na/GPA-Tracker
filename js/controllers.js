var trackerAppControllers = angular.module('trackerAppControllers', []);


trackerAppControllers.controller("SignInFormCtrl", ["$scope", "$location", function ($scope, $location) {
    $scope.title = "Sign In";
    $scope.submitButton = "Sign In";
    $scope.switch = "I don't have an account yet.";

    $scope.submitForm = function (user) {
        if (!($scope.switch === "Sign In")) {
            //check with server and download profile
            $.ajax({
                url: 'http://cp317api.pythonanywhere.com/api/download',
                type: 'GET',
                dataType: 'json',
                beforeSend: function (xhr) {
                    var username_or_token;
                    if (_is_undefined(localStorage['token'])) {
                        username_or_token = user.name;
                    } else {
                        username_or_token = JSON.parse(localStorage['token']);
                        //console.log(username_or_token, typeof(username_or_token));
                    }
                    xhr.setRequestHeader("Authorization", "Basic" + " " + btoa(username_or_token + ":" + user.password));
                },
                success: function (data) {
                    console.log(JSON.stringify(data));
                    if (data['gpa_user'] != 'null') {
                        localStorage['gpa_user'] = JSON.stringify(data['gpa_user']);
                    } else {
                        localStorage['gpa_user'] = JSON.stringify({});
                    }
                    $scope.$apply(function () {
                        $location.path('term');
                    });
                }
            });
        }
        else {
            //check with server and create profile
            var creds = JSON.stringify({'username': user.name, 'password': user.password, 'data': {'gpa_user': 'null'}});
            $.ajax({
                url: 'http://cp317api.pythonanywhere.com/api/register',
                data: creds,
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function (data) {
                    localStorage['token'] = JSON.stringify(data['token']);
                }
            });
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

trackerAppControllers.controller("TermCtrl", ["$scope", "$modal", "$location", function ($scope, $modal, $location) {
    //get term list from DB

    $scope.terms = get_terms(); //[2014, 2015]
	$scope.ti = JSON.parse(localStorage['gpa_user']);

	$scope.open=function(){ //adding a term
		var modalInstance = $modal.open({
            templateUrl: 'addTerm.html',
            controller: 'addTermCtrl',
            size: "sm",
        });
		modalInstance.result.then(function (termInfo) {
		  $scope.termInfo = termInfo;
		  $scope.updateTerm();
		});
	};

	$scope.updateTerm = function() {
		add_term($scope.termInfo.name, $scope.termInfo.goal);
		$scope.terms = get_terms(); //[2014, 2015]
		$scope.ti = JSON.parse(localStorage['gpa_user']);
	};

	$scope.updateGoal=function(term,goalChanger){
		console.log(term, goalChanger);
		edit_term_goal(term, goalChanger);
	    $scope.terms = get_terms(); //[2014, 2015]
		$scope.ti = JSON.parse(localStorage['gpa_user']);
	};

	$scope.logoutUser = function() {
		delete localStorage['gpa_user'];
		delete localStorage['token'];
		$location.path('login');
	};
}]);

trackerAppControllers.controller('addTermCtrl', function ($scope, $modalInstance, $routeParams) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        $modalInstance.close($scope.term);
    };
});


trackerAppControllers.controller("CourseCtrl", ["$scope", "$routeParams", "$location" ,"$modal",  function ($scope ,$routeParams, $location , $modal) {
	//get termName
    $scope.term = $routeParams.termName;
    //get course list from DB
    $scope.courses = get_courses($scope.term);
	$scope.ci = JSON.parse(localStorage['gpa_user'])[$scope.term];
	$scope.open=function(){ //adding a term
		var modalInstance = $modal.open({
            templateUrl: 'addCourse.html',
            controller: 'addCourseCtrl',
            size: "sm",
        });
		modalInstance.result.then(function (courseInfo) {
		  $scope.courseInfo = courseInfo;
		  $scope.updateCourse();
		});
	};

	$scope.updateCourse = function() {
		add_course($scope.term, $scope.courseInfo.name, $scope.courseInfo.goal);
		$scope.courses = get_courses($scope.term);
		$scope.ci = JSON.parse(localStorage['gpa_user'])[$scope.term];
	};

	$scope.updateGoal=function(course,goalChanger){
		edit_course($scope.term, course, goalChanger);
	    $scope.courses = get_courses($scope.term);
		$scope.ci = JSON.parse(localStorage['gpa_user'])[$scope.term];
	};

	$scope.relocate = function() {
        $location.path('term');
	};

	$scope.deleteTerm = function(){
		delete_term($scope.term);
		$scope.relocate();
	};

}]);

trackerAppControllers.controller('addCourseCtrl', function ($scope, $modalInstance, $routeParams) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        $modalInstance.close($scope.course);
    };
});

trackerAppControllers.controller("AssessmentsCtrl", ["$scope", "$modal", "$routeParams", function ($scope, $modal, $routeParams) {
    add_assessment($routeParams.termName, $routeParams.courseName, "quizzes", "10");

    $scope.oneAtATime = true;
    console.log($routeParams);
    var getAssess = get_assessments($routeParams.termName, $routeParams.courseName);
    var assessment = [];
    for (var i in getAssess) {
        var a = {};
        a['name'] = getAssess[i]; // ->> {'name': as[i]}
        assessment.push(a); // ->> [ {'name': as[i]} ]
    }
    $scope.assessments = assessment; //-->> [ {'name': 'miderm'}, {'name': 'quizzes'} ]
    $scope.orderProp = 'name';

    $scope.showMarks = function (as_name) {
        var x = get_marks($routeParams.termName, $routeParams.courseName, as_name);
        $scope.items = x;
        return x;
    };

    $scope.open = function (size, as_name) {
        $scope.as_name = as_name;
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            //scope: $scope.as_name,
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                },
                asName: function () {
                    return $scope.as_name;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

trackerAppControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, asName, $routeParams) {

    $scope.items = items;
    console.log(asName);
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
        var mark = parseFloat($scope.assessmentText);
        var m = add_mark($routeParams.termName, $routeParams.courseName, asName, mark);
        b = mark;
        $scope.items.push(b);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});