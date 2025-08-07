using { com.sap.poapproval as db } from '../db/schema';

service POApprovalService @(path: '/poapproval') {

  entity PurchaseOrders as projection on db.PurchaseOrders {
    *,
    case status
      when 'Approved' then 3
      when 'Pending Approval' then 2
      when 'Sent Back' then 1
      else 0
    end as statusCriticality : Integer
  }
  actions {
    action approve() returns PurchaseOrders;
    action sendBack() returns PurchaseOrders;
    action reject() returns PurchaseOrders;
  };

  entity POItems as projection on db.POItems;
  
  entity StatusValues as projection on db.StatusValues;
  
  // Custom function to get PO details for a specific user
  function getPODetails(user: String) returns array of PurchaseOrders;
  
  // View entity for user-specific POs (for Fiori Elements)
  entity UserPurchaseOrders as projection on db.PurchaseOrders {
    *,
    case status
      when 'Approved' then 3
      when 'Pending Approval' then 2
      when 'Sent Back' then 1
      else 0
    end as statusCriticality : Integer
  };
}

// Set redirection target to resolve compilation issue
annotate POApprovalService.UserPurchaseOrders with @cds.redirection.target;

// Ensure proper key handling for OData V4
annotate POApprovalService.PurchaseOrders with {
  ID @Core.Computed;
};

// Disable delete operations for PurchaseOrders
annotate POApprovalService.PurchaseOrders with @(
  Capabilities.DeleteRestrictions: {
    Deletable: false
  }
);

annotate POApprovalService.POItems with {
  ID @Core.Computed;
};

// Add critical action annotations for confirmation dialogs
annotate POApprovalService.PurchaseOrders actions {
  approve @(
    Common.IsActionCritical: true
  );
  sendBack @(
    Common.IsActionCritical: true
  );
  reject @(
    Common.IsActionCritical: true
  );
};