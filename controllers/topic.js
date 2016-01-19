'use strict';

zuiwanControllers.controller('TopicsCtrl', ['$scope', '$http', function($scope, $http){
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/topic/get_topic"
	}).success(function(data){
		$scope.topics = data;
	});
}])

zuiwanControllers.controller('AddTopicCtrl', ['$scope', '$http', 'Upload', '$timeout', 
function($scope, $http, Upload, $timeout){
	$scope.addTopic = function(){
		var formData = new FormData($('[name="myForm"]')[0]);
        $.ajax({
            type: "POST",
            url: 'http://localhost/zuiwan-backend/index.php/topic/add_topic',
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
}])

zuiwanControllers.controller('EditTopicCtrl', ['$scope', '$http', 'Upload', '$timeout', 
	'$stateParams', function($scope, $http, Upload, $timeout, $stateParams){
	var id = $stateParams.id;
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/topic/get_one_topic?id=" + id,
	}).success(function(data){
		$scope.topic = data;
	});
}])