/// <reference path="../typings/requirejs/require.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />

module PAH {
    "option strict";
    export const
        debugEnabled: boolean = true,
        angularVersion: string = "1.5.3",
        materialVersion: string = "1.0.7",
        locale: string = "en-us";
    export module Config {
        export function cdnjs(library: string, version: string, filename: string): string {
            return "//cdnjs.cloudflare.com/ajax/libs/" + library + "/" + version + "/" + filename;
        }
        export function angularResource(filename: string): string {
            return cdnjs("angular.js", angularVersion, filename);
        }
        export function materialResource(filename: string): string {
            return cdnjs("angular-material", materialVersion, filename);
        }
    }
    export interface IRootScopeService extends angular.IRootScopeService { materialCSS: Function; }
}

require.config({
    baseUrl: "scripts",
    paths: {
        "angular": PAH.Config.angularResource("angular.min"),
        "angular-locale": PAH.Config.cdnjs("angular-i18n", PAH.angularVersion, "angular-locale_" + PAH.locale),
        "angular-route": PAH.Config.angularResource("angular-route.min"),
        "angular-animate": PAH.Config.angularResource("angular-animate.min"),
        "angular-aria": PAH.Config.angularResource("angular-aria.min"),
        "angular-messages": PAH.Config.angularResource("angular-messages.min"),
        "angular-material": PAH.Config.materialResource("angular-material.min")
    },
    shim: {
        "angular": { exports: "angular" },
        "angular-locale": { deps: ["angular"] },
        "angular-route": { deps: ["angular", "angular-locale"] },
        "angular-animate": { deps: ["angular", "angular-locale"] },
        "angular-aria": { deps: ["angular", "angular-locale"] },
        "angular-messages": { deps: ["angular", "angular-locale"] },
        "angular-material": { deps: ["angular", "angular-animate", "angular-aria", "angular-messages"] }
    }
});

define("pah", ["angular", "angular-route", "angular-material"], function (angular: angular.IAngularStatic): angular.IModule {

    var pah: angular.IModule = angular.module("pah", ["ngRoute", "ngMaterial"]);

    pah.config(["$logProvider", function ($logProvider: angular.ILogProvider) {
        $logProvider.debugEnabled(PAH.debugEnabled);
    }]);

    pah.run(["$log", "$locale", "$rootScope", function (
        $log: angular.ILogService,
        $locale: angular.ILocaleService,
        $rootScope: PAH.IRootScopeService) {
        $rootScope.materialCSS = function () {
            return PAH.Config.materialResource("angular-material.min.css");
        };
        $log.debug("PAH running (" + $locale.id + ")");
    }]);

    return pah;

});

require(["angular", "pah"], function (angular: angular.IAngularStatic, pah: angular.IModule) {

    angular.bootstrap(document, [pah.name]);

});

