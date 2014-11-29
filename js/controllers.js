var trackerAppControllers = angular.module('trackerAppControllers', []);


trackerAppControllers.controller("SignInFormCtrl",["$scope", function($scope){
	$scope.title="Sign In";
	$scope.submitButton="Sign In";
	$scope.switch="I don't have an account yet.";

	$scope.submitForm = function(){
		alert("asdf");
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