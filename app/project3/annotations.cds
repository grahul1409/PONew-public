using POApprovalService as service from '../../srv/poapproval-service';

// Annotations for UserPurchaseOrders entity (filtered by user automatically)
annotate service.UserPurchaseOrders with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : poNumber,
            Label : 'PO Number',
        },
        {
            $Type : 'UI.DataField',
            Value : vendor,
            Label : 'Vendor',
        },
        {
            $Type : 'UI.DataField',
            Value : amount,
            Label : 'Amount',
        },
        {
            $Type : 'UI.DataField',
            Value : currency,
            Label : 'Currency',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
            Criticality : statusCriticality,
        },
        {
            $Type : 'UI.DataField',
            Value : deliveryDate,
            Label : 'Delivery Date',
        },
        {
            $Type : 'UI.DataField',
            Value : location,
            Label : 'Location',
        },
        {
            $Type : 'UI.DataField',
            Value : description,
            Label : 'Description',
        },
    ]
);

// Selection fields for filtering
annotate service.UserPurchaseOrders with @(
    UI.SelectionFields : [
        poNumber,
        vendor,
        status,
        deliveryDate
    ]
);

// Object Page annotations
annotate service.UserPurchaseOrders with @(
    UI.HeaderInfo : {
        TypeName : 'Purchase Order',
        TypeNamePlural : 'Purchase Orders',
        Title : {
            $Type : 'UI.DataField',
            Value : poNumber,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : vendor,
        },
    }
);

annotate service.UserPurchaseOrders with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneralInformationFacet',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneralInformation',
        },
    ]
);

annotate service.UserPurchaseOrders with @(
    UI.FieldGroup #GeneralInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : poNumber,
                Label : 'PO Number',
            },
            {
                $Type : 'UI.DataField',
                Value : vendor,
                Label : 'Vendor',
            },
            {
                $Type : 'UI.DataField',
                Value : amount,
                Label : 'Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : currency,
                Label : 'Currency',
            },
            {
                $Type : 'UI.DataField',
                Value : status,
                Label : 'Status',
                Criticality : statusCriticality,
            },
            {
                $Type : 'UI.DataField',
                Value : deliveryDate,
                Label : 'Delivery Date',
            },
            {
                $Type : 'UI.DataField',
                Value : location,
                Label : 'Location',
            },
            {
                $Type : 'UI.DataField',
                Value : description,
                Label : 'Description',
            },
        ],
    }
);