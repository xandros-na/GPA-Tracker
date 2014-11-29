var trackerAppControllers = angular.module('trackerAppControllers', []);


trackerAppControllers.controller("SignInFormCtrl",["$scope", function($scope){
	$scope.title="Sign In";
	$scope.submitButton="Sign In";
	$scope.switch="I don't have an account yet.";

	$scope.submitForm = function(user){
		if(!($scope.switch==="Sign In")){
			//check with server and download profile
		}
		else{
			//check with server and create profile
		}

	};
	
	$scope.contentSwitch=function(){
		if(!($scope.switch==="Sign In")){
			$scope.title="Sign Up";
			$scope.submitButton="Register";
			$scope.switch="Sign In";
		}
		else{
			$scope.title="Sign In";
			$scope.submitButton="Sign In";
			$scope.switch="I don't have an account yet.";
		}
	};
}]);

trackerAppControllers.controller("TermCtrl",["$scope", function($scope){
	//get term list from DB
	$scope.terms=[{'name': 'd2014'}, {'name': 'b2003'},{'name': 'a2003'},{'name': 'c2003'}];
}]);

trackerAppControllers.controller("CourseCtrl",["$scope", "$routeParams", function($scope, $routeParams){
	//get termName
	console.log($routeParams.termName);
	//get course list from DB
	$scope.courses=[{'name': 'ma205'}, {'name': 'cp114'},{'name': 'cp217'},{'name': 'ma218'}];
	
}]);

trackerAppControllers.controller("AssessmentCtrl",["$scope", "$routeParams", function($scope, $routeParams){
	//get courseName
	console.log($routeParams.courseName);
	//get course list from DB
	$scope.assessment=[];
}]);
