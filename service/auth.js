'use strict';

var auth = angular.module('auth', ['storage']);

//对外提供API
auth.factory('AuthService', function ($http, Session, $state) {
    var authService = {};
    authService.login = function (credentials) {
        return $http
            .post('http://localhost/zuiwan-backend/index.php/admin/login', credentials)
            .then(function (res) {
                if (res.data.status == 1){
                    //存储到session
                    Session.storeUser({
                        'username': credentials.username
                    });
                    $state.go('allArticles');
                } else {
                    log('login fail', res.data.message);
                }
            });
    };

    authService.isAuthenticated = function () {
        if (Session.getUser()){
            return true;
        }
        log('not authed');
        return false;
    };

    authService.getAuth = function(){
        return Session.getUser();
    }

    return authService;
})