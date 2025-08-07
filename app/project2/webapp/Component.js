sap.ui.define(
    ["sap/fe/core/AppComponent"],
    function (Component) {
        "use strict";

        return Component.extend("project2.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // Enable fake LREP connector for local development
                this._enableFakeLrepConnector();
                
                // call the base component's init function
                Component.prototype.init.apply(this, arguments);
            },

            /**
             * Enable FakeLrepConnectorLocalStorage for local development
             * This prevents calls to /sap/bc/lrep endpoints which don't exist in local CAP development
             * @private
             */
            _enableFakeLrepConnector: function() {
                sap.ui.require(["sap/ui/fl/FakeLrepConnectorLocalStorage"], function (FakeLrepConnectorLocalStorage) {
                    FakeLrepConnectorLocalStorage.enableFakeConnector();
                    console.log("[Local Dev] FakeLrepConnectorLocalStorage enabled - LREP calls will use localStorage");
                });
            }
        });
    }
);