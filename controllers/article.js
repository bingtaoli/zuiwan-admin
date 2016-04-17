'use strict';

var editorHeight = 400;

function num2Array(num){
	var range = [];
	for(var i = 0; i < num; i++) {
		range.push(i);
	}
	return range;
}

var opacity = 0.89;
var colorStr = [
	'51, 51, 102',
	'102, 51, 102',
	'0, 153, 153',
	'51, 102, 102',
	'204, 102, 102',
	'51, 51, 51'
];
var COLORS = [];
for (var i = 0; i < colorStr.length; i++){
	COLORS.push('rgba(' + colorStr[i] + ',' + opacity + ')');
}

zuiwanControllers.controller('ColorCtrl', function($scope){
	// 0~2
    $scope.colorObj.color = COLORS[Math.ceil(Math.random() * COLORS.length) - 1];
    $scope.colorObj.colorChoices = COLORS;
    $scope.changeColor = function(index){
    	//log(index);
    	$scope.colorObj.color = COLORS[index];
    }
});

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
			$scope.recommend_count = data.recommend_count;
			$scope.banner_count = data.banner_count;
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

zuiwanControllers.controller('EditCtrl', function($scope, $http, Upload, $timeout, $stateParams, $state){
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
		//log("article detail: ", data);
		var article = data;
		$scope.article = article;
		$scope.content = article.article_content;
	});
    $scope.content = "稍等片刻...";
    $scope._simpleConfig = {
    	initialFrameWidth: $('#form')[0].offsetWidth - 30,
    	initialFrameHeight: editorHeight,
    	autoFloatEnabled: false,
    	
    };
	$scope.updateArticle = function(){
		var formData = new FormData($('[name="myForm"]')[0]);
		formData.append("is_update", 1);
		formData.append('id', $scope.article.id);
		formData.append('article_content', $scope.content);
		//formData.append('article_color', $scope.colorObj.color);
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
            	log(json);
            	if (json.status == 'success'){
            		log("update success");
	            	$scope.goTop();
	                $scope.showSuccessMsg('文章修改成功');
            	} else if (json.status == 'error'){
            		$scope.goTop();
	                $scope.showErrorMsg('文章修改失败,原因: ' + json.message);
            	}
            },
		});
	};
	$scope.updateImg = function(){
		var formData = new FormData($('[name="imgForm"]')[0]);
		//id 
		var id = $scope.article.id;
		log(id);
		formData.append('id', id);
		//todo 没有颜色直接返回
		formData.append('article_color', $scope.colorObj.color);
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
                setTimeout(function(){
                	$state.go('allArticles');	
                }, 600);
                
            },
		});
	};
	$scope.colorObj = {};
	$scope.colorObj.color = '';
	$scope.colorObj.colorChoices = [];
});

zuiwanControllers.controller('PublishCtrl', function($scope, $http, Upload, $timeout, $state){
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
		var formData = new FormData($('[name="myForm"]')[0]);
		formData.append('article_content', $scope.content);
		// log('color:', $scope.colorObj.color);
		// formData.append('article_color', $scope.colorObj.color);
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
                    $state.go('allArticles');
                } else if (json.status == 'error'){
                    console.log(json.message);
                    $scope.goTop();
                    $scope.showErrorMsg('文章发布失败,原因: ' + json.message);
                }
            },
            error: function (e) {
                console.log(e);
                $scope.goTop();
                $scope.showErrorMsg('文章发布失败,原因: ' + json.message);
            }
        });
    };
    $scope.toPreview = function(){
    	log($scope.content);
    	$scope.article_content = $scope.content;
		$scope.preview = true;
    }
    $scope.quitPreview = function(){
    	$scope.preview = false;
    	$scope.article_content = '';
    };
    //默认推荐
    $scope.article = {
    	is_recommend: '1',
    	is_banner: '0'
    };
    //为了让子controller改变父controller的值，使用colorObj
    //参见:
    //http://www.lovelucy.info/understanding-scopes-in-angularjs.html
    $scope.colorObj = {};
	$scope.colorObj.color = '';
	$scope.colorObj.colorChoices = [];
	//editor
	$scope.content = "";
    $scope._simpleConfig = {
    	initialFrameWidth: $('#form')[0].offsetWidth - 30,
    	initialFrameHeight: editorHeight,
    	autoFloatEnabled: false
    };
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

