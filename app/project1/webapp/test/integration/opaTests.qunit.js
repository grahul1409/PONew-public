sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'project1/test/integration/FirstJourney',
		'project1/test/integration/pages/PurchaseOrdersList',
		'project1/test/integration/pages/PurchaseOrdersObjectPage'
    ],
    function(JourneyRunner, opaJourney, PurchaseOrdersList, PurchaseOrdersObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('project1') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePurchaseOrdersList: PurchaseOrdersList,
					onThePurchaseOrdersObjectPage: PurchaseOrdersObjectPage
                }
            },
            opaJourney.run
        );
    }
);