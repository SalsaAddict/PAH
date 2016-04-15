/// <reference path="../typings/angularjs/angular.d.ts" />

declare var FB: any;

module PAH {
    "option strict";
    export interface IWindowService extends angular.IWindowService { fbAsyncInit: Function; }
    export interface IRootScopeService extends angular.IRootScopeService {
        user: any;
        login: Function;
        logout: Function;
    }
}

var pah: angular.IModule = angular.module("pah", ["ngRoute", "ngMaterial"]);

pah.config(["$logProvider", function ($logProvider: angular.ILogProvider) {
    $logProvider.debugEnabled(document.getElementById("pahScript").getAttribute("data-debug") === "true");
}]);

pah.run(["$window", "$rootScope", "$locale", "$log", function (
    $window: PAH.IWindowService,
    $rootScope: PAH.IRootScopeService,
    $locale: angular.ILocaleService,
    $log: angular.ILogService) {
    $window.fbAsyncInit = function () {
        FB.Event.subscribe("auth.authResponseChange", function (response: any) {
            if (response.status === "connected") {
                FB.api("/me", { access_token: response.authResponse.accessToken }, function (response: any) {
                    $rootScope.$apply(() => {
                        $rootScope.user = response;
                        $log.debug("FB login");
                    });
                });
            } else {
                $rootScope.$apply(function () {
                    delete $rootScope.user;
                    $log.debug("FB logout");
                });
            }
            $log.debug(response);
        });
        FB.init({
            appId: "693765580666719",
            channelUrl: "channel.html",
            status: true,
            cookie: true,
            xfbml: true,
            version: "v2.5"
        });
        $rootScope.login = function () { FB.login(); }
        $rootScope.logout = function () { FB.logout(); }
        $log.debug("FB init");
    };
    $log.debug("PAH running (" + $locale.id + ")");
}]);