var trackerAppControllers = angular.module('trackerAppControllers', []);

var logout_opened = false;
trackerAppControllers.controller("SignInFormCtrl", ["$scope", "$location", function ($scope, $location) {
    logout_opened = false;
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

                    localStorage['token'] = JSON.stringify(data['token']);
                    console.log(data['gpa_user']);
                    if (data['gpa_user'] != 'null') {
                        localStorage['gpa_user'] = JSON.stringify(data['gpa_user']);
                    } else {
                        console.log('here');
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
					alert("Registration successful!");
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


function openModal(result, templateUrl, controller, modal) {
    if (result.indexOf("exists") > -1) {
            var modalInstance = modal.open({
            templateUrl: templateUrl,
            controller: controller,
            size: "sm",
        });
    }
}

trackerAppControllers.controller("TermCtrl", ["$scope", "$modal", "$location", "$window", function ($scope, $modal, $location, $window) {
    //get term list from DB

    $scope.terms = get_terms(); //[2014, 2015]
    $scope.ti = JSON.parse(localStorage['gpa_user']);

    $scope.open = function () { //adding a term
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

    $scope.updateTerm = function () {
        var result = add_term($scope.termInfo.name, $scope.termInfo.goal); 
        $scope.terms = get_terms(); //[2014, 2015]
        $scope.ti = JSON.parse(localStorage['gpa_user']);
        openModal(result, "noTerm.html", "addTermCtrl", $modal);
    };

    $scope.updateGoal = function (term, goalChanger) {
        edit_term_goal(term, goalChanger);
        $scope.terms = get_terms(); //[2014, 2015]
        $scope.ti = JSON.parse(localStorage['gpa_user']);
    };

    $scope.logoutUser = function () {
		var username = JSON.parse(localStorage['token']);
        console.log(username);
        var stuff = JSON.parse(localStorage['gpa_user']);
        var d = JSON.stringify({'data': {'gpa_user': stuff}});

        $.ajax({
            url: 'http://cp317api.pythonanywhere.com/api/upload',
            type: 'POST',
            contentType: 'application/json',
            data: d,
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic" + " " + btoa(username + ":" + ""));
            },
            success: function (data) {
                console.log(data);
            }
        });
        delete localStorage['gpa_user'];
        delete localStorage['token'];
        $location.path('login');
    };

    $scope.logOut = function () { //adding a term
        var modalInstance = $modal.open({
            templateUrl: 'logOut.html',
            controller: 'logOutCtrl',
            size: "sm",
        });
        modalInstance.result.then(function (promise) {
            $scope.promise = promise;
            $scope.logoutUser();
        });
    };
    
    $scope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
        var to = (newUrl.substring($location.absUrl().length - $location.url().length));
        var from = (oldUrl.substring($location.absUrl().length - $location.url().length));  
        if (from == '/term' && to == '/login' && !logout_opened) {
           
            $scope.logOut();
            event.preventDefault();
            logout_opened = true;
        }
    });
}]);

trackerAppControllers.controller('logOutCtrl', function ($scope, $modalInstance, $routeParams) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.upload = function () {
        $modalInstance.close("yes");
    };
});

trackerAppControllers.controller('addTermCtrl', function ($scope, $modalInstance, $routeParams) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        $modalInstance.close($scope.term);
    };
});


trackerAppControllers.controller("CourseCtrl", ["$scope", "$routeParams", "$location" , "$modal", function ($scope, $routeParams, $location, $modal) {
    //get termName
    $scope.term = $routeParams.termName;
    //get course list from DB
    $scope.courses = get_courses($scope.term);
    if ($scope.courses == "no such term") {
        $location.path('/404/'+$scope.courses).replace();
    }
    $scope.ci = JSON.parse(localStorage['gpa_user'])[$scope.term];
    $scope.open = function () { //adding a term
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

    $scope.updateCourse = function () {
        var result = add_course($scope.term, $scope.courseInfo.name, $scope.courseInfo.goal);
        $scope.courses = get_courses($scope.term);
        $scope.ci = JSON.parse(localStorage['gpa_user'])[$scope.term];
        openModal(result, "noCourse.html", "addCourseCtrl", $modal)
    };

    $scope.updateGoal = function (course, goalChanger) {
        edit_course($scope.term, course, goalChanger);
        $scope.courses = get_courses($scope.term);
        $scope.ci = JSON.parse(localStorage['gpa_user'])[$scope.term];
    };

    $scope.relocate = function () {
        $location.path('term');
    };

    $scope.deleteTerm = function () {
        delete_term($scope.term);
        $scope.relocate();
    };

    $scope.confirmDelete = function () { //adding a term
        var modalInstance = $modal.open({
            templateUrl: 'confirmDeleteTerm.html',
            controller: 'confirmDeleteTermCtrl',
            size: "sm",
        });
        modalInstance.result.then(function (promise) {
            if (promise == "yes") {
                $scope.deleteTerm();
            }
        });
    };
}]);

trackerAppControllers.controller('confirmDeleteTermCtrl', function ($scope, $modalInstance, $routeParams) {
    $scope.no = function () {
        $modalInstance.dismiss('no');
    };

    $scope.yes = function () {
        $modalInstance.close("yes");
    };
});

trackerAppControllers.controller('addCourseCtrl', function ($scope, $modalInstance, $routeParams) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        $modalInstance.close($scope.course);
    };
});


