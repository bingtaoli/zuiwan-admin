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

zuiwanControllers.controller('VisitCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$http({
		method: "GET",
		url: "http://localhost/zuiwan-backend/index.php/article/get_top_article",
	}).success(function(data){
		var topArticles = [];
		var topArticleIds = [];
		for (var i = 0; i < data.length; i++){
			//限制文章标题最多字数
			var article_title = data[i].article_title;
			var maxLength = 13;
			if (article_title.length > maxLength){
				article_title = article_title.substr(0, maxLength) + "...";
			}
			topArticles.push({'label': article_title, 'value': data[i].visit_count});
			topArticleIds.push(data[i].id);
		}
		$scope.topArticleIds = topArticleIds;
		fushionDraw(topArticles);
		//消除绘图库的水印
		var spans = $('tspan');
		for (var i = 0; i < spans.length; i++){
			if ($(spans[i]).text() == "FusionCharts XT Trial"){
				$(spans[i]).remove();
				break;
			}
		}
	});
	function fushionDraw(topArticles){
	    var revenueChart = new FusionCharts({
	        "type": "bar2d",
	        "renderAt": "chartContainer",
	        "width": "600",
	        "height": "300",
	        "dataFormat": "json",
	        "dataSource": {
			    "chart": {
			        "yAxisName": "访问量",
			        //"numberPrefix": "$",
			        "paletteColors": "#0075c2",
			        "bgColor": "#ffffff",
			        "showBorder": "0",
			        "showCanvasBorder": "0",
			        "usePlotGradientColor": "0",
			        "plotBorderAlpha": "10",
			        "placeValuesInside": "1",
			        "valueFontColor": "#ffffff",
			        "showAxisLines": "1",
			        "axisLineAlpha": "25",
			        "divLineAlpha": "10",
			        "alignCaptionWithCanvas": "0",
			        "showAlternateVGridColor": "0",
			        "captionFontSize": "14",
			        "subcaptionFontSize": "14",
			        "subcaptionFontBold": "0",
			        "toolTipColor": "#ffffff",
			        "toolTipBorderThickness": "0",
			        "toolTipBgColor": "#000000",
			        "toolTipBgAlpha": "80",
			        "toolTipBorderRadius": "2",
			        "toolTipPadding": "5"
			    },
			    "data": topArticles
			},
			"events": {
				"dataPlotClick": function(eventObj, dataObj) {
                	var index = dataObj.index;
                	log(index);
                	var id = $scope.topArticleIds[index];
                	$state.go('viewArticle', {id: id});
            	}
			}
	    });
	    revenueChart.render();
	};

	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/admin/get_website_information",
	}).success(function(data){
		log(data);
		$scope.article_count = data.article_count;
		$scope.user_count = data.user_count;
	});
}]);

zuiwanControllers.controller("SiderCtrl", ['$scope', '$location', function($scope, $location){
	$scope.isActive = function(current){
		var href = '#'+$location.url();
	    return current === href;
	}
}])

