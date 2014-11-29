angular.module('gpaTrackerApp', [])
  .controller('AppController', ['$scope', function($scope) {
    $scope.assessments = [
      {text:'learn angular'},
      {text:'build an angular app'}];
 
    $scope.addAssessment = function() {
      $scope.assessments.push({text:$scope.assessmentText});
      $scope.assessmentText = '';
    };
  
  }]);


