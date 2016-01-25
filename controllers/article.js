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
	var defaultPageNumer = 5;
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/article/get_page_article?index=0&numberPerPage=" + defaultPageNumer,
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
		{value: defaultPageNumer},
		{value: 8},
		{value: 10},
		{value: 20},
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
		url: "http://115.28.75.190/zuiwan-backend/index.php/article/admin_get_one_article?id=" + id,
	}).success(function(data){
		$scope.article = data;
		log(data);
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
	$scope.updateArticle = function(){
		var content = window.editor.getData();
		var formData = new FormData($('[name="myForm"]')[0]);
		formData.append("is_update", 1);
		formData.append('id', $scope.article.id);
		formData.append('article_content', content);
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
            success: function(){
            	log("update success");
            }
		});
	};
	$scope.sliders = {
    	redValue: 0,
    	greenValue: 51,
    	blueValue: 153,
    	opacity: 9,
    };
    $scope.colorOptions = {
		min: 0,
		max: 255
	};
    $scope.$watch("[sliders.redValue, sliders.blueValue, sliders.greenValue]", function(){
		$scope.color = 'rgb('+ $scope.sliders.redValue + ',' + $scope.sliders.greenValue + ',' 
    				+ $scope.sliders.blueValue + ')';
	});
    $scope.color = 'rgb('+ $scope.sliders.redValue + ',' + $scope.sliders.greenValue + ',' 
    				+ $scope.sliders.blueValue + ')';
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
		formData.append('article_color', "rgba(0, 51, 153, .9)");
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
    };
    $scope.toPreview = function(){
    	var content = window.editor.getData();
    	$scope.article_content = content;
		$scope.preview = true;
    }
    $scope.quitPreview = function(){
    	$scope.preview = false;
    	$scope.article_content = '';
    };
    $scope.sliders = {
    	redValue: 0,
    	greenValue: 51,
    	blueValue: 153,
    	opacity: 9,
    };
    $scope.colorOptions = {
		min: 0,
		max: 255
	};
    $scope.$watch("[sliders.redValue, sliders.blueValue, sliders.greenValue]", function(){
		$scope.color = 'rgb('+ $scope.sliders.redValue + ',' + $scope.sliders.greenValue + ',' 
    				+ $scope.sliders.blueValue + ')';
	});
    $scope.color = 'rgb('+ $scope.sliders.redValue + ',' + $scope.sliders.greenValue + ',' 
    				+ $scope.sliders.blueValue + ')';
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

