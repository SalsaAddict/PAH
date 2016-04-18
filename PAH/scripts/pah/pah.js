/// <reference path="../typings/angularjs/angular.d.ts" />
var PAH;
(function (PAH) {
    "option strict";
    var Toast;
    (function (Toast) {
        var Service = (function () {
            function Service($mdToast) {
                var _this = this;
                this.$mdToast = $mdToast;
                this.showSimple = function (message) {
                    _this.$mdToast.show(_this.$mdToast.simple().textContent(message).position("top right"));
                };
            }
            Service.$inject = ["$mdToast"];
            return Service;
        })();
        Toast.Service = Service;
    })(Toast = PAH.Toast || (PAH.Toast = {}));
})(PAH || (PAH = {}));
var pah = angular.module("pah", ["ngRoute", "ngMaterial"]);
pah.service("$pahToast", PAH.Toast.Service);
pah.config(["$logProvider", function ($logProvider) {
        $logProvider.debugEnabled(document.getElementById("pahScript").getAttribute("data-debug") === "true");
    }]);
pah.run(["$window", "$rootScope", "$locale", "$pahToast", "$log", function ($window, $rootScope, $locale, $pahToast, $log) {
        $window.fbAsyncInit = function () {
            FB.Event.subscribe("auth.authResponseChange", function (response) {
                if (response.status === "connected") {
                    FB.api("/me", {
                        access_token: response.authResponse.accessToken,
                        fields: ["first_name", "last_name", "gender", "birthday", "email", "timezone", "locale"]
                    }, function (response) {
                        $rootScope.$apply(function () {
                            $rootScope.user = response;
                            $pahToast.showSimple("Hello " + $rootScope.user.first_name + "!");
                            $log.debug("FB login", response);
                        });
                    });
                }
                else {
                    $rootScope.$apply(function () {
                        $pahToast.showSimple("Goodbye " + $rootScope.user.first_name + "!");
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