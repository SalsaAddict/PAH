/// <reference path="../typings/requirejs/require.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
var PAH;
(function (PAH) {
    "option strict";
    PAH.debugEnabled = true, PAH.angularVersion = "1.5.3", PAH.materialVersion = "1.0.7", PAH.locale = "en-us";
    var Config;
    (function (Config) {
        function cdnjs(library, version, filename) {
            return "//cdnjs.cloudflare.com/ajax/libs/" + library + "/" + version + "/" + filename;
        }
        Config.cdnjs = cdnjs;
        function angularResource(filename) {
            return cdnjs("angular.js", PAH.angularVersion, filename);
        }
        Config.angularResource = angularResource;
        function materialResource(filename) {
            return cdnjs("angular-material", PAH.materialVersion, filename);
        }
        Config.materialResource = materialResource;
    })(Config = PAH.Config || (PAH.Config = {}));
})(PAH || (PAH = {}));
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
define("pah", ["angular", "angular-route", "angular-material"], function (angular) {
    var pah = angular.module("pah", ["ngRoute", "ngMaterial"]);
    pah.config(["$logProvider", function ($logProvider) {
            $logProvider.debugEnabled(PAH.debugEnabled);
        }]);
    pah.run(["$log", "$locale", "$rootScope", function ($log, $locale, $rootScope) {
            $rootScope.materialCSS = function () {
                return PAH.Config.materialResource("angular-material.min.css");
            };
            $log.debug("PAH running (" + $locale.id + ")");
        }]);
    return pah;
});
require(["angular", "pah"], function (angular, pah) {
    angular.bootstrap(document, [pah.name]);
});
//# sourceMappingURL=main.js.map