'use strict';

//内部使用，不对外提供API
var storage = angular.module('storage', []);

storage.factory('Session', function ($window) {
    //log('storage length is ', $window.sessionStorage.length);
    //init service data
    var user = angular.fromJson($window.sessionStorage.getItem('user'));
    if (user){
        log('user logged in ', user.username);
    }
    this.storeUser = function(json){
        $window.sessionStorage.setItem('user', JSON.stringify(json));
    }
    this.getUser = function(){
        return $window.sessionStorage.getItem('user');
    }
    return this;
});

storage.factory('Cookie', function($window){
    this.getCookie = function(c_name){
        if (document.cookie.length > 0){
            var c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                var c_end=document.cookie.indexOf(";",c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                } 
                return unescape(document.cookie.substring(c_start,c_end));
            } 
        }
        return "";
    };
    return this;
});
