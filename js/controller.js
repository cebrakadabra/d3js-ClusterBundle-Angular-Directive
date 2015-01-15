d3app.controller('MainController', ['$scope', '$http', 'InputDataService', function($scope, $http, InputDataService){

	$scope.groups = InputDataService.input.groups;
	$scope.items = InputDataService.input.items;
	$scope.links = InputDataService.input.links;

}]);