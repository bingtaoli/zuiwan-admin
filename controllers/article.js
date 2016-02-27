'use strict';

function num2Array(num){
	var range = [];
	for(var i = 0; i < num; i++) {
		range.push(i);
	}
	return range;
}

zuiwanControllers.controller('ArticlesCtrl', function($scope, $http, AuthService, $state) {
	var defaultPageNumer = 15;
	$http({
		method: 'GET',
		url: ONLINE_MODE ?
				("http://115.28.75.190/zuiwan-backend/index.php/article/admin_get_page_article?index=0&numberPerPage=" 
				+ defaultPageNumer) :
				("http://localhost/zuiwan-backend/index.php/article/admin_get_page_article?index=0&numberPerPage=" 
				+ defaultPageNumer),
	}).success(function(data){
		$scope.articles = data.articles;
		$scope.article_count = data.count;
	});
	$scope.currentPage = 0;
	$scope.delArticle = function(id, index){
		log('del article, id: ', id);
		var req = {
            method: "POST",
            url: ONLINE_MODE ?
            	 ("http://115.28.75.190/zuiwan-backend/index.php/article/del_article") : 
            	 ("http://localhost/zuiwan-backend/index.php/article/del_article"),
            data: { 
                id: id,
            }
        };
		/**
         * @note 如果使用$ajax，$scope.articles.splice()无法反映到页面!
         */
        $http(req).then(function(){
            console.log("del success");
			otherPlaceClick();
			$scope.articles.splice(index, 1);
        });
	};
	$scope.otherPlaceClick = otherPlaceClick;
	$scope.numberOptions = [
		{value: defaultPageNumer},
		{value: 8},
		{value: 10},
		{value: 20},
	];
	$scope.$watch("numberPerPage.value", function(){
		//每页显示数目改变
		var numberPerPage = $scope.numberPerPage.value;
		$scope.currentPage = 0; //reset currentPage if change pageNumber
		var index = $scope.currentPage;
		var is_recommend = $scope.searchCondition.is_recommend;
		var is_banner = $scope.searchCondition.is_banner;
		var urlPostfix = '';
		if (is_recommend == '0' || is_recommend == '1'){
			urlPostfix += "&is_recommend=" + is_recommend;
		}
		if (is_banner == '0' || is_banner == '1'){
			urlPostfix += "&is_banner=" + is_banner;
		}
		$http({
			method: 'GET',
			url: ONLINE_MODE ?  
				 ("http://115.28.75.190/zuiwan-backend/index.php/article/admin_get_page_article?index=" 
				 + index + "&numberPerPage=" + numberPerPage + urlPostfix) :
				 ("http://localhost/zuiwan-backend/index.php/article/admin_get_page_article?index=" 
				 + index + "&numberPerPage=" + numberPerPage + urlPostfix),
		}).success(function(data){
			$scope.articles = data.articles;
			$scope.article_count = data.count;
		});
	});
	$scope.$watch("currentPage", function(){
		//索引改变
		var numberPerPage = $scope.numberPerPage.value;
		var index = $scope.currentPage;
		var is_recommend = $scope.searchCondition.is_recommend;
		var is_banner = $scope.searchCondition.is_banner;
		var urlPostfix = '';
		if (is_recommend == '0' || is_recommend == '1'){
			urlPostfix += "&is_recommend=" + is_recommend;
		}
		if (is_banner == '0' || is_banner == '1'){
			urlPostfix += "&is_banner=" + is_banner;
		}
		$http({
			method: 'GET',
			url: ONLINE_MODE ? 
				 ("http://115.28.75.190/zuiwan-backend/index.php/article/admin_get_page_article?index=" 
				 + index + "&numberPerPage=" + numberPerPage + urlPostfix) :
				 ("http://localhost/zuiwan-backend/index.php/article/admin_get_page_article?index=" 
				 + index + "&numberPerPage=" + numberPerPage + urlPostfix),
		}).success(function(data){
			$scope.articles = data.articles;
			$scope.article_count = data.count;
		});
	});
	$scope.searchCondition = {
		is_recommend: '4',
		is_banner: '4',
	};
	$scope.$watch("[searchCondition.is_recommend, searchCondition.is_banner]", function(){
		$scope.currentPage = 0; //reset currentPage if change pageNumber
		var index = 0;
		var numberPerPage = $scope.numberPerPage.value;
		var is_recommend = $scope.searchCondition.is_recommend;
		var is_banner = $scope.searchCondition.is_banner;
		var urlPostfix = '';
		if (is_recommend == '0' || is_recommend == '1'){
			urlPostfix += "&is_recommend=" + is_recommend;
		}
		if (is_banner == '0' || is_banner == '1'){
			urlPostfix += "&is_banner=" + is_banner;
		}
		$http({
			method: 'GET',
			url: ONLINE_MODE ? 
				("http://115.28.75.190/zuiwan-backend/index.php/article/admin_get_page_article?index=" 
				 + index + "&numberPerPage=" + numberPerPage + urlPostfix) : 
				("http://localhost/zuiwan-backend/index.php/article/admin_get_page_article?index=" 
				 + index + "&numberPerPage=" + numberPerPage + urlPostfix),
		}).success(function(data){
			$scope.articles = data.articles;
			$scope.article_count = data.count;
		});
	});
	//给底部分页list一个遍历的range数组
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
	$scope.editArticle = function(id, index){
		log('article id', id);
		$state.go('editArticle', {id: id});
	};
 })

