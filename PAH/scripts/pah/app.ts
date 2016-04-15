/// <reference path="../typings/angularjs/angular.d.ts" />

var app: angular.IModule = angular.module("app", ["ngRoute", "pah"]);

app.run(["$log", function ($log: angular.ILogService) {
    $log.debug("APP running");
}]);