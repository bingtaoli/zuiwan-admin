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
		var data = {
		    labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
		    datasets: [
		        {
		            label: "My Second dataset",
		            fillColor: "rgba(151,187,205,0.2)",
		            strokeColor: "rgba(151,187,205,1)",
		            pointColor: "rgba(151,187,205,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [28, 48, 40, 19, 86, 27, 90]
		        }
		    ]
		};
		var width = $(".panel-body")[0].offsetWidth;
		var canvas = document.getElementById("myChart");
		canvas.width = width - 40;
		var ctx = canvas.getContext("2d");
		var myLineChart = new Chart(ctx).Line(data);
	}
	$scope.load = function(){
		drawData();
	}
}]);

zuiwanControllers.controller("SiderCtrl", ['$scope', '$location', function($scope, $location){
	$scope.isActive = function(current){
		var href = '#'+$location.url();
	    return current === href;
	}
}])

