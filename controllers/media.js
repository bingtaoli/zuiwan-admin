'use strict';

zuiwanControllers.controller('MediasCtrl', ['$scope', '$http', function($scope, $http){
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/media/get_media"
	}).success(function(data){
		$scope.medias = data;
	});
}])

zuiwanControllers.controller('AddMediaCtrl', ['$scope', '$http', 'Upload', '$timeout', 
function($scope, $http, Upload, $timeout){
	$scope.addMedia = function(){
		var file = $scope.avatarFile;
    	file.upload = Upload.upload({
	      	url: 'http://115.28.75.190/zuiwan-backend/index.php/article/add_article',
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
