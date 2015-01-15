# d3js-ClusterBundle-Angular-Directive
A mix between a Cluster and a Bundle Layout of d3js. Reprogrammed for AngularJS from http://www.theguardian.com/world/interactive/2013/apr/30/violence-guns-best-selling-video-games


## How to use it
The Directive is located in js/view.js.

to get started use: ```<d3cluster-Directive customid=""></d3cluster-Directive>```

*Note: customid is optional - if input is undefined, it will create it's own in the directive (isolated scope in cooperation with two way data binding will be available soon)* 

The repo contains a whole AngularJS example. You only have to start it on a (local) Webserver

## Tasks todo
- Redraw the svg visualization - it won't work with the current data structure
