'use strict';

zuiwanControllers.controller('ArticlesCtrl', ['$scope', '$http', function($scope, $http) {
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/article/get_page_article?index=0&numberPerPage=10"
	}).success(function(data){
		$scope.articles = data;

	});
	$scope.delArticle = function(id){
		$http({
			method: "POST",
			url: "http://115.28.75.190/zuiwan-backend/index.php/article/del_article",
			data: {
				id: id,
			}
		}).success(function(){
			console.log("del success");
			$scope.articles.splice(id, 1);
		});
	};
	$scope.otherPlaceClick = function(){
		$('body').click();
	}
 }])

zuiwanControllers.controller('EditCtrl', ['$scope', '$http', 'Upload', '$timeout', 
	'$stateParams', function($scope, $http, Upload, $timeout, $stateParams){
	var id = $stateParams.id;
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
		$scope.article_content = article.article_content;
		var timer = setInterval(function(){
			if ($scope.editorInited){
				window.editor.setData(article.article_content);
				clearInterval(timer);
			}
		}, 100);
	});
	$scope.load = function(){
		editor_init();
		$scope.editorInited = true;
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
	$scope.uploadPic = function(){
		var file = $scope.picFile;
		var content = window.editor.getData();
    	file.upload = Upload.upload({
	      	url: 'http://115.28.75.190/zuiwan-backend/index.php/article/add_article',
	      	data: { 
	      		file: file,
	      		article_title: $scope.article_title,
	      		article_intro: $scope.article_intro,
	      		article_media: $scope.article_media,
	      		article_topic: $scope.article_topic,
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
    $scope.preview = function(){
    	var content = window.editor.getData();
    	//@ todo
    }
}])

zuiwanControllers.controller("ViewArticle", ['$scope', '$stateParams', '$http', function($scope, $stateParams, $http){
	var id = $stateParams.id;
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/article/get_one_article?id=" + id,
	}).success(function(data){
		$scope.article = data;
	});
}])

