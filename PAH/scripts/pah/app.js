/// <reference path="../typings/angularjs/angular.d.ts" />
var APP;
(function (APP) {
    "option strict";
    APP.googleApiKey = "AIzaSyCtuJp3jsaJp3X6U8ZS_X5H8omiAw5QaHg";
    var Search;
    (function (Search) {
        var Controller = (function () {
            function Controller($scope, $http) {
                var _this = this;
                this.$scope = $scope;
                this.$http = $http;
                this.step = 1;
                this.url = undefined;
                this.youTubeId = function () {
                    if (!_this.url) {
                        return;
                    }
                    if (_this.url.indexOf("://youtu.be/") >= 0) {
                        return _this.url.split("://youtu.be/")[1];
                    }
                    else if (_this.url.indexOf("://www.youtube.com/watch?v=") >= 0) {
                        return _this.url.split("://www.youtube.com/watch?v=")[1].split("&")[0];
                    }
                    return;
                };
                this.info = undefined;
                this.getYouTubeInfo = function () {
                    _this.$http.get("https://www.googleapis.com/youtube/v3/videos?id=" + _this.youTubeId() + "&key=" + APP.googleApiKey + "&part=snippet")
                        .then(function (response) {
                        _this.info = undefined;
                        if (!response) {
                            return;
                        }
                        if (!response.data) {
                            return;
                        }
                        if (!response.data.items) {
                            return;
                        }
                        if (!response.data.items[0]) {
                            return;
                        }
                        if (response.data.items[0].id !== _this.youTubeId()) {
                            return;
                        }
                        var item = response.data.items[0].snippet;
                        _this.info = {
                            id: _this.youTubeId(),
                            title: item.title,
                            thumbnail: item.thumbnails.medium.url
                        };
                        _this.step++;
                    });
                };
            }
            Controller.$inject = ["$scope", "$http"];
            return Controller;
        }());
        Search.Controller = Controller;
    })(Search = APP.Search || (APP.Search = {}));
})(APP || (APP = {}));
var app = angular.module("app", ["ngRoute", "pah"]);
app.controller("SearchController", APP.Search.Controller);
app.config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when("/home", { caseInsensitiveMatch: true, templateUrl: "views/home.html" })
            .when("/search", { caseInsensitiveMatch: true, templateUrl: "views/search.html", controller: "SearchController", controllerAs: "ctrl" })
            .when("/submit", { caseInsensitiveMatch: true, templateUrl: "views/submit.html" })
            .otherwise({ redirectTo: "/search" });
    }]);
app.run(["$log", function ($log) {
        $log.debug("APP running");
    }]);
//# sourceMappingURL=app.js.map