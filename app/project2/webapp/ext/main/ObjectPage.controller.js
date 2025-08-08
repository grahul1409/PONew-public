sap.ui.define([
    "sap/fe/core/PageController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(PageController, MessageToast, MessageBox) {
    "use strict";

    return PageController.extend("project2.ext.main.ObjectPage", {
        onInit: function() {
            debugger;
            // Call parent onInit
            PageController.prototype.onInit.apply(this, arguments);
            
            // Get route parameters and bind context
            var oRouter = this.getAppComponent().getRouter();
            oRouter.getRoute("PurchaseOrdersObjectPage").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
            debugger;
            var sKey = oEvent.getParameter("arguments").key;
            var sPath = "/PurchaseOrders('" + sKey + "')";            
            // Bind the view to the selected PO
            var oView = this.getView();
            var oModel = oView.getModel();            
            var that = this;
            // Create binding context and bind to view
            var oBindingContext = oModel.bindContext(sPath);
            oBindingContext.requestObject().then(function(oData) {
                oView.setBindingContext(oBindingContext.getBoundContext());
                // Call _readCurrentPO after context is set
                that._readCurrentPO();
            }).catch(function(oError) {
                console.error("Error binding context:", oError);
            });
        },
        onNavBack: function() {
            var oRouter = this.getAppComponent().getRouter();
            oRouter.navTo("CustomPageRoute");
        },
        onApprove: function() {
            debugger;
            var oBindingContext = this.getView().getBindingContext();
            if (!oBindingContext) {
                MessageToast.show("No Purchase Order selected");
                return;
            }
            var oPOData = oBindingContext.getObject();
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
                        that._executeApprovalAction(oBindingContext, "approve", sPONumber);
                    }
                }
            });
        },
        onSendBack: function() {
            var oBindingContext = this.getView().getBindingContext();
            if (!oBindingContext) {
                MessageToast.show("No Purchase Order selected");
                return;
            }

            var oPOData = oBindingContext.getObject();
            var that = this;
            var sPONumber = oPOData.poNumber || "selected PO";
            
            MessageBox.confirm("Do you want to send back Purchase Order " + sPONumber + "?", {
                title: "Confirm Send Back",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function(oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        that._executeApprovalAction(oBindingContext, "sendBack", sPONumber);
                    }
                }
            });
        },
        _executeApprovalAction: function(oContext, sAction, sPONumber) {
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
        formatStatusState: function(sStatus) {
            switch (sStatus) {
                case "Approved":
                    return "Success";
                case "Rejected":
                case "Sent Back":
                    return "Error";
                case "Pending":
                    return "Warning";
                default:
                    return "None";
            }
        },
        readPO: function() {
            var oModel = this.getView().getModel();
            var oView = this.getView();
            var oCurrentContext = oView.getBindingContext();
            
            console.log("=== OData v4 Read Operations Demo ===");
            
            // Method 1: Read current Purchase Order using existing binding context
            if (oCurrentContext) {
                this._readCurrentPO(oCurrentContext);
            } else {
                console.log("No binding context available yet");
                MessageToast.show("No binding context available. Please wait for the page to load completely.");
            }
            
            // Method 2: Read specific Purchase Order by ID
            this._readPOById(oModel, "PO-001");
            
            // Method 3: Read all Purchase Orders with filtering
            this._readPOsWithFilter(oModel);
        },
        _readCurrentPO: function(oContext) {
            debugger;
            console.log("--- Method 1: Reading current PO using binding context ---");
            
            // If no context is passed, get it from the view
            if (!oContext) {
                oContext = this.getView().getBindingContext();
            }
            
            if (!oContext) {
                console.log("No binding context available");
                MessageToast.show("No binding context available");
                return;
            }
            
            // Get data synchronously from the context (if already loaded)
            var oPOData = oContext.getObject();
            console.log("Current PO (sync):", oPOData);
            
            // Request data asynchronously to ensure fresh data
            oContext.requestObject().then(function(oData) {
                console.log("Current PO (async):", oData);
                if (oData && oData.poNumber) {
                    MessageToast.show("Current PO: " + oData.poNumber + " - " + oData.vendor);
                } else {
                    MessageToast.show("PO data loaded but missing expected fields");
                }
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
        }
    });
});
