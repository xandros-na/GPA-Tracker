var trackerAppControllers = angular.module('trackerAppControllers', []);


trackerAppControllers.controller("SignInFormCtrl", ["$scope", "$location", function ($scope, $location) {
    $scope.title = "Sign In";
    $scope.submitButton = "Sign In";
    $scope.switch = "I don't have an account yet.";

    $scope.submitForm = function (user) {
        if (!($scope.switch === "Sign In")) {
            //check with server and download profile
            $.ajax({
            url: 'http://cp317api.pythonanywhere.com/api/login',
            type: 'POST',
//            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic" + " " + btoa(user.name + ":" + user.password));
            },
            success: function (data) {
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
            var creds = JSON.stringify({'username': user.name, 'password': user.password, 'data':{'gpa_user': 'null'}});
            $.ajax({
                url: 'http://cp317api.pythonanywhere.com/api/register',
                data: creds,
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function (data) {
                    localStorage['token'] = JSON.stringify(data);
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
    $scope.term = $routeParams.termName;
    //get course list from DB
    $scope.courses = get_courses($scope.term);


    $scope.addCourse=function(course, goal){
        $scope.courses.push(course);
        add_course($scope.term, course, goal);
        console.log(JSON.parse(localStorage['gpa_user']));
    };

    $scope.deleteCourse=function(course){
        var index=$scope.courses.indexOf(course);
        $scope.courses.splice(index,1);
        delete_course($scope.term, course);
    };
}]);

trackerAppControllers.controller("AssessmentsCtrl", ["$scope", "$modal", "$routeParams",function ($scope, $modal,$routeParams) {
	 $scope.oneAtATime = true;
   // var data = {'2014':
					// {'cp' :
						// {'goal': 10,
						// 'distance': 10,
						// 'details':
							// {'midterm':
								// {'weight': 20,
								// 'overall': 20,
								// 'list': [10,20]
								// },
							// 'quizzes':
								// {'weight': 40,
								// 'overall': 40,
								// 'list': [15,88]
								// }
							// }
						// }
					// }
				// };
    // localStorage['gpa_user'] = JSON.stringify(data);
    //$scope.assessments = [ {'name': 'zzz'}, {'name': 'aaa'} ]
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


		//var getMarks = get_marks($routeParams.termName, $routeParams.courseName, "quizzes");
		//var mark = [];
		//for (var j = 0; j< getMarks.length; j++) {
		//	var b = {};
		//	b['name'] = 'sdf'; //->> {'name': q1}
		//	b['mark'] = getMarks[j]; // ->> {'mark': as[i]}
		//	mark.push(b); // ->> [ {object} ]
		//}
		//$scope.items = mark; //-->> [ {'name': 'q1', 'mark': 11}]
		//$scope.orderProp = 'name';
		  //$scope.items = ['item1', 'item2', 'item3'];
	//$scope.items = ['ghfhg'];
	$scope.showMarks = function(as_name) {
        var x = get_marks($routeParams.termName, $routeParams.courseName, as_name);
        $scope.items = x;
        return x;
    };
	//indicates whether the assessment is open for arrow direction
	$scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };

  $scope.open = function (size, as_name) {
	$scope.as_name=as_name;
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
	  //scope: $scope.as_name,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        },
		asName: function(){
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
//"$routeParams",function ($scope, $modal,$routeParams)
trackerAppControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, asName, $routeParams) {

  $scope.items = items;
  console.log(asName);
  $scope.selected = {
  item: $scope.items[0]
  };

  $scope.ok = function () {
	$modalInstance.close($scope.selected.item);
	var mark = parseFloat($scope.assessmentText);
	var m=add_mark($routeParams.termName,$routeParams.courseName,asName,mark);
	//var b = {};
	//b['name'] = $scope.items.length+1; //->> {'name': q1}
    //b['mark'] = mark;
	b=mark;
	$scope.items.push(b);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

