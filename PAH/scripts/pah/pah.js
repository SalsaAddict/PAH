/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-material/angular-material.d.ts" />
var PAH;
(function (PAH) {
    "option strict";
    function IsBlank(expression) {
        if (expression === undefined) {
            return true;
        }
        if (expression === null) {
            return true;
        }
        if (expression === NaN) {
            return true;
        }
        if (expression === {}) {
            return true;
        }
        if (expression === []) {
            return true;
        }
        if (String(expression).trim().length === 0) {
            return true;
        }
        return false;
    }
    PAH.IsBlank = IsBlank;
    function IfBlank(expression, defaultValue) {
        if (defaultValue === void 0) { defaultValue = undefined; }
        return (IsBlank(expression)) ? defaultValue : expression;
    }
    PAH.IfBlank = IfBlank;
    var Service = (function () {
        function Service($parse, $http, $mdToast, $mdSidenav, $log) {
            var _this = this;
            this.$parse = $parse;
            this.$http = $http;
            this.$mdToast = $mdToast;
            this.$mdSidenav = $mdSidenav;
            this.$log = $log;
            this.user = undefined;
            this.login = function () { FB.login(null, { scope: "user_friends" }); };
            this.logout = function () { FB.logout(); };
            this.toggleMenu = function () {
                _this.$mdSidenav("left").toggle();
                _this.$log.debug("PAH toggleMenu");
            };
            this.toast = function (message) {
                _this.$mdToast.show(_this.$mdToast.simple().textContent(message).position("top right"));
            };
            this.execute = function (procedure, $scope, expression) {
                return _this.$http.post("/execute.ashx", procedure).then(function (response) {
                    _this.$log.debug(response);
                    if (response.data.success) {
                        if (!IsBlank($scope)) {
                            _this.$parse(IfBlank(expression, procedure.name)).assign($scope, response.data.data);
                        }
                        return response.data.data;
                    }
                    else {
                        var message = IfBlank(response.data.error, "Unexpected Error");
                        if (message.substr(0, 4) === "pah:") {
                            _this.toast(message.substr(5));
                        }
                        else {
                            _this.toast("An unexpected error occurred");
                            _this.$log.debug("PAH execute error:", procedure.name, message);
                        }
                        return;
                    }
                });
            };
        }
        Service.$inject = ["$parse", "$http", "$mdToast", "$mdSidenav", "$log"];
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
            FB.Event.subscribe("auth.authResponseChange", function (authResponse) {
                if (authResponse.status === "connected") {
                    FB.api("/me", {
                        access_token: authResponse.authResponse.accessToken,
                        fields: ["id", "name", "first_name", "last_name", "gender", "birthday", "email", "timezone", "locale"]
                    }, function (apiResponse) {
                        $rootScope.$apply(function () {
                            $pah.user = apiResponse;
                            $pah.toast("Hello " + $pah.user.first_name + "!");
                            $log.debug("FB login", apiResponse);
                            FB.api("/me/friends", {
                                access_token: authResponse.authResponse.accessToken,
                                fields: ["id"]
                            }, function (apiResponse) {
                                $rootScope.$apply(function () {
                                    $pah.user.friends = apiResponse;
                                    $log.debug("FB login", apiResponse);
                                });
                            });
                        });
                    });
                }
                else {
                    $rootScope.$apply(function () {
                        $pah.toast("Goodbye " + $pah.user.first_name + "!");
                        delete $pah.user;
                        $log.debug("FB logout", authResponse);
                    });
                }
            });
            var fbInit = {
                appId: "1376598962611648",
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
