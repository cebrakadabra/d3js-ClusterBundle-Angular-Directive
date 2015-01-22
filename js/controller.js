d3app.controller('MainController', ['$scope', '$http', '$timeout', 'InputDataService', function($scope, $http, $timeout, InputDataService){

	$scope.groups = InputDataService.input.groups;
	$scope.items = InputDataService.input.items;
	$scope.links = InputDataService.input.links;

	$scope.groupColors = ["#ab003a", "#002d61", "#f08c00", "#0080c4", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"];

	$scope.config = {
		id: null,
		groups: $scope.groups,
		items: $scope.items,
		links: $scope.links,
		groupColors: $scope.groupColors,
		autosize: false,
		width: 1280,
		height: 800,
        events: {
            dragMove: function dragMove(d) {
                
            },
            onClick: function onClick(d){
                // binded an item
                alert(d.label +" was clicked");
            },
            onMouseOver: function onMouseOver(d){
                var clusterid = null;
                if($scope.id != null || $scope.id == ""){
                    sankeyidentifier = $scope.id;
                } else{
                    clusterid = "clusterid";
                }
                var svg = d3.select("#"+clusterid+" svg");

                function updateNodes(name, value) {
				  return function(d) {
				    if (value) this.parentNode.appendChild(this);
				    svg.select("#node-" + d[name].key).classed(name, value);
				  };
				}

                svg.selectAll("path.link.target-" + d.key)
			      .classed("target", true)
			      .each(updateNodes("source", true));

			  	svg.selectAll("path.link.source-" + d.key)
			      .classed("source", true)
			      .each(updateNodes("target", true));
            }
        }

	}

	$timeout(function(){
		$scope.config = {
			id: null,
			groups: $scope.groups,
			items: $scope.items,
			links: $scope.linksupdate,
			groupColors: $scope.groupColors,
			autosize: false,
			width: 1280,
			height: 800,
	        events: {
	            dragMove: function dragMove(d) {
	                
	            },
	            onClick: function onClick(d){
	                 // binded an item
                	alert(d.label +" was clicked");
	            },
	            onMouseOver: function onMouseOver(d){

	            	var clusterid = null;
	                if($scope.id != null || $scope.id == ""){
	                    sankeyidentifier = $scope.id;
	                } else{
	                    clusterid = "clusterid";
	                }
	                var svg = d3.select("#"+clusterid+" svg");

	                function updateNodes(name, value) {
					  return function(d) {
					    if (value) this.parentNode.appendChild(this);
					    svg.select("#node-" + d[name].key).classed(name, value);
					  };
					}

	                svg.selectAll("path.link.target-" + d.key)
				      .classed("target", true)
				      .each(updateNodes("source", true));

				  	svg.selectAll("path.link.source-" + d.key)
				      .classed("source", true)
				      .each(updateNodes("target", true));
	            }
			}
		}

		$scope.linksupdate = [
          {
               "from" : "id0",
               "to" : "id1",
               "value" : 3.0
          },
          {
               "from" : "id0",
               "to" : "id4",
               "value" : 3.0
          },
          {
               "from" : "id2",
               "to" : "id4",
               "value" : 5.0
          },
          {
               "from" : "id11",
               "to" : "id4",
               "value" : 5.0
          },
          {
               "from" : "id10",
               "to" : "id5",
               "value" : 5.0
          },
          {
               "from" : "id9",
               "to" : "id6",
               "value" : 5.0
          },
          {
               "from" : "id4",
               "to" : "id3",
               "value" : 5.0
          },
          {
               "from" : "id0",
               "to" : "id6",
               "value" : 5.0
          }
     ];

	}, 3500);

}]);