'use strict';

zuiwanControllers.controller('TopicsCtrl', ['$scope', '$http', function($scope, $http){
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/topic/get_topic"
	}).success(function(data){
		$scope.topics = data;
	});
}])