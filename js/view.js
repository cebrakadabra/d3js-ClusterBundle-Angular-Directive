d3app.directive('d3clusterDirective', function($parse) {
    return {
      restrict: 'E',
      scope: {
	      id: '@customid',
	      groups: '@',
	      items: '@',
	      links: '@',
	      groupcolorsgiven: '@'
	    },
      	link: function postLink(scope, element, attrs) {

	      	var clusteridentifier = null;
	      	if(scope.id != "" && scope.id != undefined){
	      		clusteridentifier = scope.id;
	      		
	      	} else{
	      		clusteridentifier = "clusterid";
	      	}
	      	
	      	element.append("<div id="+clusteridentifier+"></div>");

	      	var groups = [];
      		var items = [];
      		var links = []; 
      		groups = $parse(scope.groups)(scope);
      		items = $parse(scope.items)(scope);
      		links = $parse(scope.links)(scope);

      		var groupcolors = null;
      		var grouptypes = ["group1", "group2", "group3", "group4", "group5", "group6", "group6", "group7", "group8"];

      		if(scope.groupcolorsgiven != "" && scope.groupcolorsgiven != undefined){
      			var colorgroup = $parse(scope.groupcolorsgiven)(scope);
      			console.log(colorgroup);
      			for(var y = 0; y < colorgroup.length; y++){
      				var isOk  = /^#[0-9A-F]{6}$/i.test(colorgroup[y]);
      				if(isOk){
      					groupcolors = colorgroup;
      				} else{
      					alert("ATTENTION\n\nA given color seems not to be in hexcode. \n\nConvention: 6digits and hexcode only. \nDefault color is used now.")
      					// console.log("A color seems to be not hex.");
      					groupcolors = ["#db003a", "#002d61", "#f08c00", "#0080c4", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"];
      				}
      			}
      			
      		} else{
      			groupcolors = ["#db003a", "#002d61", "#f08c00", "#0080c4", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"];
      		}
      		


      		var structure = [];
      		

      		for(var i = 0; i < items.length; i++){
      			structure.push({"name": "root."+items[i].group+"."+items[i].id, "label": items[i].label, "id":items[i].id, "imports": []});
      		}

      		for(var i = 0; i < links.length; i++){
      			for(var x = 0; x < items.length; x++){
      				if(items[x].id == links[i].from){
      					for(var y = 0; y < structure.length; y++){
      						if(structure[y].id == links[i].to){
      							structure[y].imports.push("root."+items[x].group+"."+items[x].id);
      						}
      					}
      				}
      			}
      		}

      		console.log(JSON.stringify(structure));





			var w = 1280,
			    h = 800,
			    rx = w / 2,
			    ry = h / 2,
			    m0,
			    rotate = 0;

			var splines = [];

			var cluster = d3.layout.cluster()
			    .size([360, ry - 120])
			    .sort(function(a, b) { return d3.ascending(a.key, b.key); });

			var bundle = d3.layout.bundle();

			var line = d3.svg.line.radial()
			    .interpolate("bundle")
			    .tension(.85)
			    .radius(function(d) { return d.y; })
			    .angle(function(d) { return d.x / 180 * Math.PI; });

			// Chrome 15 bug: <http://code.google.com/p/chromium/issues/detail?id=98951>
			var div = d3.select("body").insert("div", "h2")
			    .style("top", "-80px")
			    .style("left", "-160px")
			    .style("width", w + "px")
			    .style("height", w + "px")
			    .style("position", "absolute")
			    .style("-webkit-backface-visibility", "hidden");

			var svg = div.append("svg:svg")
			    .attr("width", w)
			    .attr("height", w)
			  .append("svg:g")
			    .attr("transform", "translate(" + rx + "," + ry + ")");

			svg.append("svg:path")
			    .attr("class", "arc")
			    .attr("d", d3.svg.arc().outerRadius(ry - 120).innerRadius(0).startAngle(0).endAngle(2 * Math.PI))
			    .on("mousedown", mousedown);

			var inputjson = JSON.stringify(structure);

			// d3.json("json/flare-imports.json", function(classes) {
			
				
				// classes = structure;
			  var nodes = cluster.nodes(packages.root(structure)),
			      links = packages.imports(nodes),
			      splines = bundle(links);

			  var path = svg.selectAll("path.link")
			      .data(links)
			    .enter().append("svg:path")
			      .attr("class", function(d) { return "link source-" + d.source.key + " target-" + d.target.key; })
			      .attr("d", function(d, i) { return line(splines[i]); });

			  svg.selectAll("g.node")
			      .data(nodes.filter(function(n) { return !n.children; }))
			    .enter().append("svg:g")
			      .attr("class", "node")
			      .attr("id", function(d) { return "node-" + d.key; })
			      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
			    .append("svg:text")
			      .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
			      .attr("dy", ".31em")
			      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
			      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
			      .text(function(d) { return d.label; })
			      .on("mouseover", mouseover)
			      .on("mouseout", mouseout);

			  d3.select("input[type=range]").on("change", function() {
			    line.tension(this.value / 100);
			    path.attr("d", function(d, i) { return line(splines[i]); });
			  });
			//});  
			//});

			d3.select(window)
			    .on("mousemove", mousemove)
			    .on("mouseup", mouseup);

			function mouse(e) {
			  return [e.pageX - rx, e.pageY - ry];
			}

			function mousedown() {
			  m0 = mouse(d3.event);
			  d3.event.preventDefault();
			}

			function mousemove() {
			  if (m0) {
			    var m1 = mouse(d3.event),
			        dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;
			    div.style("-webkit-transform", "translateY(" + (ry - rx) + "px)rotateZ(" + dm + "deg)translateY(" + (rx - ry) + "px)");
			  }
			}

			function mouseup() {
			  if (m0) {
			    var m1 = mouse(d3.event),
			        dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;

			    rotate += dm;
			    if (rotate > 360) rotate -= 360;
			    else if (rotate < 0) rotate += 360;
			    m0 = null;

			    div.style("-webkit-transform", null);

			    svg
			        .attr("transform", "translate(" + rx + "," + ry + ")rotate(" + rotate + ")")
			      .selectAll("g.node text")
			        .attr("dx", function(d) { return (d.x + rotate) % 360 < 180 ? 8 : -8; })
			        .attr("text-anchor", function(d) { return (d.x + rotate) % 360 < 180 ? "start" : "end"; })
			        .attr("transform", function(d) { return (d.x + rotate) % 360 < 180 ? null : "rotate(180)"; });
			  }
			}

			function mouseover(d) {
			  svg.selectAll("path.link.target-" + d.key)
			      .classed("target", true)
			      .each(updateNodes("source", true));

			  svg.selectAll("path.link.source-" + d.key)
			      .classed("source", true)
			      .each(updateNodes("target", true));
			}

			function mouseout(d) {
			  svg.selectAll("path.link.source-" + d.key)
			      .classed("source", false)
			      .each(updateNodes("target", false));

			  svg.selectAll("path.link.target-" + d.key)
			      .classed("target", false)
			      .each(updateNodes("source", false));
			}

			function updateNodes(name, value) {
			  return function(d) {
			    if (value) this.parentNode.appendChild(this);
			    svg.select("#node-" + d[name].key).classed(name, value);
			  };
			}

			function cross(a, b) {
			  return a[0] * b[1] - a[1] * b[0];
			}

			function dot(a, b) {
			  return a[0] * b[0] + a[1] * b[1];
			}











      }
    };
});