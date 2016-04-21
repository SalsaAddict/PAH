/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />

module APP {
    "option strict";
    export const googleApiKey: string = "AIzaSyCtuJp3jsaJp3X6U8ZS_X5H8omiAw5QaHg";
    export module Home {
        export interface IScope extends angular.IScope { data: any; }
        export class Controller {
            static $inject: string[] = ["$scope", "$pah", "$log"];
            constructor(
                private $scope: IScope,
                private $pah: PAH.Service,
                private $log: angular.ILogService) {
                $pah.execute({ name: "apiGenres", nonQuery: false }).then((response: any) => {
                    this.$scope.data = response.data;
                    this.$log.debug(Object.getOwnPropertyNames(response.data.data));
                });
            }
        }
    }
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

app.controller("HomeController", APP.Home.Controller);
app.controller("SearchController", APP.Search.Controller);

app.config(["$routeProvider", function ($routeProvider: angular.route.IRouteProvider) {
    var createRoute = function (path: string, templateUrl: string, controller?: string, controllerAs?: string) {
        $routeProvider.when(path, { caseInsensitiveMatch: true, templateUrl: templateUrl, controller: controller, controllerAs: controllerAs });
    }
    createRoute("/home", "views/home.html", "HomeController", "ctrl");
    createRoute("/search", "views/search.html", "SearchController", "ctrl");
    $routeProvider.otherwise({ redirectTo: "/home" });
}]);

app.run(["$log", function ($log: angular.ILogService) {
    $log.debug("APP running");
}]);
