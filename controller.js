'use strict';

function editor_init(){
	//适配editor宽度
	var editorWidth = $('form').offsetWidth - 30;
    var config = {
        'toolbar': [['Bold', 'Italic', 'Strike', 'Format', 'NumberedList', 'BulletedList', 'Image', 'PasteFromWord',
            'Table', 'HorizontalRule', 'SpecialChar', 'Undo', 'Redo', 'Maximize']],
        'uiColor': '#FAFAFA',
        'removePlugins': 'elementspath',
        'width': editorWidth,
        'height': 450
    };
    window.editor = CKEDITOR.replace('rich-editor', config);
}

var zuiwanControllers = angular.module('zuiwanControllers', []);

zuiwanControllers.controller('VisitCtrl', ['$scope', function ($scope) {
	function drawData(){
		var d1 = [];
		for (var i = 0; i <= 11; i += 1) {
			d1.push([i, parseInt((Math.floor(Math.random() * (1 + 20 - 10))) + 10)]);
		}
		$("#flot-1ine").length && $.plot($("#flot-1ine"), [{
			data: d1
		}], 
		{
			series: {
				lines: {
					show: true,
					lineWidth: 2,
					fill: true,
					fillColor: {
						colors: [{
							opacity: 0.0
						}, {
							opacity: 0.2
						}]
					}
				},
				points: {
					radius: 5,
					show: true
				},
				grow: {
					active: true,
					steps: 50
				},
				shadowSize: 2
			},
			grid: {
				hoverable: true,
				clickable: true,
				tickColor: "#f0f0f0",
				borderWidth: 1,
				color: '#f0f0f0'
			},
			colors: ["#65bd77"],
			xaxis:{
			},
			yaxis: {
				ticks: 5
			},
			tooltip: true,
			tooltipOpts: {
				content: "chart: %x.1 is %y.4",
				defaultTheme: false,
				shifts: {
					x: 0,
					y: 20
				}
			}
		}
		);
	}
	$scope.load = function(){
		drawData();
		console.log("drawData");
	}
}]);

zuiwanControllers.controller('ArticlesCtrl', ['$scope', '$http', function($scope, $http) {
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/article/get_article"
	}).success(function(data){
		$scope.articles = data;
	});
 }])

zuiwanControllers.controller('EditCtrl', ['$scope', '$http', 'Upload', '$timeout', 
	'$routeParams', function($scope, $http, Upload, $timeout, $routeParams){
	var id = $routeParams.id;
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/media/get_media"
	}).success(function(data){
		$scope.medias = data;
	});
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/topic/get_topic"
	}).success(function(data){
		$scope.topics = data;
	});
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/article/get_one_article?id=" + id,
	}).success(function(data){
		$scope.article = data;
		var article = data;
		$scope.article_title = article.article_title;
		$scope.article_intro = article.article_intro;
		$scope.article_media = article.article_media;
		$scope.article_topic = article.article_topic;
		$scope.article_img = article.article_img;
	});
	$scope.load = function(){
		editor_init();
	};
	$scope.update = function(){
		$http({
			method: "POST",
			url: '',
			data: {
				article_title: $scope.article_title,
	      		article_intro: $scope.article_intro,
	      		article_media: $scope.article_media,
	      		article_topic: $scope.article_topic,
	      		article_content: content,
	      		article_author: "李冰涛",
	      		is_update: 1,
	      		id: $scope.article.id,
			}
		});
	};
	$scope.uploadPic = function(file){
		var content = window.editor.getData();
    	file.upload = Upload.upload({
	      	url: 'http://localhost/zuiwan-backend/index.php/article/add_article',
	      	data: { 
	      		file: file,
	      	},
    	});
    	file.upload.then(function (response) {
      		$timeout(function () {
        		file.result = response.data;
      		});
    	}, function (response) {
      		if (response.status > 0)
        	$scope.errorMsg = response.status + ': ' + response.data;
    	}, function (evt) {
      		// Math.min is to fix IE which reports 200% sometimes
      		file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    	});
    }
}])

zuiwanControllers.controller('PublishCtrl', [ '$scope', '$http', 'Upload', '$timeout', function($scope, $http, Upload, $timeout){
	$scope.load = function(){
		editor_init();
	};
	$scope.article_img_preview_show = false;
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/media/get_media"
	}).success(function(data){
		$scope.medias = data;
	});
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/topic/get_topic"
	}).success(function(data){
		$scope.topics = data;
	});
	$scope.uploadPic = function(file){
		var content = window.editor.getData();
    	file.upload = Upload.upload({
	      	url: 'http://localhost/zuiwan-backend/index.php/article/add_article',
	      	data: { 
	      		file: file,
	      		article_title: $scope.article_title,
	      		article_intro: $scope.article_intro,
	      		article_media: $scope.media,
	      		article_topic: $scope.topic,
	      		article_content: content,
	      		article_author: "李冰涛",
	      	},
    	});
    	file.upload.then(function (response) {
      		$timeout(function () {
        		file.result = response.data;
      		});
    	}, function (response) {
      		if (response.status > 0)
        	$scope.errorMsg = response.status + ': ' + response.data;
    	}, function (evt) {
      		// Math.min is to fix IE which reports 200% sometimes
      		file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    	});
    };
}])

zuiwanControllers.controller('MediasCtrl', ['$scope', '$http', function($scope, $http){
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/media/get_media"
	}).success(function(data){
		$scope.medias = data;
	});
}])

zuiwanControllers.controller('TopicsCtrl', ['$scope', '$http', function($scope, $http){
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/topic/get_topic"
	}).success(function(data){
		$scope.topics = data;
	});
}])

zuiwanControllers.controller('AddMediaCtrl', ['$scope', '$http', 'Upload', '$timeout', 
function($scope, $http, Upload, $timeout){
	$scope.addMedia = function(){
    	file.upload = Upload.upload({
	      	url: 'http://localhost/zuiwan-backend/index.php/article/add_article',
	      	data: { 
	      		file: file,

	      	},
    	});
    	file.upload.then(function (response) {
      		$timeout(function () {
        		file.result = response.data;
      		});
    	}, function (response) {
      		if (response.status > 0)
        	$scope.errorMsg = response.status + ': ' + response.data;
    	}, function (evt) {
      		// Math.min is to fix IE which reports 200% sometimes
      		file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    	});
    };
}])

zuiwanControllers.controller('EditMediaCtrl', ['$scope', '$http', 'Upload', '$timeout', 
	'$routeParams', function($scope, $http, Upload, $timeout, $routeParams){
	var id = $routeParams.id;
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/media/get_one_media?id=" + id,
	}).success(function(data){
		$scope.media = data;
	});
}])