zuiwanControllers.controller('EditCtrl', ['$scope', '$http', 'Upload', '$timeout', 
	'$stateParams', function($scope, $http, Upload, $timeout, $stateParams){
	var id = $stateParams.id;
	$http({
		method: 'GET',
		url: ONLINE_MODE ?
			 "http://115.28.75.190/zuiwan-backend/index.php/media/get_media" :
			 "http://localhost/zuiwan-backend/index.php/media/get_media",
	}).success(function(data){
		$scope.medias = data;
	});
	$http({
		method: 'GET',
		url: ONLINE_MODE ?
			 "http://115.28.75.190/zuiwan-backend/index.php/topic/get_topic" :
			 "http://localhost/zuiwan-backend/index.php/topic/get_topic", 
	}).success(function(data){
		$scope.topics = data;
	});
	$http({
		method: 'GET',
		url: ONLINE_MODE ?
			 "http://115.28.75.190/zuiwan-backend/index.php/article/admin_get_one_article?id=" + id :
			 "http://localhost/zuiwan-backend/index.php/article/admin_get_one_article?id=" + id, 
	}).success(function(data){
		if (!data){
			return;
		}
		log("article detail: ", data);
		var article = data;
		$scope.article = article;
		//改变color
		var color = article.article_color;
		var matches;
		if (matches = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*(0\.[0-9])\)/)){
			//符合rgba的格式
			$scope.sliders = {
		    	redValue: matches[1],
		    	greenValue: matches[2],
		    	blueValue: matches[3],
		    	opacity: matches[4] * 10,
		    };
		}
	    //防止ckeditor尚未初始化 :(
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
		formData.append('article_color', $scope.color);
		if (!ONLINE_MODE) {
			log('publish article, author: ', $scope.article_author);
			log('publish article, publisher: ', $scope.article_publisher);
		}
		// do not need append, they have been in formData
		//formData.append('article_publisher', $scope.article_publisher);
		//formData.append('article_author', $scope.article_author);
		$.ajax({
			type: "POST",
			url:  ONLINE_MODE ? 
            	  ('http://115.28.75.190/zuiwan-backend/index.php/article/add_article') : 
            	  ('http://localhost/zuiwan-backend/index.php/article/add_article'),
			dataType: 'JSON',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            timeout : 80000,  // 80s超时时间
            success: function(json){
            	log("update success");
            	log(json);
            	$scope.goTop();
                $scope.showSuccessMsg('文章修改成功');
            },
		});
	};
	$scope.updateImg = function(){
		var formData = new FormData($('[name="imgForm"]')[0]);
		//id 
		var id = $scope.article.id;
		log(id);
		formData.append('id', id);
		$.ajax({
			type: "POST",
			url:  ONLINE_MODE ? 
            	  ('http://115.28.75.190/zuiwan-backend/index.php/article/update_article_img') : 
            	  ('http://localhost/zuiwan-backend/index.php/article/update_article_img'),
			dataType: 'JSON',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            timeout : 80000,  // 80s超时时间
            success: function(json){
            	log("update success");
            	log(json);
            	$scope.goTop();
                $scope.showSuccessMsg('文章大图修改成功');
            },
		});
	}
}])

