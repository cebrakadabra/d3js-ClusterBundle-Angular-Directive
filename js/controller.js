d3app.controller('MainController', ['$scope', '$http', 'InputDataService', function($scope, $http, InputDataService){

	$scope.groups = InputDataService.input.groups;
	$scope.items = InputDataService.input.items;
	$scope.links = InputDataService.input.links;

	$scope.groupcolors = ["#ab003a", "#002d61", "#f08c00", "#0080c4", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"];

}]);