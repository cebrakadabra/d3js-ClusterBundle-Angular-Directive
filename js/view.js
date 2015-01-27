d3app.directive('d3clusterDirective', function($parse) {
    return {
      restrict: 'E',
      scope: {
	      config: '='
	    },
      	link: function clusterDiagram(scope, element, attrs) {


// *********************************** RETRIEVING AND DEALING WITH DATA ********************************

	      	var clusteridentifier = null;
	      	if(scope.config.id != "" && scope.config.id != undefined && scope.config.id != null){
	      		clusteridentifier = scope.id;
	      		
	      	} else{
	      		clusteridentifier = "clusterid";
	      	}
	      	
	      	element.append("<div id="+clusteridentifier+"></div>");

	      	var groups = [];
      		var items = [];
      		var links = []; 
      		groups = scope.config.groups;
      		items = scope.config.items;
      		links = scope.config.links;


      		var groupColors = null;

      		if(scope.config.groupColors != "" && scope.config.groupColors != undefined && scope.config.groupColors != null){
      			var colorgroup = scope.config.groupColors;
      			
      			for(var y = 0; y < colorgroup.length; y++){
      				var isOk  = /^#[0-9A-F]{6}$/i.test(colorgroup[y]);
      				if(isOk){
      					groupColors = colorgroup;
      				} else{
      					alert("ATTENTION\n\nA given color seems not to be in hexcode. \n\nConvention: 6digits and hexcode only. \nDefault color is used now.")
      					groupColors = ["#db003a", "#002d61", "#f08c00", "#0080c4", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"];
      				}
      			}
      			
      		} else{
      			groupColors = ["#db003a", "#002d61", "#f08c00", "#0080c4", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"];
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

// *********************************** RETRIEVING AND DEALING WITH DATA END ********************************      		

// *********************************** SCOPE.DRAWCHART FUNC *******************************************************

			scope.drawChart = function(w, h, rx, ry, m0, rotate, pi, mouseoverevent, clickevent){

				var splines = [];

				var cluster = d3.layout.cluster()
				    .size([360, ry - 180])
				    .sort(function(a, b) { return d3.ascending(a.key, b.key); });

				var bundle = d3.layout.bundle();

				var line = d3.svg.line.radial()
				    .interpolate("bundle")
				    .tension(.85)
				    .radius(function(d) { return d.y; })
				    .angle(function(d) { return d.x / 180 * Math.PI; });

				var div = d3.select("#"+clusteridentifier+"")
				    .style("width", w + "px")
				    .style("height", w + "px");

				var svg = div.append("svg:svg")
				    .attr("width", w)
				    .attr("height", w)
				  .append("svg:g")
				    .attr("transform", "translate(" + rx + "," + ry + ")");

				svg.append("svg:path")
				    .attr("class", "arc")
				    .attr("d", d3.svg.arc().outerRadius(ry - 120).innerRadius(0).startAngle(0).endAngle(2 * Math.PI))
				    .on("mousedown", mousedown);


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
				      .attr("dx", function(d) { return d.x < 180 ? 25 : -25; })
				      .attr("dy", ".31em")
				      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
				      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
				      .text(function(d) { return d.label; })
				      .on("mouseover", mouseoverevent)
				      .on("click", clickevent)
				      .on("mouseout", mouseout);


				 


				  var groupData = svg.selectAll("g.group")
				    .data(nodes.filter(function(d) { 
				    	if(groups.length == 1){
				    		return (d.key==groups[0].id) && d.children;
				    	} else if(groups.length == 2){
				    		return (d.key==groups[0].id || d.key==groups[1].id) && d.children;
				    	} else if(groups.length == 3){
				    		return (d.key==groups[0].id || d.key==groups[1].id || d.key==groups[2].id) && d.children;
				    	} else if(groups.length == 4){
				    		return (d.key==groups[0].id || d.key==groups[1].id || d.key==groups[2].id || d.key==groups[3].id) && d.children;
				    	} else if(groups.length == 5){
				    		return (d.key==groups[0].id || d.key==groups[1].id || d.key==groups[2].id || d.key==groups[3].id || d.key==groups[4].id) && d.children;
				    	} else if(groups.length == 6){
				    		return (d.key==groups[0].id || d.key==groups[1].id || d.key==groups[2].id || d.key==groups[3].id || d.key==groups[4].id || d.key==groups[5].id) && d.children;
				    	} else if(groups.length == 7){
				    		return (d.key==groups[0].id || d.key==groups[1].id || d.key==groups[2].id || d.key==groups[3].id || d.key==groups[4].id || d.key==groups[5].id || d.key==groups[6].id) && d.children;
				    	} else if(groups.length == 8){
				    		return (d.key==groups[0].id || d.key==groups[1].id || d.key==groups[2].id || d.key==groups[3].id || d.key==groups[4].id || d.key==groups[5].id || d.key==groups[6].id || d.key==groups[7].id) && d.children;
				    	}


				    	
				    	 }))
				  .enter().append("group")
				    .attr("class", "group")
				    .attr("id", function(d){ return d.key; });
				    
				  var groupArc = d3.svg.arc()
				  .innerRadius(ry - 177)
				  .outerRadius(ry - 157)
				  .startAngle(function(d) { return (findStartAngle(d.__data__.children)-2) * pi / 180;})
				  .endAngle(function(d) { return (findEndAngle(d.__data__.children)+2) * pi / 180});
				  

				  svg.selectAll("g.arc")
				  .data(groupData[0])
				  .enter().append("svg:path")
				  .attr("d", groupArc)
				  .attr("class", "groupArc")
				  .style("fill", "#db003a")
				  .style("fill-opacity", 1.0);
				  

				  
				  for(var i = 0; i < groups.length; i++){
				  	$(".groupArc").eq(i).css("fill", groupColors[i]);
				  }



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
				        .attr("dx", function(d) { return (d.x + rotate) % 360 < 180 ? 25 : -25; })
				        .attr("text-anchor", function(d) { return (d.x + rotate) % 360 < 180 ? "start" : "end"; })
				        .attr("transform", function(d) { return (d.x + rotate) % 360 < 180 ? null : "rotate(180)"; });
				  }
				}

				// function mouseover(d) {
				  
				// }

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


				function findStartAngle(children) {
				    var min = children[0].x;
				    children.forEach(function(d) {
				       if (d.x < min)
				           min = d.x;
				    });
				    return min;
				}

				function findEndAngle(children) {
				    var max = children[0].x;
				    children.forEach(function(d) {
				       if (d.x > max)
				           max = d.x;
				    });
				    return max;
				}


			};

// **************************************** SCOPE.DRAWCHART FUNC END *************************************


// ********************************* DEFINED SIZE OR AUTOSIZING CONFIG **********************************

			var w = null,
			    h = null,
			    rx = null,
			    ry = null,
			    m0,
			    rotate = 0,
			    pi = Math.PI;

			if(scope.config.width == null && scope.config.height == null && scope.config.autosize == true){
				// w and h = null, autosize true
				if($("#"+clusteridentifier+"").parent().height() == 0 || $("#"+clusteridentifier+"").parent().width() == 0){
					if($("#"+clusteridentifier+"").parent().parent().height() == 0 || $("#"+clusteridentifier+"").parent().parent().width() == 0){
						w = $("body").width();
						h = $("body").height();
						rx = w / 2;
			    		ry = h / 2;
						scope.drawChart(w, h, rx, ry, m0, rotate, pi, scope.config.events.onMouseOver, scope.config.events.onClick);

					} else{
						w = $("#"+clusteridentifier+"").parent().parent().width();
						h = $("#"+clusteridentifier+"").parent().parent().height();
						rx = w / 2;
					    ry = h / 2;
						scope.drawChart(w, h, rx, ry, m0, rotate, pi, scope.config.events.onMouseOver, scope.config.events.onClick);
						
					}

				} else{
					w = $("#"+clusteridentifier+"").parent().width();
					h = $("#"+clusteridentifier+"").parent().height();
					rx = w / 2;
				    ry = h / 2;

					scope.drawChart(w, h, rx, ry, m0, rotate, pi, scope.config.events.onMouseOver, scope.config.events.onClick);
				}


			} else if(scope.config.width != null && scope.config.height != null && scope.config.autosize == true){
				// w and h != null, but autosize true
				if($("#"+clusteridentifier+"").parent().height() == 0 || $("#"+clusteridentifier+"").parent().width() == 0){
					if($("#"+clusteridentifier+"").parent().parent().height() == 0 || $("#"+clusteridentifier+"").parent().parent().width() == 0){
						w = $("body").width();
						h = $("body").height();
						rx = w / 2;
			    		ry = h / 2;
						scope.drawChart(w, h, rx, ry, m0, rotate, pi, scope.config.events.onMouseOver, scope.config.events.onClick);

					} else{
						console.log("here?");
						w = $("#"+clusteridentifier+"").parent().parent().width();
						h = $("#"+clusteridentifier+"").parent().parent().height();
						rx = w / 2;
					    ry = h / 2;
						scope.drawChart(w, h, rx, ry, m0, rotate, pi, scope.config.events.onMouseOver, scope.config.events.onClick);
						
					}

				} else{
					w = $("#"+clusteridentifier+"").parent().width();
					h = $("#"+clusteridentifier+"").parent().height();
					rx = w / 2;
				    ry = h / 2;

					scope.drawChart(w, h, rx, ry, m0, rotate, pi, scope.config.events.onMouseOver, scope.config.events.onClick);
				}

			} else{
				// w and h in config set
				w = scope.config.width;
				h = scope.config.height;
				rx = w / 2;
			    ry = h / 2;

				scope.drawChart(w, h, rx, ry, m0, rotate, pi, scope.config.events.onMouseOver, scope.config.events.onClick);
				
			}
			
			

			


// ********************************* DEFINED SIZE OR AUTOSIZING CONFIG END **********************************
			

// ********************************* WATCHES **********************************

	scope.$watch('config', function(newconf, oldconf) {	
		
		var clusterid = null;
      	if(newconf.id != "" && newconf.id != undefined && newconf.id != null){
      		clusterid = newconf.id;
      		
      	} else{
      		clusterid = "clusterid";
      	}
		$("#"+clusterid+" svg").remove();

		structure = [];

		groups = [];
  		items = [];
  		links = []; 
  		groups = newconf.groups;
  		items = newconf.items;
  		links = newconf.links;
      		

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


  		var w = newconf.width, 
  			h = newconf.height,
  			rx = w / 2, 
  			ry = h / 2, 
  			m0,
			rotate = 0,
			pi = Math.PI;


		
		scope.drawChart(w, h, rx, ry, m0, rotate, pi, newconf.events.onMouseOver, newconf.events.onClick);


	});

// ********************************* WATCHES END **********************************



      } // clusterDiagram end
    }; // return end
}); // directive end