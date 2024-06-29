sap.ui.define([
    'emc/hr/payroll/controller/BaseController',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller, Filter, FilterOperator) {
    'use strict';
    return Controller.extend("emc.hr.payroll.controller.View1", {
        onInit: function(){
            //The ROuter object is readily available with Component.js
            //So we are getting the same.
            this.Router = this.getOwnerComponent().getRouter();
            this.Router.getRoute("detail").attachPatternMatched(this.herculis, this);
        },

        onAdd: function(){
            this.Router.navTo("add");
        },

        herculis: function(oEvent){
            debugger;
            //var fruitId = oEvent.getParameter("arguments").fruitId;
            var sPath = this.extractPath(oEvent);
            var oList = this.getView().byId("idLST");
            debugger;
            var element = {};
            if(oList.getItems().length > 0){
                for (let i = 0; i < oList.getItems().length; i++) {
                    element = oList.getItems()[i];
                    if (element.getBindingContextPath() === sPath){
                        oList.setSelectedItem(element);
                        break;
                    }
                    
                }
                // if(element){
                //     oList.setSelectedItem(element);
                // }
            }
            
            
        },
        onNext: function(){
            //step 1: get the parent control object - Container for our view
            var oAppCon = this.getView().getParent();
            //step 2: ask parent to nav to next view
            oAppCon.to("idView2");
        },
        onFruitSelect: function (oEvent) {
            //Step 1: Get the router object
            //this.Router
            //Step 2: Trigger the ROute
            var oSelectedItem = oEvent.getParameter("listItem");
            this.Router.navTo("detail",{
                // fruitId: oSelectedItem.getBindingContextPath().split("/")[2] // this is for fruit JSON model 
                fruitId: oSelectedItem.getBindingContextPath().split("/")[1] // this is change is for ODATA model
            });
        },
        onDeleteItems: function (oEvent) {
            var oList = this.getView().byId("idLST");
            var aSelectedItems = oList.getSelectedItems();
            aSelectedItems.forEach(item => {
                oList.removeItem(item);
            });            
        },
        onNavNext: function(oEvent){
            this.onNext();
        },
        onDelete: function(oEvent){
            //Step 1: find out which item was selected for deleteion
            var oSelected = oEvent.getParameter("listItem");
            //Step 2: Get List Object
            var oList = oEvent.getSource();
            //Step 3: Remove the item from the list
            oList.removeItem(oSelected);
        },
        onSearch: function(oEvent){
            //step 1: what is that user type in searh field
            var sSearch = oEvent.getParameter("query");
            if(sSearch === "" || sSearch === undefined){
                sSearch = oEvent.getParameter("newValue");
            }
            //step 2: construct the filter object with operand and operator

            var oFilter = new Filter("CATEGORY", FilterOperator.Contains, sSearch);
            // var oFilter = new Filter("name", FilterOperator.Contains, sSearch);
            // var oFilter2 = new Filter("taste", FilterOperator.Contains, sSearch);
            // var aFilter = [oFilter, oFilter2];
            // var oMaster = new Filter({
            //     filters: aFilter,
            //     and: false
            // });
            //step 3: get the list object
            var oList = this.getView().byId("idLST");
            //step 4: inject the filter to the list
            // oList.getBinding("items").filter(oMaster);
            oList.getBinding("items").filter(oFilter);
        },
        onItemClick: function(){
            //this - is my current class object - which is our controler
            this.onNext();
        }

    });
});