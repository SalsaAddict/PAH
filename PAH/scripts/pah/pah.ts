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
    export module Toast {
        export class Service {
            static $inject: string[] = ["$mdToast"];
            constructor(private $mdToast: any) { }
            showSimple = (message: string) => {
                this.$mdToast.show(this.$mdToast.simple().textContent(message).position("top right"));
            }
        }
    }
}

var pah: angular.IModule = angular.module("pah", ["ngRoute", "ngMaterial"]);

pah.service("$pahToast", PAH.Toast.Service);

pah.config(["$logProvider", function ($logProvider: angular.ILogProvider) {
    $logProvider.debugEnabled(document.getElementById("pahScript").getAttribute("data-debug") === "true");
}]);

pah.run(["$window", "$rootScope", "$locale", "$pahToast", "$log", function (
    $window: PAH.IWindowService,
    $rootScope: PAH.IRootScopeService,
    $locale: angular.ILocaleService,
    $pahToast: PAH.Toast.Service,
    $log: angular.ILogService) {
    $window.fbAsyncInit = function () {
        FB.Event.subscribe("auth.authResponseChange", function (response: any) {
            if (response.status === "connected") {
                FB.api("/me", {
                    access_token: response.authResponse.accessToken,
                    fields: ["first_name", "last_name", "gender", "birthday", "email", "timezone", "locale"]
                }, function (response: any) {
                    $rootScope.$apply(function () {
                        $rootScope.user = response;
                        $pahToast.showSimple("Hello " + $rootScope.user.first_name + "!");
                        $log.debug("FB login", response);
                    });
                });
            } else {
                $rootScope.$apply(function () {
                    $pahToast.showSimple("Goodbye " + $rootScope.user.first_name + "!");
                    delete $rootScope.user;
                    $log.debug("FB logout", response);
                });
            }
        });
        var fbInit: any = {
            appId: "693765580666719",
            channelUrl: "channel.html",
            status: true,
            cookie: true,
            xfbml: true,
            version: "v2.5"
        };
        FB.init(fbInit);
        $log.debug("FB init", fbInit);
        $rootScope.login = function () { FB.login(); }
        $rootScope.logout = function () { FB.logout(); }
    };
    $log.debug("PAH running (", $locale.id, ")");
}]);