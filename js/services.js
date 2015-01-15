d3app.factory('InputDataService', ['$filter', '$http',  function($filter, $http){

	
	var input = {
		links: null,
		groups: null,
		items: null
	}
	$http.get('json/input_structure.json').success(function(data) {

		input.links = data.links;
		input.groups = data.groups;
		input.items = data.items;

	});

	

	return {
		input: input
	}
	
}]); // Ende von InputDataService
