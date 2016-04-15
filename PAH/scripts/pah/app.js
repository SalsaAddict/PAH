/// <reference path="../typings/angularjs/angular.d.ts" />
var app = angular.module("app", ["ngRoute", "pah"]);
app.run(["$log", function ($log) {
        $log.debug("APP running");
    }]);
//# sourceMappingURL=app.js.map