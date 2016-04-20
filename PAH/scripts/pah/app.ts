/// <reference path="../typings/angularjs/angular.d.ts" />

module APP {
    "option strict";
    export const googleApiKey: string = "AIzaSyCtuJp3jsaJp3X6U8ZS_X5H8omiAw5QaHg";
    export module Search {
        export interface IScope extends angular.IScope { }
        export class Controller {
            static $inject: string[] = ["$scope", "$http"];
            constructor(
                private $scope: IScope,
                private $http: angular.IHttpService) { }
            step: number = 1;
            url: string = undefined;
            youTubeId = (): string => {
                if (!this.url) { return; }
                if (this.url.indexOf("://youtu.be/") >= 0) {
                    return this.url.split("://youtu.be/")[1];
                } else if (this.url.indexOf("://www.youtube.com/watch?v=") >= 0) {
                    return this.url.split("://www.youtube.com/watch?v=")[1].split("&")[0];
                }
                return;
            };
            info: any = undefined;
            getYouTubeInfo = () => {
                this.$http.get("https://www.googleapis.com/youtube/v3/videos?id=" + this.youTubeId() + "&key=" + googleApiKey + "&part=snippet")
                    .then((response: any) => {
                        this.info = undefined;
                        if (!response) { return; }
                        if (!response.data) { return; }
                        if (!response.data.items) { return; }
                        if (!response.data.items[0]) { return; }
                        if (response.data.items[0].id !== this.youTubeId()) { return; }
                        var item = response.data.items[0].snippet;
                        this.info = {
                            id: this.youTubeId(),
                            title: item.title,
                            thumbnail: item.thumbnails.medium.url
                        };
                        this.step++;
                    });
            }
        }
    }
}

var app: angular.IModule = angular.module("app", ["ngRoute", "pah"]);

app.controller("SearchController", APP.Search.Controller);

app.config(["$routeProvider", function ($routeProvider: angular.route.IRouteProvider) {
    $routeProvider
        .when("/home", { caseInsensitiveMatch: true, templateUrl: "views/home.html" })
        .when("/search", { caseInsensitiveMatch: true, templateUrl: "views/search.html", controller: "SearchController", controllerAs: "ctrl" })
        .when("/submit", { caseInsensitiveMatch: true, templateUrl: "views/submit.html" })
        .otherwise({ redirectTo: "/search" });
}]);

app.run(["$log", function ($log: angular.ILogService) {
    $log.debug("APP running");
}]);
