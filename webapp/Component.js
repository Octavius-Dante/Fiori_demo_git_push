sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("emc.hr.payroll.Component",{
        metadata: {
            manifest: "json"
        },
        init: function(){
            //this line will call the base class constructor
            UIComponent.prototype.init.apply(this);
            //Step 1: inside the manifest.json file add - rootView, routing sections
            //Step 2: Get the router object
            var oRouter = this.getRouter();
            //Step 3: Initialize the router
            oRouter.initialize();
        },
        // createContent: function(){
        //     var oView = sap.ui.view({
        //         viewName: "emc.hr.payroll.view.App",
        //         id: "idAppView",
        //         type: "XML"
        //     });

        //     //Step 1:Create View1 Object
        //     var oView1 = sap.ui.view({
        //         viewName: "emc.hr.payroll.view.View1",
        //         id: "idView1",
        //         type: "XML"
        //     });
        //     //Step 2:Create View2 Object
        //     var oView2 = sap.ui.view({
        //         viewName: "emc.hr.payroll.view.View2",
        //         id: "idView2",
        //         type: "XML"
        //     });
        //     //Step 3:Get The APP Container Control Object From App.view.xml
        //     var oAppCon = oView.byId("appCon");
        //     //Step 4:Inject the View1 and View2 inside the Container
        //     oAppCon.addMasterPage(oView1).addDetailPage(oView2);
        //     return oView;
        // }
    });
});