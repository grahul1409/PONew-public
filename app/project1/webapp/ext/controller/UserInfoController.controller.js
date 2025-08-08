sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (ControllerExtension, MessageBox, Filter, FilterOperator) {
    "use strict";

    return ControllerExtension.extend("project1.ext.controller.UserInfoController", {
        // this section allows to extend lifecycle hooks or override public methods of the base controller
        override: {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf project1.ext.controller.UserInfoController
             */
            onInit: function () {
                // you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
                var oModel = this.base.getModel();
                console.log("UserInfoController initialized");
                
                // Start continuous monitoring to hide Adapt Filters button
                this._startAdaptFiltersMonitoring();
            },

            /**
             * Extension hook called before table rebind - reliable way to set filters
             */
            onBeforeRebindTableExtension: function(oEvent) {
                debugger;
                console.log("onBeforeRebindTableExtension called");
                
                // Hide Adapt Filters button immediately when table is being rebound
                setTimeout(function() {
                    this._hideAdaptFiltersButton();
                }.bind(this), 100);
                
                try {
                    const oBindingParams = oEvent.getParameter("bindingParams");
                    
                    // Add custom filter
                    const userId = 'rahul.girmaji@consultsda.com'; // Your logic to get user ID
                    if (userId && oBindingParams && oBindingParams.filters) {
                        // Check if user filter already exists
                        var bUserFilterExists = oBindingParams.filters.some(function(oFilter) {
                            return oFilter.sPath === "user";
                        });
                        
                        if (!bUserFilterExists) {
                            oBindingParams.filters.push(
                                new Filter("user", FilterOperator.EQ, userId)
                            );
                            console.log("User filter added to binding params:", userId);
                        } else {
                            console.log("User filter already exists in binding params");
                        }
                    }
                } catch (error) {
                    console.error("Error in onBeforeRebindTableExtension:", error);
                }
            },

            /**
             * Alternative: Try automatic filtering after init
             */
            onAfterRendering: function() {
                // Hide the Adapt Filters button with multiple attempts
                this._hideAdaptFiltersButton();
                
                // Try again after delays to ensure UI is fully rendered
                setTimeout(function() {
                    this._hideAdaptFiltersButton();
                }.bind(this), 500);
                
                setTimeout(function() {
                    this._hideAdaptFiltersButton();
                }.bind(this), 1500);
                
                // Try to hide entire filter actions area as fallback
                setTimeout(function() {
                    this._hideFilterActions();
                }.bind(this), 2000);
                
                // Try to apply filter after rendering as backup
                setTimeout(function() {
                    this._applyUserFilter();
                    
                    // Additional attempt to find and click Go button
                    setTimeout(function() {
                        this._tryClickGoButton();
                    }.bind(this), 100);
                }.bind(this), 200);
            },

            /**
             * Cleanup when controller is destroyed
             */
            onExit: function() {
                this._stopAdaptFiltersMonitoring();
            }
        },

        /**
         * Start continuous monitoring to hide Adapt Filters button
         */
        _startAdaptFiltersMonitoring: function() {
            var that = this;
            
            // Set up interval to continuously check and hide the button
            this._adaptFiltersInterval = setInterval(function() {
                that._hideAdaptFiltersButton();
            }, 1000); // Check every second
            
            console.log("Started continuous monitoring for Adapt Filters button");
        },

        /**
         * Stop the monitoring (cleanup)
         */
        _stopAdaptFiltersMonitoring: function() {
            if (this._adaptFiltersInterval) {
                clearInterval(this._adaptFiltersInterval);
                this._adaptFiltersInterval = null;
                console.log("Stopped Adapt Filters monitoring");
            }
        },

        /**
         * Hide the Adapt Filters button programmatically
         */
        _hideAdaptFiltersButton: function() {
            try {
                var oView = this.base.getView();
                var bHidden = false;
                
                // Approach 1: Try by specific ID patterns (more comprehensive)
                var aPossibleIds = [
                    "listReportFilter-btnFilters",
                    "btnFilters", 
                    "adaptFiltersButton",
                    "filterBar-btnFilters",
                    "smartFilterBar-btnFilters"
                ];
                
                for (var i = 0; i < aPossibleIds.length; i++) {
                    var oButton = oView.byId(aPossibleIds[i]);
                    if (oButton && oButton.setVisible && oButton.getVisible()) {
                        oButton.setVisible(false);
                        console.log("Adapt Filters button hidden using ID:", aPossibleIds[i]);
                        bHidden = true;
                    }
                }
                
                // Approach 2: Find all buttons and check their properties (silent mode)
                var aAllButtons = oView.findAggregatedObjects(true, function(oControl) {
                    return oControl.isA && oControl.isA("sap.m.Button");
                });
                
                aAllButtons.forEach(function(oButton) {
                    if (!oButton.getVisible()) return; // Skip already hidden buttons
                    
                    var sText = oButton.getText && oButton.getText() || "";
                    var sTooltip = oButton.getTooltip && oButton.getTooltip() || "";
                    var sId = oButton.getId() || "";
                    
                    // Check if this might be the Adapt Filters button
                    if ((sText && sText.toLowerCase().includes("adapt")) ||
                        (sTooltip && typeof sTooltip === "string" && sTooltip.toLowerCase().includes("adapt")) ||
                        (sId && sId.toLowerCase().includes("adapt")) ||
                        (sId && sId.toLowerCase().includes("filter") && sId.toLowerCase().includes("btn"))) {
                        
                        console.log("Hiding Adapt Filters button:", sId, sText);
                        oButton.setVisible(false);
                        bHidden = true;
                    }
                });
                
                // Approach 3: Use CSS approach as backup
                if (window.jQuery) {
                    var $adaptButtons = window.jQuery('button:contains("Adapt"), [title*="Adapt"], [aria-label*="Adapt"]');
                    if ($adaptButtons.length > 0) {
                        $adaptButtons.hide();
                        if (!bHidden) {
                            console.log("Hidden Adapt Filters button using CSS selector");
                            bHidden = true;
                        }
                    }
                }
                
                return bHidden;
                
            } catch (error) {
                console.error("Error hiding Adapt Filters button:", error);
                return false;
            }
        },

        /**
         * Hide entire filter actions area as fallback
         */
        _hideFilterActions: function() {
            try {
                var oView = this.base.getView();
                
                // Try to hide filter action areas
                var aActionAreas = oView.findAggregatedObjects(true, function(oControl) {
                    var sId = oControl.getId() || "";
                    var sClassName = oControl.getMetadata && oControl.getMetadata().getName() || "";
                    
                    return sId.toLowerCase().includes("action") ||
                           sId.toLowerCase().includes("toolbar") ||
                           sClassName.includes("Toolbar") ||
                           sClassName.includes("ActionSheet");
                });
                
                console.log("Found action areas:", aActionAreas.length);
                
                aActionAreas.forEach(function(oArea) {
                    var sId = oArea.getId() || "";
                    console.log("Action area:", sId, oArea.getMetadata().getName());
                    
                    // Look for buttons within action areas
                    var aButtons = oArea.findAggregatedObjects && oArea.findAggregatedObjects(true, function(oControl) {
                        return oControl.isA && oControl.isA("sap.m.Button");
                    });
                    
                    if (aButtons) {
                        aButtons.forEach(function(oBtn) {
                            var sText = oBtn.getText && oBtn.getText() || "";
                            if (sText.toLowerCase().includes("adapt")) {
                                console.log("Hiding Adapt button in action area:", oBtn.getId());
                                oBtn.setVisible(false);
                            }
                        });
                    }
                });
                
                // Alternative: Use CSS approach
                setTimeout(function() {
                    if (window.jQuery) {
                        // Hide any buttons with adapt-related attributes
                        window.jQuery('button:contains("Adapt"), [title*="Adapt"], [aria-label*="Adapt"]').hide();
                        console.log("Applied jQuery CSS hiding for Adapt buttons");
                    }
                }, 100);
                
            } catch (error) {
                console.error("Error hiding filter actions:", error);
            }
        },

        /**
         * Apply user filter using extension API to match the manual filter behavior
         */
        _applyUserFilter: function() {
            try {
                var oExtensionAPI = this.base.getExtensionAPI();
                var sUserFilter = "nassim"; // Just the user part, not the full email
                
                if (oExtensionAPI && oExtensionAPI.setFilterValues) {
                    // Use setFilterValues with Contains operator to match manual filter: contains(user,'rahul')
                    oExtensionAPI.setFilterValues("user", "Contains", sUserFilter);
                    console.log("User filter applied successfully using setFilterValues with Contains operator:", sUserFilter);
                    
                    // Auto-trigger the search using refresh method
                    setTimeout(function() {
                        if (oExtensionAPI.refresh) {
                            oExtensionAPI.refresh();
                            console.log("Data refreshed automatically to apply filter");
                        } else if (oExtensionAPI.rebindTable) {
                            oExtensionAPI.rebindTable();
                            console.log("Table rebound automatically to apply filter");
                        } else {
                            // Try to manually trigger the filter bar search
                            var oView = this.base.getView();
                            var aFilterBars = oView.findAggregatedObjects(true, function(oControl) {
                                return oControl.isA && (
                                    oControl.isA("sap.fe.core.controls.FilterBar") ||
                                    oControl.isA("sap.ui.comp.smartfilterbar.SmartFilterBar")
                                );
                            });                            
                            if (aFilterBars.length > 0 && aFilterBars[0].fireSearch) {
                                aFilterBars[0].fireSearch();
                                console.log("Filter bar search fired manually");
                            }
                        }
                        
                        console.log("Filter applied and search triggered automatically for: " + sUserFilter);
                    }.bind(this), 1000); // Increased timeout to 1 second
                } else {
                    console.log("Extension API setFilterValues not available for filtering");
                }
            } catch (error) {
                console.error("Error applying user filter:", error);
            }
        },

        /**
         * Try to find and click the Go button in the filter bar
         */
        _tryClickGoButton: function() {
            try {
                var oView = this.base.getView();
                
                // Try multiple selectors for the Go button
                var aGoButtons = oView.findAggregatedObjects(true, function(oControl) {
                    if (!oControl.isA || !oControl.isA("sap.m.Button")) {
                        return false;
                    }
                    
                    var sText = oControl.getText();
                    var sType = oControl.getType();
                    var sId = oControl.getId();
                    
                    // Look for Go button by text, type, or ID pattern
                    return sText === "Go" || 
                           sText === "Search" ||
                           sType === "Emphasized" ||
                           sId.indexOf("go") > -1 ||
                           sId.indexOf("search") > -1;
                });
                
                console.log("Found potential Go buttons:", aGoButtons.length);
                
                if (aGoButtons.length > 0) {
                    // Try the first emphasized button or the first button found
                    var oGoButton = aGoButtons.find(function(btn) {
                        return btn.getType() === "Emphasized";
                    }) || aGoButtons[0];
                    
                    console.log("Attempting to click Go button:", oGoButton.getId(), oGoButton.getText());
                    oGoButton.firePress();
                    
                    console.log("Go button clicked automatically - filter applied!");
                } else {
                    console.log("No Go button found");
                    console.log("Filter value is set to 'rahul' - please click Go manually to apply");
                }
            } catch (error) {
                console.error("Error trying to click Go button:", error);
            }
        },

        onShowUserInfo: function () {
            debugger;
            MessageBox.information("User Information:\n\nUser ID: Current User\nRole: Purchase Order Approver\nDepartment: Procurement\nLocation: Head Office", {
                title: "User Details"
            });
        },

        onFilterMyPOs: function () {
            // Try to apply filter manually using different approaches
            try {
                var sUserFilter = "rahul";
                
                // Approach 1: Try to find and manipulate the filter bar directly
                var oView = this.base.getView();
                var aFilterBars = oView.findAggregatedObjects(true, function(oControl) {
                    return oControl.isA && (
                        oControl.isA("sap.fe.core.controls.FilterBar") ||
                        oControl.isA("sap.ui.comp.smartfilterbar.SmartFilterBar")
                    );
                });
                
                if (aFilterBars.length > 0) {
                    var oFilterBar = aFilterBars[0];
                    console.log("Found filter bar:", oFilterBar.getMetadata().getName());
                    
                    // Try to set the filter value in the filter bar
                    var aFilterItems = oFilterBar.getFilterGroupItems ? oFilterBar.getFilterGroupItems() : [];
                    var oUserFilterItem = aFilterItems.find(function(item) {
                        return item.getName() === "user";
                    });
                    
                    if (oUserFilterItem) {
                        var oControl = oUserFilterItem.getControl();
                        if (oControl && oControl.setValue) {
                            oControl.setValue(sUserFilter);
                            console.log("Set filter value in control:", sUserFilter);
                            
                            // Trigger search automatically
                            setTimeout(function() {
                                if (oFilterBar.fireSearch) {
                                    oFilterBar.fireSearch();
                                    console.log("Search fired on filter bar");
                                    console.log("Filter applied and search triggered: contains(user,'" + sUserFilter + "')");
                                } else {
                                    // Try to find and click Go button
                                    var aGoButtons = oView.findAggregatedObjects(true, function(oControl) {
                                        return oControl.isA && oControl.isA("sap.m.Button") && 
                                               (oControl.getText() === "Go" || oControl.getType() === "Emphasized");
                                    });
                                    
                                    if (aGoButtons.length > 0) {
                                        aGoButtons[0].firePress();
                                        console.log("Go button fired manually");
                                        console.log("Filter applied and Go button clicked: contains(user,'" + sUserFilter + "')");
                                    }
                                }
                            }, 200);
                        }
                    }
                } else {
                    console.log("No filter bar found for manual filtering");
                    
                    // Fallback: Try extension API approach
                    this._applyUserFilter();
                }
            } catch (error) {
                console.error("Error in manual filtering:", error);
                MessageBox.error("Unable to apply filter manually.");
            }
        }
    });
});