trackerAppControllers.controller("AssessmentsCtrl", ["$scope", "$modal", "$routeParams", "$location", function ($scope, $modal, $routeParams, $location) {
    $scope.oneAtATime = true;
    //$scope.assessments = [ {'name': 'zzz'}, {'name': 'aaa'} ]
    $scope.term = $routeParams.termName;
    $scope.course = $routeParams.courseName;

    $scope.assessments = Object.keys(get_assessments($scope.term, $scope.course)); // {'midterm : ..., 'quizzes: ...}
    var x = JSON.parse(localStorage['gpa_user']);
    $scope.ai = x[$scope.term]['courses'][$scope.course]['details'];

    $scope.showMarks = function (assessment) {
        return get_marks($scope.term, $scope.course, assessment);
    };

    $scope.relocate = function () {
        $location.path("courseList/" + $scope.term);
    };

    $scope.deleteCourse = function () {
        delete_course($scope.term, $scope.course);
        $scope.relocate();
    };

    $scope.addNewType = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'newAssessment.html',
            controller: 'newAssessmentCtrl',
            size: size,
        });

        modalInstance.result.then(function (newAssessment) {
            $scope.newAssessment = newAssessment;
            $scope.updateAssessment();
        });
    };

    $scope.updateAssessment = function () {

        var result = add_assessment($scope.term, $scope.course, $scope.newAssessment.name, $scope.newAssessment.weight);
        $scope.assessments = Object.keys(get_assessments($scope.term, $scope.course));
        var x = JSON.parse(localStorage['gpa_user']);
        $scope.ai = x[$scope.term]['courses'][$scope.course]['details'];
        openModal(result, "noAssessment.html", "newAssessmentCtrl", $modal);
    };

    $scope.addMark = function (size, assessment) {

        var modalInstance = $modal.open({
            templateUrl: 'addMark.html',
            controller: 'addMarkCtrl',
            size: size,
        });

        modalInstance.result.then(function (newMark) {
            $scope.newMark = newMark;
            $scope.updateMark(assessment);
        });
    };

    $scope.updateMark = function (assessment) {
        add_mark($scope.term, $scope.course, assessment, $scope.newMark);
        $scope.assessments = Object.keys(get_assessments($scope.term, $scope.course));
        var x = JSON.parse(localStorage['gpa_user']);
        $scope.ai = x[$scope.term]['courses'][$scope.course]['details'];
    };


    $scope.editMark = function (size, assessment, iMark) {

        var modalInstance = $modal.open({
            templateUrl: 'editMark.html',
            controller: 'editMarkCtrl',
            size: size
        });

        modalInstance.result.then(function (edit) {
            //$scope.newMark=newMark;
            if (edit == 'remove') {
                delete_mark($scope.term, $scope.course, assessment, iMark);
                $scope.assessments = Object.keys(get_assessments($scope.term, $scope.course));
                var x = JSON.parse(localStorage['gpa_user']);
                $scope.ai = x[$scope.term]['courses'][$scope.course]['details'];
            }
            else {
                $scope.markEdited = edit;
                $scope.updateEditMark(assessment, iMark);
            }
        });
    };

    $scope.updateEditMark = function (assessment, iMark) {
        edit_mark($scope.term, $scope.course, assessment, iMark, $scope.markEdited);
        $scope.assessments = Object.keys(get_assessments($scope.term, $scope.course));
        var x = JSON.parse(localStorage['gpa_user']);
        $scope.ai = x[$scope.term]['courses'][$scope.course]['details'];
    };

    $scope.confirmDelete = function () {

        var modalInstance = $modal.open({
            templateUrl: 'deleteCourse.html',
            controller: 'deleteCourseCtrl',
            size: "sm",
        });

        modalInstance.result.then(function (promise) {
            if (promise == "yes") {
                $scope.deleteCourse();
            }
        });
    };

}]);

trackerAppControllers.controller('deleteCourseCtrl', function ($scope, $modalInstance, $routeParams) {
    $scope.yes = function () {
        $modalInstance.close("yes");
    };

    $scope.no = function () {
        $modalInstance.dismiss("no");
    };

});

trackerAppControllers.controller('editMarkCtrl', function ($scope, $modalInstance, $routeParams) {

    $scope.edit = function () {
        //console.log($scope.editTheMark);
        $modalInstance.close($scope.editTheMark);
    };

    $scope.remove = function () {
        $modalInstance.close('remove');

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

trackerAppControllers.controller('addMarkCtrl', function ($scope, $modalInstance, $routeParams) {

    $scope.add = function () {
        $modalInstance.close($scope.newMark);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


trackerAppControllers.controller('addMarkCtrl', function ($scope, $modalInstance, $routeParams) {

    $scope.add = function () {
        $modalInstance.close($scope.newMark);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

trackerAppControllers.controller('newAssessmentCtrl', function ($scope, $modalInstance, $routeParams) {

    $scope.add = function () {
        $modalInstance.close($scope.newAssess);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


trackerAppControllers.controller('404Ctrl', function ($scope, $location) {
    $scope.items = $location.url().substring(5, $location.url().length).replace(/%20/gi, ' ');
    
});
