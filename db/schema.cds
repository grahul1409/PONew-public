namespace com.sap.poapproval;

using { managed, cuid } from '@sap/cds/common';

entity PurchaseOrders {
  key ID : String(36);
  poNumber        : String(20) @title: 'PO Number';
  vendor          : String(100) @title: 'Vendor';
  amount          : Decimal(15,2) @title: 'Amount';
  currency        : String(3) @title: 'Currency';
  status          : String(20) @title: 'Status' default 'Pending Approval';
  purchaseOrder   : String(20) @title: 'Purchase Order';
  vendorAssignment: String(100) @title: 'Vendor Assignment';
  deliveryDate    : Date @title: 'Delivery Date';
  location        : String(100) @title: 'Location';
  paymentTerms    : String(50) @title: 'Payment Terms';
  companyCode     : String(10) @title: 'Company Code';
  description     : String(500) @title: 'Description';
  user            : String(100) @title: 'User';
  approvedBy      : String(100) @title: 'Approved By';
  approvedDate    : DateTime @title: 'Approved Date';
  items           : Composition of many POItems on items.parent = $self;
}

entity POItems : cuid {
  parent      : Association to PurchaseOrders;
  lineNumber  : Integer @title: 'Line';
  description : String(200) @title: 'Description';
  quantity    : Integer @title: 'QTY';
  amount      : Decimal(15,2) @title: 'Amount';
  currency    : String(3) @title: 'Currency';
}

// Value Help entities
entity StatusValues {
  key code : String(20);
  name     : String(50);
}