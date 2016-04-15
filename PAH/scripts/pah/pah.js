/// <reference path="../typings/angularjs/angular.d.ts" />
var PAH;
(function (PAH) {
    "option strict";
})(PAH || (PAH = {}));
var pah = angular.module("pah", ["ngRoute", "ngMaterial"]);
pah.config(["$logProvider", function ($logProvider) {
        $logProvider.debugEnabled(document.getElementById("pahScript").getAttribute("data-debug") === "true");
    }]);
pah.run(["$window", "$rootScope", "$locale", "$log", function ($window, $rootScope, $locale, $log) {
        $window.fbAsyncInit = function () {
            FB.Event.subscribe("auth.authResponseChange", function (response) {
                if (response.status === "connected") {
                    FB.api("/me", { access_token: response.authResponse.accessToken }, function (response) {
                        $rootScope.$apply(function () {
                            $rootScope.user = response;
                            $log.debug("FB login");
                        });
                    });
                }
                else {
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
            $rootScope.login = function () { FB.login(); };
            $rootScope.logout = function () { FB.logout(); };
            $log.debug("FB init");
        };
        $log.debug("PAH running (" + $locale.id + ")");
    }]);
//# sourceMappingURL=pah.js.map