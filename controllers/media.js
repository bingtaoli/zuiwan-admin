'use strict';

zuiwanControllers.controller('MediasCtrl', ['$scope', '$http', function($scope, $http){
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/media/get_media"
	}).success(function(data){
		$scope.medias = data;
	});
    $scope.delMedia = function(id, index){
        $.ajax({
            type: "POST",
            url: "http://115.28.75.190/zuiwan-backend/index.php/media/del_media",
            dataType: 'JSON',
            data: {
                id: id,
            },
            success: function(){
                console.log("del success");
                otherPlaceClick();
                log($scope.medias);
                $scope.medias.splice(index, 1);
            }
        })
    };
    $scope.otherPlaceClick = otherPlaceClick;
}]);

zuiwanControllers.controller('AddMediaCtrl', ['$scope', '$http', 'Upload', '$timeout', 
function($scope, $http, Upload, $timeout){
	$scope.addMedia = function(){
		var formData = new FormData($('[name="myForm"]')[0]);
        $.ajax({
            type: "POST",
            url: 'http://115.28.75.190/zuiwan-backend/index.php/media/add_media',
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

zuiwanControllers.controller('EditMediaCtrl', ['$scope', '$http', 'Upload', '$timeout', 
	'$stateParams', function($scope, $http, Upload, $timeout, $stateParams){
	var id = $stateParams.id;
	$http({
		method: 'GET',
		url: "http://115.28.75.190/zuiwan-backend/index.php/media/get_one_media?id=" + id,
	}).success(function(data){
		$scope.media = data;
	});
}])
