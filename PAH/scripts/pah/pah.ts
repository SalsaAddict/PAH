/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-material/angular-material.d.ts" />

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
        friends: any[]
    }
    export function IsBlank(expression: any): boolean {
        if (expression === undefined) { return true; }
        if (expression === null) { return true; }
        if (expression === NaN) { return true; }
        if (expression === {}) { return true; }
        if (expression === []) { return true; }
        if (String(expression).trim().length === 0) { return true; }
        return false;
    }
    export function IfBlank(expression: any, defaultValue: any = undefined): any {
        return (IsBlank(expression)) ? defaultValue : expression;
    }
    export class Service {
        static $inject: string[] = ["$parse", "$http", "$mdToast", "$mdSidenav", "$log"];
        constructor(
            private $parse: angular.IParseService,
            private $http: angular.IHttpService,
            private $mdToast: angular.material.IToastService,
            private $mdSidenav: angular.material.ISidenavService,
            private $log: angular.ILogService) { }
        user: IFacebookUser = undefined;
        login = () => { FB.login(null, { scope: "user_friends" }); }
        logout = () => { FB.logout(); }
        toggleMenu = () => {
            this.$mdSidenav("left").toggle();
            this.$log.debug("PAH toggleMenu");
        }
        toast = (message: string) => {
            this.$mdToast.show(this.$mdToast.simple().textContent(message).position("top right"));
        }
        execute = (procedure: Procedure.IProcedure, $scope?: angular.IScope, expression?: string): angular.IPromise<any> => {
            return this.$http.post("/execute.ashx", procedure).then((response: { data: { success: boolean; data: any; error: string; } }) => {
                this.$log.debug(response);
                if (response.data.success) {
                    if (!IsBlank($scope)) {
                        this.$parse(IfBlank(expression, procedure.name)).assign($scope, response.data.data);
                    }
                    return response.data.data;
                } else {
                    var message: string = IfBlank(response.data.error, "Unexpected Error");
                    if (message.substr(0, 4) === "pah:") {
                        this.toast(message.substr(5));
                    } else {
                        this.toast("An unexpected error occurred");
                        this.$log.debug("PAH execute error:", procedure.name, message);
                    }
                    return;
                }
            });
        }
    }
    export module Procedure {
        export interface IProcedure {
            name: string;
            parameters?: Parameter.IParameter[];
            nonQuery?: boolean;
            root?: string;
        }
        export module Parameter {
            export interface IParameter {
                name: string;
                value: any;
                isObject: boolean;
            }
        }
    }
    export interface IWindowService extends angular.IWindowService { fbAsyncInit: Function; }
    export interface IRootScopeService extends angular.IRootScopeService { $pah: Service }
}

var pah: angular.IModule = angular.module("pah", ["ngRoute", "ngMaterial"]);

pah.service("$pah", PAH.Service);

pah.config(["$logProvider", "$mdThemingProvider", function (
    $logProvider: angular.ILogProvider,
    $mdThemingProvider: angular.material.IThemingProvider) {
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
    $mdSidenav: angular.material.ISidenavService,
    $log: angular.ILogService) {
    $rootScope.$pah = $pah;
    $window.fbAsyncInit = function () {
        FB.Event.subscribe("auth.authResponseChange", function (authResponse: any) {
            if (authResponse.status === "connected") {
                FB.api("/me", {
                    access_token: authResponse.authResponse.accessToken,
                    fields: ["id", "name", "first_name", "last_name", "gender", "birthday", "email", "timezone", "locale"]
                }, function (apiResponse: any) {
                    $rootScope.$apply(function () {
                        $pah.user = apiResponse;
                        $pah.toast("Hello " + $pah.user.first_name + "!");
                        $log.debug("FB login", apiResponse);
                        FB.api("/me/friends", {
                            access_token: authResponse.authResponse.accessToken,
                            fields: ["id"]
                        }, function (apiResponse: any) {
                            $rootScope.$apply(function () {
                                $pah.user.friends = apiResponse;
                                $log.debug("FB login", apiResponse);
                            });
                        });
                    });
                });
            } else {
                $rootScope.$apply(function () {
                    $pah.toast("Goodbye " + $pah.user.first_name + "!");
                    delete $pah.user;
                    $log.debug("FB logout", authResponse);
                });
            }
        });
        var fbInit: any = {
            appId: "1376598962611648", // "693765580666719",
            status: false,
            cookie: true,
            xfbml: true,
            version: "v2.5"
        };
        FB.init(fbInit);
        $log.debug("FB init", fbInit);
    };
    $log.debug("PAH running (", $locale.id, ")");
}]);

