using POApprovalService as service from '../srv/poapproval-service';

// Annotations for List Report
annotate service.PurchaseOrders with @(
  UI.SelectionFields: [
    poNumber,
    vendor,
    status,
    amount,
    currency
  ],
  UI.LineItem: [
    { $Type: 'UI.DataField', Value: poNumber },
    { $Type: 'UI.DataField', Value: vendor },
    { $Type: 'UI.DataField', Value: amount },
    { $Type: 'UI.DataField', Value: currency },
    { 
      $Type: 'UI.DataField', 
      Value: status,
      Criticality: statusCriticality
    },
    { $Type: 'UI.DataField', Value: user },
    { $Type: 'UI.DataField', Value: deliveryDate }
  ],
  UI.PresentationVariant: {
    SortOrder: [{ Property: poNumber, Descending: false }]
  }
) {
  poNumber @Common.Label: 'PO Number';
  vendor @Common.Label: 'Vendor';
  amount @Common.Label: 'Amount';
  currency @Common.Label: 'Currency';
  status @Common.Label: 'Status';
  user @Common.Label: 'User';
  deliveryDate @Common.Label: 'Delivery Date';
};

// Key annotations for navigation
annotate service.PurchaseOrders with @(
  Common.SemanticKey: [poNumber]
);

annotate service.POItems with @(
  Common.SemanticKey: [lineNumber],
  UI.LineItem: [
    { $Type: 'UI.DataField', Value: lineNumber },
    { $Type: 'UI.DataField', Value: description },
    { $Type: 'UI.DataField', Value: quantity },
    { $Type: 'UI.DataField', Value: amount },
    { $Type: 'UI.DataField', Value: currency }
  ]
) {
  lineNumber @Common.Label: 'Line Number';
  description @Common.Label: 'Description';
  quantity @Common.Label: 'Quantity';
  amount @Common.Label: 'Amount';
  currency @Common.Label: 'Currency';
};

// Annotations for Object Page
annotate service.PurchaseOrders with @(
  // Disable delete capability
  Capabilities.DeleteRestrictions: {
    Deletable: false,
    Description: 'Delete operation is not allowed'
  },
  UI.HeaderInfo: {
    TypeName: 'Purchase Order',
    TypeNamePlural: 'Purchase Orders',
    Title: { Value: vendor },
    Description: { Value: poNumber }
  },
  UI.Identification: [
    { $Type: 'UI.DataField', Value: poNumber },
    { $Type: 'UI.DataField', Value: vendor },
    { 
      $Type: 'UI.DataFieldForAction', 
      Action: 'POApprovalService.approve',
      Label: 'Approve',
      Inline: true,
      Criticality: 3
    },
    { 
      $Type: 'UI.DataFieldForAction', 
      Action: 'POApprovalService.sendBack',
      Label: 'Send Back',
      Inline: true,
      Criticality: 1
    },
    { 
      $Type: 'UI.DataFieldForAction', 
      Action: 'POApprovalService.reject',
      Label: 'Reject',
      Inline: true,
      Criticality: 1,
      ![@UI.Hidden]: true
    }
  ],
  UI.Facets: [
    {
      $Type: 'UI.ReferenceFacet',
      Label: 'General Information',
      Target: '@UI.FieldGroup#GeneralInfo'
    },
    {
      $Type: 'UI.ReferenceFacet',
      Label: 'PO Items',
      Target: 'items/@UI.LineItem'
    }
  ],
  UI.FieldGroup#GeneralInfo: {
    Data: [
      { $Type: 'UI.DataField', Value: poNumber },
      { $Type: 'UI.DataField', Value: vendor },
      { $Type: 'UI.DataField', Value: amount },
      { $Type: 'UI.DataField', Value: currency },
      { $Type: 'UI.DataField', Value: status },
      { $Type: 'UI.DataField', Value: deliveryDate },
      { $Type: 'UI.DataField', Value: description }
    ]
  }
);
