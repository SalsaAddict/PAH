/// <reference path="../typings/angularjs/angular.d.ts" />
var PAH;
(function (PAH) {
    "option strict";
    var Service = (function () {
        function Service($mdToast, $mdSidenav, $log) {
            var _this = this;
            this.$mdToast = $mdToast;
            this.$mdSidenav = $mdSidenav;
            this.$log = $log;
            this.user = undefined;
            this.login = function () { FB.login(); };
            this.logout = function () { FB.logout(); };
            this.toggleMenu = function () {
                _this.$mdSidenav("left").toggle();
                _this.$log.debug("PAH toggleMenu");
            };
            this.toast = function (message) {
                _this.$mdToast.show(_this.$mdToast.simple().textContent(message).position("top right"));
            };
        }
        Service.$inject = ["$mdToast", "$mdSidenav", "$log"];
        return Service;
    }());
    PAH.Service = Service;
})(PAH || (PAH = {}));
var pah = angular.module("pah", ["ngRoute", "ngMaterial"]);
pah.service("$pah", PAH.Service);
pah.config(["$logProvider", "$mdThemingProvider", function ($logProvider, $mdThemingProvider) {
        $logProvider.debugEnabled(document.getElementById("pahScript").getAttribute("data-debug") === "true");
        $mdThemingProvider.theme("default")
            .primaryPalette("blue")
            .accentPalette("teal")
            .warnPalette("red")
            .backgroundPalette("grey");
    }]);
pah.run(["$window", "$rootScope", "$locale", "$pah", "$mdSidenav", "$log", function ($window, $rootScope, $locale, $pah, $mdSidenav, $log) {
        $rootScope.$pah = $pah;
        $window.fbAsyncInit = function () {
            FB.Event.subscribe("auth.authResponseChange", function (response) {
                if (response.status === "connected") {
                    FB.api("/me", {
                        access_token: response.authResponse.accessToken,
                        fields: ["id", "name", "first_name", "last_name", "gender", "birthday", "email", "timezone", "locale"]
                    }, function (response) {
                        $rootScope.$apply(function () {
                            $pah.user = response;
                            $pah.toast("Hello " + $pah.user.first_name + "!");
                            $log.debug("FB login", response);
                        });
                    });
                }
                else {
                    $rootScope.$apply(function () {
                        $pah.toast("Goodbye " + $pah.user.first_name + "!");
                        delete $pah.user;
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
        };
        $log.debug("PAH running (", $locale.id, ")");
    }]);
//# sourceMappingURL=pah.js.map