zuiwanControllers.controller('PublishCtrl', function($scope, $http, Upload, $timeout){
	$scope.load = function(){
		editor_init();
	};
	$scope.article_img_preview_show = false;
	$http({
		method: 'GET',
		url: ONLINE_MODE ?
			 "http://115.28.75.190/zuiwan-backend/index.php/media/get_media" :
			 "http://localhost/zuiwan-backend/index.php/media/get_media"
	}).success(function(data){
		$scope.medias = data;
	});
	$http({
		method: 'GET',
		url: ONLINE_MODE ?
			 "http://115.28.75.190/zuiwan-backend/index.php/topic/get_topic" :
			 "http://localhost/zuiwan-backend/index.php/topic/get_topic"
	}).success(function(data){
		$scope.topics = data;
	});
	$scope.preview = false;

	$scope.publish = function(){
		var content = window.editor.getData();
		var formData = new FormData($('[name="myForm"]')[0]);
		formData.append('article_content', content);
		if (!ONLINE_MODE) {
			log('publish article, author: ', $scope.article_author);
			log('publish article, publisher: ', $scope.article_publisher);
		}
		// do not need append, they have been in formData
		//formData.append('article_publisher', $scope.article_publisher);
		//formData.append('article_author', $scope.article_author);
		formData.append('article_color', $scope.color);
        $.ajax({
            type: "POST",
            url:  ONLINE_MODE ? 
            	  ('http://115.28.75.190/zuiwan-backend/index.php/article/add_article') : 
            	  ('http://localhost/zuiwan-backend/index.php/article/add_article'),
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
                    $scope.goTop();
                    $scope.showSuccessMsg('文章发布成功');
                } else if (json.status == 'error'){
                    console.log(json.message);
                    $scope.goTop();
                    $scope.showSuccessMsg('文章发布失败,原因: ' + json.message);
                }
            },
            error: function (e) {
                console.log(e);
                $scope.goTop();
                $scope.showSuccessMsg('文章发布失败,原因: ' + json.message);
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
    $scope.hasColor = false;
    $scope.$watch('picFile', function(){
    	log('picFile');
    	var f = document.getElementById('article-img-file').files[0];
    	var src = window.URL.createObjectURL(f);
    	if (src){
    		document.getElementById('preview').src = src;
    		//耗时任务放在异步 :)
	    	setTimeout(function(){
	    		if (document.getElementById('preview').src){
	    			var colorThief = new ColorThief();
			    	var image = $('#preview')[0];
			    	var color = colorThief.getColor(image);
			    	log(color);
			    	var palette = colorThief.getPalette(image);
			    	log(palette);
			    	log('hehe0');
			    	//color改成RGB形式
			    	color = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + '0.9)';
			    	//colorChoices
			    	var colorChoices = [];
			    	for (var i=0; i<palette.length; i++){
			    		colorChoices.push('rgba(' + palette[i][0] + ',' + palette[i][1] + ',' 
			    						   + palette[i][2] +  ',' + '0.9)');
			    	}
			    	$scope.$apply(function(){
			    		$scope.color = color;
				    	$scope.palette = palette;
				    	$scope.colorChoices = colorChoices;
				    	$scope.hasColor = true;
			    	});
	    		}
	    	}, 300);
    	}
    });
})

zuiwanControllers.controller("ViewArticle", ['$scope', '$stateParams', '$http', function($scope, $stateParams, $http){
	var id = $stateParams.id;
	$http({
		method: 'GET',
		url: ONLINE_MODE ?
			 ("http://115.28.75.190/zuiwan-backend/index.php/article/get_one_article?id=" + id) :
			 ("http://localhost/zuiwan-backend/index.php/article/get_one_article?id=" + id),
	}).success(function(data){
		$scope.article = data;
	});
}])

