sap.ui.define([
    "sap/fe/core/PageController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(PageController, MessageToast, MessageBox) {
    "use strict";

    return PageController.extend("project2.ext.main.ObjectPage", {
        onInit: function() {
            // Call parent onInit
            PageController.prototype.onInit.apply(this, arguments);
        },

        onApprove: function() {
            var oBindingContext = this.getView().getBindingContext();
            if (!oBindingContext) {
                MessageToast.show("No purchase order selected");
                return;
            }

            var that = this;
            MessageBox.confirm("Do you want to approve this Purchase Order?", {
                onClose: function(sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        that._executeAction(oBindingContext, "approve");
                    }
                }
            });
        },

        onSendBack: function() {
            var oBindingContext = this.getView().getBindingContext();
            if (!oBindingContext) {
                MessageToast.show("No purchase order selected");
                return;
            }

            var that = this;
            MessageBox.confirm("Do you want to send back this Purchase Order?", {
                onClose: function(sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        that._executeAction(oBindingContext, "sendBack");
                    }
                }
            });
        },

        _executeAction: function(oBindingContext, sAction) {
            var oModel = this.getView().getModel();
            var sPath = oBindingContext.getPath();
            
            oModel.callFunction("/" + sAction, {
                method: "POST",
                urlParameters: {
                    ID: oBindingContext.getProperty("ID")
                },
                success: function(oData) {
                    MessageToast.show("Action executed successfully");
                    oModel.refresh();
                },
                error: function(oError) {
                    MessageBox.error("Error executing action: " + oError.message);
                }
            });
        }
    });
});