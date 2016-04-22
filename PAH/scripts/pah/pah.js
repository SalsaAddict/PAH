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
                _this.$mdToast.show(_this.$mdToast.simple()
                    .textContent(message)
                    .position("top right"));
            };
        }
        Service.$inject = ["$parse", "$http", "$mdToast", "$mdSidenav", "$log"];
        return Service;
    }());
    PAH.Service = Service;
    var Procedure;
    (function (Procedure) {
        var Service = (function () {
            function Service($http, $parse, $pah, $log) {
                var _this = this;
                this.$http = $http;
                this.$parse = $parse;
                this.$pah = $pah;
                this.$log = $log;
                this.execute = function (procedure, $scope, expression) {
                    var nonQuery = ($scope) ? false : true;
                    procedure.nonQuery = nonQuery;
                    return _this.$http.post("/execute.ashx", procedure)
                        .then(function (response) {
                        if (response.data.success) {
                            if (!nonQuery) {
                                _this.$parse(IfBlank(expression, procedure.name))
                                    .assign($scope, response.data.data);
                            }
                        }
                        else {
                            var error = IfBlank(response.data.error, "Unknown Error");
                            if (error.substr(0, 4) === "pah:") {
                                _this.$pah.toast(error.substr(5));
                            }
                            else {
                                _this.$pah.toast("An unknown error occurred");
                                _this.$log.debug(error);
                            }
                        }
                    });
                };
            }
            Service.$inject = ["$http", "$parse", "$pah", "$log"];
            return Service;
        }());
        Procedure.Service = Service;
    })(Procedure = PAH.Procedure || (PAH.Procedure = {}));
})(PAH || (PAH = {}));
var pah = angular.module("pah", ["ngRoute", "ngMaterial"]);
pah.service("$pah", PAH.Service);
pah.service("$procedure", PAH.Procedure.Service);
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
