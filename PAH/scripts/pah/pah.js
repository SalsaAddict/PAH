/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-material/angular-material.d.ts" />
var PAH;
(function (PAH) {
    "option strict";
})(PAH || (PAH = {}));
var pah = angular.module("pah", ["ngRoute", "ngMaterial"]);
pah.config(["$logProvider", function ($logProvider) {
        $logProvider.debugEnabled(document.getElementById("pahScript").getAttribute("data-debug") === "true");
    }]);
pah.run(["$window", "$rootScope", "$locale", "$mdToast", "$log", function ($window, $rootScope, $locale, $mdToast, $log) {
        $window.fbAsyncInit = function () {
            FB.Event.subscribe("auth.authResponseChange", function (response) {
                if (response.status === "connected") {
                    FB.api("/me", {
                        access_token: response.authResponse.accessToken,
                        fields: ["first_name", "last_name", "gender", "birthday", "email", "timezone", "locale"]
                    }, function (response) {
                        $rootScope.$apply(function () {
                            $rootScope.user = response;
                            $mdToast.show($mdToast.simple().textContent("Hello " + $rootScope.user.first_name + "!").position("top right"));
                            $log.debug("FB login", response);
                        });
                    });
                }
                else {
                    $rootScope.$apply(function () {
                        $mdToast.show($mdToast.simple().textContent("Goodbye " + $rootScope.user.first_name + "!").position("top right"));
                        delete $rootScope.user;
                        $log.debug("FB logout", response);
                    });
                }
            });
            var fbInit = {
                appId: "693765580666719",
                channelUrl: "channel.html",
                status: true,
                cookie: true,
                xfbml: true,
                version: "v2.5"
            };
            FB.init(fbInit);
            $log.debug("FB init", fbInit);
            $rootScope.login = function () { FB.login(); };
            $rootScope.logout = function () { FB.logout(); };
        };
        $log.debug("PAH running (", $locale.id, ")");
    }]);
//# sourceMappingURL=pah.js.map