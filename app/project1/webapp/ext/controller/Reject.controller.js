sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/library"
], function (ControllerExtension, JSONModel, Fragment, MessageToast, MessageBox, mLibrary) {
    "use strict";

    const { ButtonType } = mLibrary;

    return ControllerExtension.extend("project1.ext.controller.Reject", {        
        override: {
            onInit: function () {
                // Call the original onInit first
                if (this.base.onInit) {
                    this.base.onInit.apply(this, arguments);
                }
            },
            
            onAfterRendering: function () {
                // Call the original onAfterRendering first
                if (this.base.onAfterRendering) {
                    this.base.onAfterRendering.apply(this, arguments);
                }
                
                // Set the button type programmatically
                this._setCustomButtonType();
            }
        },

        _setCustomButtonType: function () {
            try {
                // Set custom button type
                var oCustomButton = this._getUserInfoButton();
                if (oCustomButton) {
                    oCustomButton.setType(ButtonType.Reject);
                }
                
                // Set Send Back button type to Emphasized
                var oSendBackButton = this._getSendBackButton();
                if (oSendBackButton) {
                    oSendBackButton.setType(ButtonType.Emphasized);
                }
            } catch (error) {
                console.log("Could not set button type:", error);
            }
        }
    });
});