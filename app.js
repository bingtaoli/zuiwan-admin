'use strict';

//依赖于FileUpload插件
var zuiwanApp = angular.module('zuiwanApp', [
	"ngRoute", 'zuiwanControllers', 'ngFileUpload'
]);

zuiwanApp.config(["$routeProvider", function($routeProvider){
	$routeProvider.when("/visit", {
		templateUrl: "views/visit.html",
		controller: 'VisitCtrl'
	})
	.when("/allArticles", {
		templateUrl: "views/articles.html",
		controller: 'ArticlesCtrl'
	})
	.when("/allArticles/edit/:id", {
		templateUrl: "views/edit.html",
		controller: 'EditCtrl',
	})
	.when("/publish", {
		templateUrl: "views/publish.html",
		controller: 'PublishCtrl'
	})
	.otherwise({
		redirecTo: "/allArticles"
	});
}]);