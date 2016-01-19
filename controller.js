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
	}
	$scope.load = function(){
		drawData();
		console.log("drawData");
	}
}]);

zuiwanControllers.controller("SiderCtrl", ['$scope', '$location', function($scope, $location){
	$scope.isActive = function(current){
		var href = '#'+$location.url();
	    return current === href;
	}
}])

