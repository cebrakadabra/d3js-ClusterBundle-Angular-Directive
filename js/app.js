var d3app = angular.module("d3App", [
  'ngRoute', 
  'ngAnimate'
]);

//Configuration
d3app.config(function($logProvider){
	$logProvider.debugEnabled(false);
});


// Routing for the Views
d3app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
  		when('/home', {
    		templateUrl: 'partials/main.html',
    		controller: 'MainController'
  		}).
  		otherwise({
    		redirectTo: '/home'
  	});
}]);

//Run
d3app.run(function($log){
	$log.debug("test debug");
});


