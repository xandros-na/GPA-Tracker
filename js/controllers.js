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
    $scope.addTerm=function(term){
        $scope.terms.push(term);
        add_term(term);
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

    $scope.addCourse=function(course, goal){
        $scope.courses.push(course);
        add_course(term, course, goal);
        console.log(JSON.parse(localStorage['gpa_user']));
    };

    $scope.deleteCourse=function(course){
        var index=$scope.courses.indexOf(course);
        $scope.courses.splice(index,1);
        delete_course(term, course);
    };
}]);

trackerAppControllers.controller("AssessmentsCtrl", ["$scope", "$modal", function ($scope, $modal) {
    //var data = {'2014': {'cp': {'goal': 80, 'distance': 80, 'details': {'midterm': {'list': {'m1': 80, 'm2': 80}}, 'quizzes': {'list': {'q1': 80, 'q2': 70}}}}}};
    //localStorage['gpa_user'] = JSON.stringify(data);
    //$scope.assessments = [ {'name': 'zzz'}, {'name': 'aaa'} ]
    var getAssess = get_assessments('2014', 'cp');
    var assessment = [];
    for (var i in getAssess) {
        var a = {};
        a['name'] = getAssess[i]; // ->> {'name': as[i]}
        assessment.push(a); // ->> [ {'name': as[i]} ]
    }
    $scope.assessments = assessment; //-->> [ {'name': 'miderm'}, {'name': 'quizzes'} ]
    $scope.orderProp = 'name';



	var getMarks = get_marks('2014', 'cp', 'quizzes');
    var keys = Object.keys(getMarks);
    console.log(keys.length == getMarks.length);
    var mark = [];
    for (var j = 0; j< keys.length; j++) {
        var b = {};
        console.log(keys[j], getMarks[keys[j]]);
        b['name'] = keys[j]; //->> {'name': q1}
        b['mark'] = getMarks[keys[j]]; // ->> {'mark': as[i]}
        mark.push(b); // ->> [ {object} ]
    }
    $scope.items = mark; //-->> [ {'name': 'q1', 'mark': 11}]
    $scope.orderProp = 'name';
	  //$scope.items = ['item1', 'item2', 'item3'];
  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
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

trackerAppControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
	$modalInstance.close($scope.selected.item);
    var term = "2014";
	var course = "cp";
	var as = "quizzes";
	var mark = $scope.assessmentText;
	console.log(mark);
	add_mark(term,course,as,"q4",mark);
	var b = {};
	b['name'] = "q44"; //->> {'name': q1}
    b['mark'] = mark;
	$scope.items.push(b);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
