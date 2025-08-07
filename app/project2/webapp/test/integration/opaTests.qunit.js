sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'project2/test/integration/FirstJourney',
		'project2/test/integration/pages/PurchaseOrdersMain'
    ],
    function(JourneyRunner, opaJourney, PurchaseOrdersMain) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('project2') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePurchaseOrdersMain: PurchaseOrdersMain
                }
            },
            opaJourney.run
        );
    }
);