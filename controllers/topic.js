'use strict';

zuiwanControllers.controller('TopicsCtrl', function($scope, $http, $state){
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/topic/get_topic"
	}).success(function(data){
		$scope.topics = data;
	});
    $scope.delTopic = function(id, index){
        var req = {
            method: "POST",
            url: "http://115.28.75.190/zuiwan-backend/index.php/topic/del_topic",
            data: { 
                id: id,
            }
        };
        /**
         * @note 如果使用$ajax，$scope.medias.splice()无法反映到页面!
         */
        $http(req).then(function(){
            console.log("del success");
            otherPlaceClick();
            $scope.topics.splice(index, 1);
        });
    };
    $scope.editTopic = function(id, index){
        log('topic id', id);
        $state.go('editTopic', {id: id});
    }
    $scope.otherPlaceClick = otherPlaceClick;
});

zuiwanControllers.controller('AddTopicCtrl', ['$scope', '$http', 'Upload', '$timeout', 
function($scope, $http, Upload, $timeout){
	$scope.addTopic = function(){
		var formData = new FormData($('[name="myForm"]')[0]);
        $.ajax({
            type: "POST",
            url: 'http://115.28.75.190/zuiwan-backend/index.php/topic/add_topic',
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
		url: "http://115.28.75.190/zuiwan-backend/index.php/topic/admin_get_one_topic?id=" + id,
	}).success(function(data){
		$scope.topic = data;
	});
    $scope.update = function(){
        var formData = new FormData($('[name="myForm"]')[0]);
        formData.append('id', $scope.topic.id);
        log('update topic img: ', $scope.topic.id);
        $.ajax({
            type: "POST",
            url: 'http://115.28.75.190/zuiwan-backend/index.php/topic/set_topic_img',
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
    }
}])