sap.ui.define([
    "sap/fe/core/PageController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(PageController, MessageToast, MessageBox) {
    "use strict";

    return PageController.extend("project2.ext.main.Main", {
        onInit: function() {
            // Call parent onInit
            PageController.prototype.onInit.apply(this, arguments);
            
            // Custom initialization logic
            this._setupCustomLogic();
            this._selectedPO = null;
        },

        onRowPress: function(oEvent) {
            var oBindingContext = oEvent.getParameter("bindingContext") || oEvent.getSource().getBindingContext();
            
            if (oBindingContext) {
                this._selectedPO = oBindingContext.getObject();
                
                // Navigate to object page directly
                this._navigateToObjectPage(oBindingContext);
            }
        },

        onSelectionChange: function(oEvent) {
            var oTable = oEvent.getSource();
            var aSelectedItems = oTable.getSelectedItems();
            
            if (aSelectedItems.length > 0) {
                var oSelectedItem = aSelectedItems[0];
                var oBindingContext = oSelectedItem.getBindingContext();
                
                if (oBindingContext) {
                    this._selectedPO = oBindingContext.getObject();
                    this._showDetailsPanel(oBindingContext);
                    
                    // Navigate to object page
                    this._navigateToObjectPage(oBindingContext);
                }
            } else {
                this._hideDetailsPanel();
            }
        },

        _navigateToObjectPage: function(oBindingContext) {
            var oRouter = this.getRouter();
            var sKey = oBindingContext.getProperty("ID");
            
            if (sKey) {
                oRouter.navTo("PurchaseOrdersObjectPage", {
                    key: sKey
                });
            }
        },

        _setupCustomLogic: function() {
            // Custom setup logic
            console.log("Main page initialized");
        }
    });
});