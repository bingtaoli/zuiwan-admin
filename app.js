'use strict';

//依赖于FileUpload插件
var zuiwanApp = angular.module('zuiwanApp', [
	'zuiwanControllers', 'ngFileUpload', 'ui.router', 'oc.lazyLoad',
]);

zuiwanApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/allArticles");
	$stateProvider
	.state('login', {
		url: '/login',
		views: {
			"": {
				templateUrl: 'views/login.html',
			}
		}
	})
    .state('visit', {
        url: '/visit',
        views: {
            "": {
                templateUrl: "views/framework.html",
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
            }
        }
    })
    .state('viewArticle', {
        url: "/viewArticle/:id",
        views: {
            "": {
                templateUrl: "views/framework.html",
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
    		},
    		section: {
    			templateUrl: "views/medias.html",
				controller: 'MediasCtrl',
    		}
    	}
    })
    .state('topics', {
    	url: '/topics', 
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
    		},
    		section: {
    			templateUrl: "views/topics.html",
				controller: 'TopicsCtrl',
    		}
    	}
    })
    .state('medias.addMedia', {
    	url: '/addMedia',
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
    		},
    		section: {
    			templateUrl: "views/addMedia.html",
				controller: 'AddMediaCtrl',
    		}
    	}
    })
    .state('topics.addTopic', {
    	url: '/addTopic',
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
    		},
    		section: {
    			templateUrl: "views/addTopic.html",
    		}
    	},
        controller: 'AddTopicCtrl',
    })
    .state('medias.editMedia', {
    	url: '/editMedia/:id',
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
    		},
    		section: {
    			templateUrl: "views/editMedia.html",
				controller: 'EditMediaCtrl',
    		}
    	}
    })
    .state('topics.editTopic', {
    	url: '/editTopic/:id',
    	views: {
    		"": {
    			templateUrl: "views/framework.html",
    		},
    		section:{
    			templateUrl: "views/editTopic.html",
				controller: 'EditTopicCtrl',
    		}
    	}
    })
}]);