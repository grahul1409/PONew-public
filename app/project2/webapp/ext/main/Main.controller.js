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
            debugger;
            var oBindingContext = oEvent.getParameter("bindingContext") || oEvent.getSource().getBindingContext();
            
            if (oBindingContext) {
                this._selectedPO = oBindingContext.getObject();
                
                // Navigate to object page directly without showing details panel
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

        onTableRefresh: function(oEvent) {
            // Custom logic before table refresh
            MessageToast.show("Refreshing Purchase Orders...");
        },

        onRefresh: function() {
            // Custom refresh logic
            var oTable = this.byId("purchaseOrdersTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.refresh();
                MessageToast.show("Table refreshed");
            }
        },

        onSearch: function(oEvent) {
            // Handle search from smart filter bar
            var oSmartTable = this.byId("purchaseOrdersTable");
            if (oSmartTable) {
                oSmartTable.rebindTable();
            }
        },

        onFilterChange: function(oEvent) {
            // Handle filter changes
            var oSmartTable = this.byId("purchaseOrdersTable");
            if (oSmartTable) {
                oSmartTable.rebindTable();
            }
        },

        onApprove: function() {
            if (!this._selectedPO) {
                MessageToast.show("Please select a Purchase Order first");
                return;
            }

            var that = this;
            var sPONumber = this._selectedPO.poNumber || "selected PO";
            var sVendor = this._selectedPO.vendor || "";
            var sAmount = this._selectedPO.amount || "";
            var sCurrency = this._selectedPO.currency || "";
            
            var sMessage = "Do you want to approve Purchase Order " + sPONumber + "?";
            if (sVendor) {
                sMessage += "\n\nVendor: " + sVendor;
            }
            if (sAmount && sCurrency) {
                sMessage += "\nAmount: " + sAmount + " " + sCurrency;
            }
            
            MessageBox.confirm(sMessage, {
                title: "Confirm Purchase Order Approval",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function(oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        that._executeApprovalAction("approve", sPONumber);
                    }
                }
            });
        },

        onSendBack: function() {
            if (!this._selectedPO) {
                MessageToast.show("Please select a Purchase Order first");
                return;
            }

            var that = this;
            var sPONumber = this._selectedPO.poNumber || "selected PO";
            
            MessageBox.confirm("Do you want to send back Purchase Order " + sPONumber + "?", {
                title: "Confirm Send Back",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function(oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        that._executeApprovalAction("sendBack", sPONumber);
                    }
                }
            });
        },

        onCustomAction: function() {
            // Access extension API
            const extensionAPI = this.getExtensionAPI();
            
            // Use editFlow for CRUD operations
            if (this._selectedPO) {
                MessageToast.show("Custom action executed for PO: " + this._selectedPO.poNumber);
            } else {
                MessageToast.show("Custom action executed - No PO selected");
            }
        },

        // Override the default approve action with custom confirmation popup (for Object Page)
        onApproveAction: function(oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            if (!oContext) {
                MessageToast.show("No Purchase Order selected");
                return;
            }

            var oPOData = oContext.getObject();
            var that = this;
            
            var sPONumber = oPOData.poNumber || "selected PO";
            var sVendor = oPOData.vendor || "";
            var sAmount = oPOData.amount || "";
            var sCurrency = oPOData.currency || "";
            
            var sMessage = "Do you want to approve Purchase Order " + sPONumber + "?";
            if (sVendor) {
                sMessage += "\n\nVendor: " + sVendor;
            }
            if (sAmount && sCurrency) {
                sMessage += "\nAmount: " + sAmount + " " + sCurrency;
            }
            
            MessageBox.confirm(sMessage, {
                title: "Confirm Purchase Order Approval",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function(oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        that._executeApprovalActionFromContext(oContext, "approve", sPONumber);
                    }
                }
            });
        },

        // Override the default send back action with custom confirmation popup (for Object Page)
        onSendBackAction: function(oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            if (!oContext) {
                MessageToast.show("No Purchase Order selected");
                return;
            }

            var oPOData = oContext.getObject();
            var that = this;
            var sPONumber = oPOData.poNumber || "selected PO";
            
            MessageBox.confirm("Do you want to send back Purchase Order " + sPONumber + "?", {
                title: "Confirm Send Back",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function(oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        that._executeApprovalActionFromContext(oContext, "sendBack", sPONumber);
                    }
                }
            });
        },

        _setupCustomLogic: function() {
            // Custom business logic initialization
            MessageToast.show("Custom Page Initialized");
        },

        _showDetailsPanel: function(oBindingContext) {
            var oDetailsPanel = this.byId("detailsPanel");
            var oGeneralInfoForm = this.byId("generalInfoForm");
            var oPOItemsTable = this.byId("poItemsTable");
            var oVendorField = this.byId("vendorField");
            var oPONumberField = this.byId("poNumberField");
            
            // Set binding context for details
            oDetailsPanel.setBindingContext(oBindingContext);
            oGeneralInfoForm.setBindingContext(oBindingContext);
            oPOItemsTable.setBindingContext(oBindingContext);
            oVendorField.setBindingContext(oBindingContext);
            oPONumberField.setBindingContext(oBindingContext);
            
            // Show the details panel
            oDetailsPanel.setVisible(true);
        },

        _hideDetailsPanel: function() {
            var oDetailsPanel = this.byId("detailsPanel");
            oDetailsPanel.setVisible(false);
            this._selectedPO = null;
        },

        _navigateToObjectPage: function(oBindingContext) {
            // Navigate to object page using the extension API
            var sKey = oBindingContext.getObject().ID;
            var oRouter = this.getAppComponent().getRouter();
            
            oRouter.navTo("PurchaseOrdersObjectPage", {
                key: sKey
            });
        },

        _executeApprovalAction: function(sAction, sPONumber) {
            var that = this;
            var oModel = this.getModel();
            var sPath = "/PurchaseOrders(" + this._selectedPO.ID + ")/" + sAction;
            
            // Create operation context
            var oOperationContext = oModel.bindContext(sPath);
            
            oOperationContext.execute().then(function() {
                var sMessage = sAction === "approve" ? 
                    "Purchase Order " + sPONumber + " has been approved successfully." :
                    "Purchase Order " + sPONumber + " has been sent back successfully.";
                
                MessageToast.show(sMessage);
                
                // Refresh the table to show updated status
                that._refreshTable();
                
                // Update the details panel
                that._refreshDetailsPanel();
                
            }).catch(function(oError) {
                var sErrorMessage = sAction === "approve" ? "Approval failed: " : "Send back failed: ";
                MessageBox.error(sErrorMessage + (oError.message || "Unknown error"));
            });
        },

        _executeApprovalActionFromContext: function(oContext, sAction, sPONumber) {
            var that = this;
            var oModel = this.getView().getModel();
            var sPath = oContext.getPath() + "/" + sAction;
            
            // Create operation context
            var oOperationContext = oModel.bindContext(sPath);
            
            oOperationContext.execute().then(function() {
                var sMessage = sAction === "approve" ? 
                    "Purchase Order " + sPONumber + " has been approved successfully." :
                    "Purchase Order " + sPONumber + " has been sent back successfully.";
                
                MessageToast.show(sMessage);
                
                // Refresh the context to show updated status
                oContext.refresh();
                
            }).catch(function(oError) {
                var sErrorMessage = sAction === "approve" ? "Approval failed: " : "Send back failed: ";
                MessageBox.error(sErrorMessage + (oError.message || "Unknown error"));
            });
        },

        _refreshTable: function() {
            var oTable = this.byId("purchaseOrdersTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.refresh();
            }
        },

        _refreshDetailsPanel: function() {
            var oDetailsPanel = this.byId("detailsPanel");
            var oBindingContext = oDetailsPanel.getBindingContext();
            if (oBindingContext) {
                oBindingContext.refresh();
            }
        },

        // Custom reset functionality for local development environment
        onResetPersonalization: function() {
            try {
                var oTable = this.byId("purchaseOrdersTable");
                if (oTable) {
                    this._resetTableToDefault(oTable);
                    MessageToast.show("Table personalization reset successfully");
                } else {
                    MessageToast.show("Table not found for reset");
                }
            } catch (error) {
                console.warn("Reset personalization error:", error);
                MessageToast.show("Reset completed (local development mode)");
            }
        },

        _resetTableToDefault: function(oTable) {
            try {
                // Clear any stored personalization from browser storage
                var sTableId = oTable.getId();
                if (window.localStorage) {
                    var aKeysToRemove = [];
                    for (var i = 0; i < window.localStorage.length; i++) {
                        var sKey = window.localStorage.key(i);
                        if (sKey && (sKey.includes(sTableId) || sKey.includes("sap.ui.table") || sKey.includes("personalization"))) {
                            aKeysToRemove.push(sKey);
                        }
                    }
                    aKeysToRemove.forEach(function(sKey) {
                        window.localStorage.removeItem(sKey);
                        console.log("Removed personalization key:", sKey);
                    });
                }

                // Refresh the table binding to reset data
                var oBinding = oTable.getBinding && oTable.getBinding("items");
                if (oBinding) {
                    oBinding.refresh();
                }

                // Force table refresh by invalidating and rerendering
                oTable.invalidate();
                
            } catch (error) {
                console.warn("Error resetting table:", error);
            }
        }
    });
});
