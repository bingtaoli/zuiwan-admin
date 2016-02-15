'use strict';

var log = console.log.bind(console);

var otherPlaceClick = function(){
    $('body').click();
}

//依赖于FileUpload插件
var zuiwanApp = angular.module('zuiwanApp', [
	'zuiwanControllers', 'ngFileUpload', 'ui.router', 'oc.lazyLoad', 'ngSanitize', 'ui.bootstrap-slider',
    'auth',
]);

var ONLINE_MODE = (window.location.host == '115.28.75.190' ? true : false);

zuiwanApp.run(function($rootScope){
    $rootScope.$on('$stateChangeStart', function(){
        //log('change');
    })
});

zuiwanApp.directive('editOrDel', function(){
    return {
        restrict: 'AE',
        templateUrl: function(elem, attr){
            return 'views/directive/editOrDel' + attr.type + '.html';
        },
    }
});

zuiwanApp.config(['$httpProvider', function($httpProvider){
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
 
            for (name in obj) {
                value = obj[name];
 
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                            + encodeURIComponent(value) + '&';
                }
            }
 
            return query.length ? query.substr(0, query.length - 1) : query;
        };
 
        return angular.isObject(data) && String(data) !== '[object File]'
                ? param(data)
                : data;
    }];
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/allArticles");
	$stateProvider
	.state('login', {
		url: '/login',
		views: {
			"": {
				templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
			}
		}
	})
    .state('visit', {
        url: '/visit',
        views: {
            "": {
                templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
            },
            section: {
                templateUrl: "views/visit.html",
                controller: 'VisitCtrl'
            }
        }
    })
    .state('allArticles', {
    	url: "/allArticles",
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
    		},
            section: {
                templateUrl: "views/articles.html",
                controller: 'ArticlesCtrl',
            }
        }
    })
    .state('editArticle', {
    	url: "/allArticles/edit/:id",
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
    		},
    		'section': {
    			templateUrl: "views/editArticle.html",
                controller: 'EditCtrl',
            }
        }
    })
    .state('publishArticle', {
    	url: "/publish",
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
    		},
    		section: {
    			templateUrl: "views/publish.html",
                controller: 'PublishCtrl'
            }
        }
    })
    .state('previewArticle', {
        url: "/preview",
        views: {
            "": {
                templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
            }
        }
    })
    .state('viewArticle', {
        url: "/viewArticle/:id",
        views: {
            "": {
                templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
            },
            section: {
                templateUrl: "views/viewArticle.html",
                controller: 'ViewArticle'
            }
        }
    })
    .state('medias', {
    	url: '/medias',
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
    		},
    		section: {
    			templateUrl: "views/medias.html",
                controller: 'MediasCtrl',
            }
        }
    })
    .state('addMedia', {
        url: '/addMedia',
        views: {
            "": {
                templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
            },
            section: {
                templateUrl: "views/addMedia.html",
                controller: 'AddMediaCtrl',
            }
        }
    })
    .state('editMedia', {
        url: '/editMedia/:id',
        views: {
            "": {
                templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
            },
            section:{
                templateUrl: "views/editMedia.html",
                controller: 'EditMediaCtrl',
            }
        }
    })
    .state('topics', {
    	url: '/topics', 
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
    		},
    		section: {
    			templateUrl: "views/topics.html",
                controller: 'TopicsCtrl',
            }
        }
    })
    .state('addTopic', {
    	url: '/addTopic',
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
    		},
    		section: {
    			templateUrl: "views/addTopic.html",
    		}
    	},
        controller: 'AddTopicCtrl',
    })
    .state('editTopic', {
    	url: '/editTopic/:id',
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
                controller: 'BaseCtrl',
    		},
    		section:{
    			templateUrl: "views/editTopic.html",
                controller: 'EditTopicCtrl',
            }
        }
    })
}]);