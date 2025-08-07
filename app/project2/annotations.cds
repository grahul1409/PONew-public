using POApprovalService as service from '../../srv/poapproval-service';

// Annotations for UserPurchaseOrders entity in project2 (custom page with macros)
annotate service.UserPurchaseOrders with @(
  UI.SelectionFields: [
    poNumber,
    vendor,
    status,
    amount,
    currency,
    user,
    deliveryDate
  ],
  UI.LineItem: [
    { 
      $Type: 'UI.DataField', 
      Value: poNumber,
      ![@UI.Importance]: #High 
    },
    { 
      $Type: 'UI.DataField', 
      Value: vendor,
      ![@UI.Importance]: #High 
    },
    { 
      $Type: 'UI.DataField', 
      Value: amount,
      ![@UI.Importance]: #High 
    },
    { 
      $Type: 'UI.DataField', 
      Value: currency,
      ![@UI.Importance]: #Medium 
    },
    { 
      $Type: 'UI.DataField', 
      Value: status,
      Criticality: statusCriticality,
      ![@UI.Importance]: #High 
    },
    { 
      $Type: 'UI.DataField', 
      Value: user,
      ![@UI.Importance]: #Medium 
    },
    { 
      $Type: 'UI.DataField', 
      Value: deliveryDate,
      ![@UI.Importance]: #Medium 
    }
  ],
  UI.PresentationVariant: {
    SortOrder: [{ Property: poNumber, Descending: false }],
    RequestAtLeast: [
      poNumber,
      vendor,
      amount,
      status
    ]
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