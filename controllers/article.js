'use strict';

var otherPlaceClick = function(){
	$('body').click();
}

function num2Array(num){
	var range = [];
	for(var i = 0; i < num; i++) {
		range.push(i);
	}
	return range;
}

zuiwanControllers.controller('ArticlesCtrl', ['$scope', '$http', function($scope, $http) {
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/article/get_page_article?index=0&numberPerPage=2"
	}).success(function(data){
		$scope.articles = data;
	});
	$http({
		method: "GET",
		url: "http://115.28.75.190/zuiwan-backend/index.php/article/get_article_count"
	}).success(function(data){
		$scope.article_count = data;
	});
	$scope.currentPage = 0;
	$scope.delArticle = function(id, index){
		$.ajax({
			type: "POST",
			url: "http://115.28.75.190/zuiwan-backend/index.php/article/del_article",
			dataType: 'JSON',
			data: {
				id: id,
			},
			success: function(){
				console.log("del success");
				otherPlaceClick();
				$scope.articles.splice(index, 1);
			}
		})
	};
	$scope.otherPlaceClick = otherPlaceClick;
	$scope.numberOptions = [
		{value: 2},
		{value: 5},
		{value: 10},
		{value: 30},
	];
	$scope.$watch("numberPerPage.value", function(){
		$scope.updatePageNumber();
	});
	$scope.$watch("currentPage", function(){
		$scope.updatePageIndex();
	});
	$scope.updatePageNumber = function(){
		var num = $scope.numberPerPage.value;
		$scope.currentPage = 0; //reset currentPage if change pageNumber
		var index = $scope.currentPage;
		$http({
			method: 'GET',
			url: "http://115.28.75.190/zuiwan-backend/index.php/article/get_page_article?index=" 
				 + index + "&numberPerPage=" + num,
		}).success(function(data){
			$scope.articles = data;
		});
	};
	$scope.updatePageIndex = function(){
		var num = $scope.numberPerPage.value;
		var index = $scope.currentPage;
		$http({
			method: 'GET',
			url: "http://115.28.75.190/zuiwan-backend/index.php/article/get_page_article?index=" 
				 + index + "&numberPerPage=" + num,
		}).success(function(data){
			$scope.articles = data;
		});
	}
	$scope.range = function(){
		var pageMax = Math.ceil($scope.article_count / $scope.numberPerPage.value);
		return num2Array(pageMax);
	}
	$scope.prevPageDisabled = function() {
		return $scope.currentPage === 0 ? "disabled" : "";
	};
	$scope.nextPageDisabled = function() {
		return $scope.currentPage === Math.ceil($scope.article_count / $scope.numberPerPage.value)-1 ? "disabled" : "";
	};
	$scope.setPage = function(n){
		$scope.currentPage = n;
	};
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
	$scope.preview = false;

	$scope.publish = function(){
		var content = window.editor.getData();

		var formData = new FormData($('[name="myForm"]')[0]);
		formData.append('article_content', content);
		formData.append('article_author', "李冰涛");
        $.ajax({
            type: "POST",
            url: 'http://115.28.75.190/zuiwan-backend/index.php/article/add_article',
            dataType: 'JSON',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            timeout : 80000,  // 80s超时时间
            success: function (json) {
                if (json.status == 'success'){
                    console.log("success");
                } else if (json.status == 'error'){
                    console.log(json.message);
                }
            },
            error: function (e) {
                console.log(e);
            }
        });
        // var file = $scope.picFile;
    	// file.upload = Upload.upload({
	    //   	url: 'http://115.28.75.190/zuiwan-backend/index.php/article/add_article',
	    //   	data: {
	    //   		file: file,
	    //   		article_title: $scope.article_title,
	    //   		article_intro: $scope.article_intro,
	    //   		article_media: $scope.article_media,
	    //   		article_topic: $scope.article_topic,
	    //   		article_content: content,
	    //   		article_author: "李冰涛",
	    //   		is_recommend: $scope.is_recommend,
	    //   		is_banner: $scope.is_banner,
	    //   	},
    	// });
    	// file.upload.then(function (response) {
     //  		$timeout(function () {
     //    		file.result = response.data;
     //  		});
    	// }, function (response) {
     //  		if (response.status > 0)
     //    	$scope.errorMsg = response.status + ': ' + response.data;
    	// }, function (evt) {
     //  		// Math.min is to fix IE which reports 200% sometimes
     //  		file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    	// });
    };
    $scope.toPreview = function(){
    	var content = window.editor.getData();
    	$scope.article_content = content;
		$scope.preview = true;
    }
    $scope.quitPreview = function(){
    	$scope.preview = false;
    	$scope.article_content = '';
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

