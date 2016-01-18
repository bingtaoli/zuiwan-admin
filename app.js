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
		templateUrl: "views/editArticle.html",
		controller: 'EditCtrl',
	})
	.when("/publish", {
		templateUrl: "views/publish.html",
		controller: 'PublishCtrl'
	})
	.when("/medias", {
		templateUrl: "views/medias.html",
		controller: 'MediasCtrl',
	})
	.when("/medias/addMedia", {
		templateUrl: "views/addMedia.html",
		controller: 'AddMediaCtrl',
	})
	.when("/medias/edit/:id", {
		templateUrl: "views/editMedia.html",
		controller: 'EditMediaCtrl',
	})
	.when("/topics", {
		templateUrl: "views/topics.html",
		controller: 'TopicsCtrl',
	})
	.when("/topics/edit/:id", {
		templateUrl: "views/editTopic.html",
		controller: 'EditTopicCtrl',
	})
	.otherwise({
		redirecTo: "/allArticles"
	});
}]);