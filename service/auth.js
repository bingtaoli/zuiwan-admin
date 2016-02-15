'use strict';

var auth = angular.module('auth', ['storage']);

//对外提供API
auth.factory('AuthService', function ($http, Session, $state) {
    var authService = {};
    var loginUrl; // login url
    log('ONLINE_MODE', ONLINE_MODE);
    if (ONLINE_MODE){
        loginUrl = 'http://115.28.75.190/zuiwan-backend/index.php/admin/login';
    } else {
        loginUrl = 'http://localhost/zuiwan-backend/index.php/admin/login';
    }
    authService.login = function (credentials) {
        return $http
            .post(loginUrl, credentials)
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

    authService.logout = function(){
        Session.delUser();
    }

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