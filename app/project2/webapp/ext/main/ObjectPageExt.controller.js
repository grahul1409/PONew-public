sap.ui.define([
    "sap.ui.core.mvc.ControllerExtension",
    "sap.m.MessageBox",
    "sap.m.MessageToast"
], function (ControllerExtension, MessageBox, MessageToast) {
    "use strict";

    return ControllerExtension.extend("project2.ext.main.ObjectPageExt", {
        
        override: {
            onInit: function () {
                // Call the base implementation
                this.base.onInit.apply(this, arguments);
            },

            routing: {
                onBeforeBinding: function (oBindingContext) {
                    // Override the extension API when context is available
                    var oExtensionAPI = this.base.getExtensionAPI();
                    if (oExtensionAPI && oExtensionAPI.invokeAction) {
                        this._overrideInvokeAction(oExtensionAPI);
                    }
                }
            }
        },


        _overrideInvokeAction: function (oExtensionAPI) {
            debugger;
            var that = this;
            var fnOriginalInvokeAction = oExtensionAPI.invokeAction.bind(oExtensionAPI);
            
            oExtensionAPI.invokeAction = function (sActionName, aContexts, mParameters) {
                debugger;
                if (sActionName === "POApprovalService.approve") {
                    return that._showCustomConfirmation(
                        "Do you want to approve the Purchase Order?",
                        "Confirm Approval",
                        function () {
                            return fnOriginalInvokeAction(sActionName, aContexts, mParameters);
                        }
                    );
                } else if (sActionName === "POApprovalService.sendBack") {
                    return that._showCustomConfirmation(
                        "Do you want to send back the Purchase Order?",
                        "Confirm Send Back",
                        function () {
                            return fnOriginalInvokeAction(sActionName, aContexts, mParameters);
                        }
                    );
                } else {
                    return fnOriginalInvokeAction(sActionName, aContexts, mParameters);
                }
            };
        },

        _showCustomConfirmation: function (sMessage, sTitle, fnAction) {
            debugger;
            return new Promise(function (resolve, reject) {
                MessageBox.confirm(sMessage, {
                    title: sTitle,
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            fnAction().then(resolve).catch(reject);
                        } else {
                            reject(new Error("Action cancelled by user"));
                        }
                    }
                });
            });
        },

        _executeApprovalAction: function(oContext, sAction, sPONumber) {
            debugger;
            var that = this;
            var oModel = this.base.getView().getModel();
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

        /**
         * Demonstrates various OData v4 read operations for Purchase Orders
         * This function shows different ways to read data using the OData v4 model
         */
        readPO: function() {
            var oModel = this.base.getView().getModel();
            var oView = this.base.getView();
            var oCurrentContext = oView.getBindingContext();
            
            console.log("=== OData v4 Read Operations Demo ===");
            
            // Method 1: Read current Purchase Order using existing binding context
            if (oCurrentContext) {
                this._readCurrentPO(oCurrentContext);
            }
            
            // Method 2: Read specific Purchase Order by ID
            this._readPOById(oModel, "PO-001");
            
            // Method 3: Read all Purchase Orders with filtering
            this._readPOsWithFilter(oModel);
            
            // Method 4: Read Purchase Order with expanded items
            this._readPOWithItems(oModel, "PO-001");
            
            // Method 5: Read using OData query options
            this._readPOsWithQueryOptions(oModel);
        },

        /**
         * Method 1: Read current Purchase Order using existing binding context
         */
        _readCurrentPO: function(oContext) {
            console.log("--- Method 1: Reading current PO using binding context ---");
            
            // Get data synchronously from the context (if already loaded)
            var oPOData = oContext.getObject();
            console.log("Current PO (sync):", oPOData);
            
            // Request data asynchronously to ensure fresh data
            oContext.requestObject().then(function(oData) {
                console.log("Current PO (async):", oData);
                MessageToast.show("Current PO: " + oData.poNumber + " - " + oData.vendor);
            }).catch(function(oError) {
                console.error("Error reading current PO:", oError);
                MessageBox.error("Failed to read current Purchase Order: " + oError.message);
            });
        },

        /**
         * Method 2: Read specific Purchase Order by ID
         */
        _readPOById: function(oModel, sPOId) {
            console.log("--- Method 2: Reading PO by ID ---");
            
            var sPath = "/PurchaseOrders('" + sPOId + "')";
            var oContext = oModel.bindContext(sPath);
            
            oContext.requestObject().then(function(oData) {
                console.log("PO by ID (" + sPOId + "):", oData);
                if (oData) {
                    MessageToast.show("Read PO by ID: " + oData.poNumber + " - Amount: " + oData.amount + " " + oData.currency);
                } else {
                    MessageToast.show("PO with ID " + sPOId + " not found");
                }
            }).catch(function(oError) {
                console.error("Error reading PO by ID:", oError);
                MessageBox.error("Failed to read PO by ID: " + oError.message);
            });
        },

        /**
         * Method 3: Read all Purchase Orders with filtering
         */
        _readPOsWithFilter: function(oModel) {
            console.log("--- Method 3: Reading POs with filter ---");
            
            var oListBinding = oModel.bindList("/PurchaseOrders", null, null, [
                new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Pending Approval")
            ]);
            
            oListBinding.requestContexts().then(function(aContexts) {
                console.log("Filtered POs (Pending Approval):", aContexts.length + " records");
                
                var aPendingPOs = [];
                aContexts.forEach(function(oContext) {
                    var oData = oContext.getObject();
                    aPendingPOs.push(oData.poNumber + " - " + oData.vendor);
                });
                
                if (aPendingPOs.length > 0) {
                    MessageToast.show("Found " + aPendingPOs.length + " pending POs: " + aPendingPOs.join(", "));
                } else {
                    MessageToast.show("No pending Purchase Orders found");
                }
            }).catch(function(oError) {
                console.error("Error reading filtered POs:", oError);
                MessageBox.error("Failed to read filtered POs: " + oError.message);
            });
        },

        /**
         * Method 4: Read Purchase Order with expanded items
         */
        _readPOWithItems: function(oModel, sPOId) {
            console.log("--- Method 4: Reading PO with expanded items ---");
            
            var sPath = "/PurchaseOrders('" + sPOId + "')";
            var oContext = oModel.bindContext(sPath, null, {
                $expand: "items"
            });
            
            oContext.requestObject().then(function(oData) {
                console.log("PO with items:", oData);
                
                if (oData) {
                    var sMessage = "PO: " + oData.poNumber + " has " + (oData.items ? oData.items.length : 0) + " items";
                    MessageToast.show(sMessage);
                    
                    if (oData.items && oData.items.length > 0) {
                        console.log("PO Items:", oData.items);
                    }
                } else {
                    MessageToast.show("PO with ID " + sPOId + " not found");
                }
            }).catch(function(oError) {
                console.error("Error reading PO with items:", oError);
                MessageBox.error("Failed to read PO with items: " + oError.message);
            });
        },

        /**
         * Method 5: Read Purchase Orders with various query options
         */
        _readPOsWithQueryOptions: function(oModel) {
            console.log("--- Method 5: Reading POs with query options ---");
            
            var oListBinding = oModel.bindList("/PurchaseOrders", null, null, null, {
                $select: "ID,poNumber,vendor,amount,currency,status",
                $orderby: "amount desc",
                $top: 5
            });
            
            oListBinding.requestContexts().then(function(aContexts) {
                console.log("Top 5 POs by amount:", aContexts.length + " records");
                
                var aTopPOs = [];
                aContexts.forEach(function(oContext) {
                    var oData = oContext.getObject();
                    aTopPOs.push(oData.poNumber + " - " + oData.amount + " " + oData.currency);
                });
                
                if (aTopPOs.length > 0) {
                    MessageToast.show("Top POs by amount: " + aTopPOs.join(", "));
                    console.log("Detailed data:", aContexts.map(function(ctx) { return ctx.getObject(); }));
                } else {
                    MessageToast.show("No Purchase Orders found");
                }
            }).catch(function(oError) {
                console.error("Error reading POs with query options:", oError);
                MessageBox.error("Failed to read POs with query options: " + oError.message);
            });
        }
    });
});