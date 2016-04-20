/// <reference path="../typings/angularjs/angular.d.ts" />

declare var FB: any, YT: any;

module PAH {
    "option strict";
    export interface IFacebookUser {
        id: string;
        name: string;
        first_name: string;
        last_name: string;
        gender: string;
        birthday: string;
        email: string;
        locale: string;
        timezone: string;
    }
    export class Service {
        static $inject: string[] = ["$mdToast", "$mdSidenav", "$log"];
        constructor(
            private $mdToast: any,
            private $mdSidenav: any,
            private $log: angular.ILogService) { }
        user: IFacebookUser = undefined;
        login = () => { FB.login(); }
        logout = () => { FB.logout(); }
        toggleMenu = () => {
            this.$mdSidenav("left").toggle();
            this.$log.debug("PAH toggleMenu");
        }
        toast = (message: string) => {
            this.$mdToast.show(this.$mdToast.simple().textContent(message).position("top right"));
        }
    }
    export interface IWindowService extends angular.IWindowService { fbAsyncInit: Function; }
    export interface IRootScopeService extends angular.IRootScopeService { $pah: Service }
}

var pah: angular.IModule = angular.module("pah", ["ngRoute", "ngMaterial"]);

pah.service("$pah", PAH.Service);

pah.config(["$logProvider", "$mdThemingProvider", function (
    $logProvider: angular.ILogProvider,
    $mdThemingProvider: any) {
    $logProvider.debugEnabled(document.getElementById("pahScript").getAttribute("data-debug") === "true");
    $mdThemingProvider.theme("default")
        .primaryPalette("blue")
        .accentPalette("teal")
        .warnPalette("red")
        .backgroundPalette("grey");
}]);

pah.run(["$window", "$rootScope", "$locale", "$pah", "$mdSidenav", "$log", function (
    $window: PAH.IWindowService,
    $rootScope: PAH.IRootScopeService,
    $locale: angular.ILocaleService,
    $pah: PAH.Service,
    $mdSidenav: any,
    $log: angular.ILogService) {
    $rootScope.$pah = $pah;
    $window.fbAsyncInit = function () {
        FB.Event.subscribe("auth.authResponseChange", function (response: any) {
            if (response.status === "connected") {
                FB.api("/me", {
                    access_token: response.authResponse.accessToken,
                    fields: ["id", "name", "first_name", "last_name", "gender", "birthday", "email", "timezone", "locale"]
                }, function (response: any) {
                    $rootScope.$apply(function () {
                        $pah.user = response;
                        $pah.toast("Hello " + $pah.user.first_name + "!");
                        $log.debug("FB login", response);
                    });
                });
            } else {
                $rootScope.$apply(function () {
                    $pah.toast("Goodbye " + $pah.user.first_name + "!");
                    delete $pah.user;
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
    };
    $log.debug("PAH running (", $locale.id, ")");
}]);