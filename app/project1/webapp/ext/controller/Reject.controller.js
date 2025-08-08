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
        },

        _getUserInfoButton: function () {
            // Try to find the button by searching for it in the view
            var oView = this.base.getView();
            var aButtons = [];
            
            // Search for buttons in the view
            oView.findAggregatedObjects(true, function (oControl) {
                if (oControl.isA && oControl.isA("sap.m.Button")) {
                    aButtons.push(oControl);
                }
                return false;
            });
            
            // Find our custom button by text
            for (var i = 0; i < aButtons.length; i++) {
                if (aButtons[i].getText() === "Reject") {
                    return aButtons[i];
                }
            }
            
            return null;
        },

        _getSendBackButton: function () {
            // Try to find the Send Back button by searching for it in the view
            var oView = this.base.getView();
            var aButtons = [];
            
            // Search for buttons in the view
            oView.findAggregatedObjects(true, function (oControl) {
                if (oControl.isA && oControl.isA("sap.m.Button")) {
                    aButtons.push(oControl);
                }
                return false;
            });
            
            // Find the Send Back button by text
            for (var i = 0; i < aButtons.length; i++) {
                if (aButtons[i].getText() === "Send Back") {
                    return aButtons[i];
                }
            }
            
            return null;
        },

        onShowUserInfo: function () {
           var that = this;
           
           // Show confirmation dialog
           MessageBox.confirm("Do you want to reject this Purchase Order item?", {
               title: "Confirm Rejection",
               actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
               emphasizedAction: MessageBox.Action.OK,
               onClose: function (oAction) {
                   if (oAction === MessageBox.Action.OK) {
                       // Handle the actual rejection logic here
                       MessageToast.show("Purchase Order item has been rejected");
                       
                       // Add your rejection logic here - call backend service, update model, etc.
                       // Example:
                       // var oContext = that.getView().getBindingContext();
                       // var oModel = that.getView().getModel();
                       // ... perform rejection action
                   }
               }
           });
       },
       onFilterMyPOs: function () {
        debugger;
            // Get the List Report extension API
            var oExtensionAPI = this.base.getExtensionAPI();
            
            // Set filter for current user
            var aFilters = [{
                sPath: "user",
                sOperator: "EQ",
                oValue1: "rahul.girmaji@consultsda.com"
            }];
            
            // Apply the filter
            oExtensionAPI.setFilterValues(aFilters);
        }

    });
});
