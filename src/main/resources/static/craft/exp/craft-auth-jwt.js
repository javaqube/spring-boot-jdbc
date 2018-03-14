(function () {
    'use strict';
    angular.module('craft.auth.jwt',['craft.auth.JwtAuthService','craft.auth.JwtTokenInterceptor','craft.auth.token']);

    angular.module('craft.auth.jwt').run(['$rootScope','JwtAuthService','$state',function ($rootScope,JwtAuthService,$state) {
        //viewContentLoading is used in angular/views/index.html to show/hide content and progress bar (spinner icon) when loading new pages
        // $rootScope.viewContentLoading = false;
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            //cfpLoadingBar.start();
            // $rootScope.viewContentLoading = true;
            //also hide sidebar in mobile view when navigating to a new state
            if (toState.name.indexOf('auth') > -1 || JwtAuthService.isLoggedIn()) {
                return;
            }
            if (!JwtAuthService.isLoggedIn()) {
                event.preventDefault();
                $state.go('auth.login', {location: true, reload: true});
            }

        });
        // $rootScope.$on('$stateChangeSuccess', function (event) {
        //     //cfpLoadingBar.complete();
        //     $rootScope.viewContentLoading = false;
        // });
        // $rootScope.$on('$stateChangeError', function (event, p1, p2, p3) {
        //     //cfpLoadingBar.complete();
        //     $rootScope.viewContentLoading = false;
        // });
    }]);

    angular.module('craft.auth.jwt').controller('UserProfileCtrl',function ($scope,HttpService,ConfigService, TokenService,$state) {
        $scope.login=function () {
            console.log("login",$scope.user);
            HttpService.post(ConfigService.getAppConfig().RootPath+'/auth',$scope.user).then(function (data) {
                console.log(data);
                TokenService.saveToken(ConfigService.getAppConfig().authTokenName,data.token);
                $state.go('home.default');
            },function (error) {
                console.log(error)
            });
        };
        $scope.isLoggedIn = function () {
            var token = TokenService.getToken(ConfigService.getAppConfig().authTokenName);
            if (token) {
                var payload = JSON.parse(atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        $scope.currentUser = function () {
            if (this.isLoggedIn()) {
                var token = TokenService.getToken(ConfigService.getAppConfig().authTokenName);
                var payload = JSON.parse(atob(token.split('.')[1]));
                // console.log(payload);
                // console.log( JSON.parse(atob(token.split('.')[0])));
                // console.log( token.split('.')[2]);
                return {
                    email: payload.email,
                    name: payload.sub
                };
            }
        };
        $scope.logout = function () {
            console.log("logout");
            TokenService.removeToken(ConfigService.getAppConfig().authTokenName);
            $state.go('auth.login', {location: true, reload: true});
        };
    });

}).call(this);
(function () {
    'use strict';
    /**
     * ========================================================================
     * JwtAuthService
     * ========================================================================
     */
    angular.module('craft.auth.JwtAuthService',['craft.auth.token']).factory('JwtAuthService', JwtAuthServiceFun);
    JwtAuthServiceFun.$inject=['TokenService', 'ConfigService', '$q', '$http'];
    function JwtAuthServiceFun(TokenService, ConfigService, $q, $http) {
        var authService = angular.extend({});
        authService.isLoggedIn = function () {
            var token = TokenService.getToken(ConfigService.getAppConfig().authTokenName);
            if (token) {
                var payload = JSON.parse(atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        authService.currentUser = function () {
            if (this.isLoggedIn()) {
                var token = TokenService.getToken(ConfigService.getAppConfig().authTokenName);
                var payload = JSON.parse(atob(token.split('.')[1]));
                //console.log(payload);
                //console.log( JSON.parse(atob(token.split('.')[0])));
                //console.log( token.split('.')[2]);
                return {
                    email: payload.email,
                    name: payload.name
                };
            }
        };
        authService.logout = function () {
            TokenService.removeToken(ConfigService.getAppConfig().authTokenName);
        };
        authService.logon = function (username, password, verifyCode) {
            var deferred = $q.defer();

            var user = {"username": username, "password": password, "verifyCode": verifyCode};
            $http.post(ConfigService.getAppConfig().RootPath + '/logon', JSON.stringify(user))
                .then(function (data) {
                    console.log(data);
                    TokenService.saveToken(ConfigService.getAppConfig().authTokenName, data);
                    //TokenService.removeToken(ConfigService.getAppConfig().loginTokenName);
                    //$state.go('home');
                    deferred.resolve("logon success");
                }, function (data) {
                    console.log(data);
                    // authService.getVerifyImgUrl();
                    //$scope.imgClicked();
                    deferred.reject("logon failed");
                });
            return deferred.promise;
        };
        // authService.getVerifyImgUrl = function () {
        //     return ConfigService.getRootPath() + "/kaptcha.jpg?" + Math.floor(Math.random() * 100);
        // };
        return authService;
    }
}).call(this);
(function () {
    'use strict';
    /**
     * ========================================================================
     * JwtTokenInterceptor
     * ========================================================================
     */
    angular.module('craft.auth.JwtTokenInterceptor',['craft.auth.token']).factory('JwtTokenInterceptor', JwtTokenInterceptor);
    JwtTokenInterceptor.$inject = [ 'TokenService', 'ConfigService'];
    function JwtTokenInterceptor(TokenService, ConfigService) {
        return {
            request: function (config) {
                var tokenValue = TokenService.getToken(ConfigService.getAppConfig().authTokenName);
                if (tokenValue) {
                    config.headers=config.headers||{};
                    config.headers['Authorization'] = tokenValue;
                }
                return config;
            }
        };
    }

    angular.module('craft.auth.JwtTokenInterceptor').config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('JwtTokenInterceptor');
    }]);
}).call(this);
(function () {
    'use strict';

    /**
     * ========================================================================
     * TokenService
     * ========================================================================
     */
    angular.module('craft.auth.token',['craft.storage']).factory('TokenService', ['CraftStorageService', function (CraftStorageService) {
        return {
            saveToken: function (name, token) {
                CraftStorageService.set(name, token);
            },
            getToken: function (name) {
                return CraftStorageService.get(name);
            },
            removeToken: function (name) {
                CraftStorageService.remove(name);
            }
        };
    }]);

}).call(this);