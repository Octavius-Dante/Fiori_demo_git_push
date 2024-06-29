sap.ui.define([
    'emc/hr/payroll/controller/BaseController',
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/MessageStrip"
], function(Controller, Fragment, Filter, FilterOperator, MessageBox,MessageToast,MessageStrip) {
    'use strict';
    return Controller.extend("emc.hr.payroll.controller.View2",{
        onInit: function(){
            //Step 1: Get The Router Object
            this.oRouter = this.getOwnerComponent().getRouter();
            //We forefully pass this pointer to herculis (event handler)
            this.oRouter.getRoute("detail").attachPatternMatched(this.herculis, this);
        },
        onFilter: function(){
            //alert('this functionality is under construction, roger copy that');
            if(!this.oSupplierPopup){
                var that = this;
                Fragment.load({
                    name: "emc.hr.payroll.fragments.popup",
                    type: "XML",
                    id: "supplier",
                    controller: this //controller access is provided to the popup
                })
                //Asynchronous - call back and promise
                .then(function(oSupplier){
                    that.oSupplierPopup = oSupplier;
                    that.oSupplierPopup.setTitle("Select Supplier");
                    //providing access of the immune system to parasite using WBC (who already have access to res.)
                    that.getView().addDependent(that.oSupplierPopup);
                    that.oSupplierPopup.bindAggregation("items",{
                        path: '/supplier',
                        template: new sap.m.DisplayListItem({
                            label: '{name}',
                            value: '{city}'
                        })
                    });
                    that.oSupplierPopup.open();
                });
            }else{
                this.oSupplierPopup.open();
            }
            
        },
        handleConfirm: function(status){
            if(status === "OK"){
                MessageToast.show(this.readMessage("XMSG_ORDREL","90099"));
            }else{
                
            }
        },
        onOrder: function(params) {
          MessageBox.confirm(this.readMessage("XMSG_CONFIRM"),{
              title: 'Confirmation',
              onClose: this.handleConfirm.bind(this)
          });
        },
        oCityPopup: null,
        oSupplierPopup: null,
        onSearchPopup: function(oEvent){
            //step 1: get the search string
            var sVal = oEvent.getParameter("value");
            var oBinding = oEvent.getParameter("itemsBinding");
            //step 3: prepare filter
            var oFilter = new Filter("name", FilterOperator.Contains, sVal);
            //step 4: pass filter to popup items binding
            oBinding.filter(oFilter);
        },
        onConfirm: function(oEvent){
            var sId = oEvent.getSource().getId();

            if(sId.indexOf("city") !== -1 ){
                //1. Read the value which was selected in the popup
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sText = oSelectedItem.getLabel();
                //2. Place that value to the field INSIDE the TABLE 
                this.selectedField.setValue(sText);
            }else{
                //1. get the table object
                var oTable = this.getView().byId("idTab");
                //2. read multi select items
                var aSelectedItems = oEvent.getParameter("selectedItems");
                //3. contruct filter
                var aFilters = [];
                for (let index = 0; index < aSelectedItems.length; index++) {
                    const element = aSelectedItems[index];
                    const sText = element.getLabel();
                    aFilters.push(new Filter('name', FilterOperator.EQ, sText));
                }
                var oFilter = new Filter({
                    filters: aFilters,
                    and: false
                });
                //4. pump to binding
                oTable.getBinding("items").filter(oFilter);
                //alert("this functionality is under construction");
            }
           
        },
        selectedField: null,
        onF4Help: function(oEvent){
            //when user click on F4 on the field inside table, that field object we 
            //are storing now in a temporary object
            this.selectedField = oEvent.getSource();
            //alert('this functionality is under construction, roger copy that');
            // IF lo_alv IS NOT BOUND
            if(!this.oCityPopup){
                var that = this;
                Fragment.load({
                    name: "emc.hr.payroll.fragments.popup",
                    type: "XML",
                    id: 'city',
                    controller: this //controller access is provided to the popup
                })
                //Asynchronous - call back and promise
                .then(function(oPopup){
                    //assign the object created by system to our global variable
                    that.oCityPopup = oPopup;
                    //change the title
                    that.getView().addDependent(that.oCityPopup);
                    that.oCityPopup.setTitle("Select City");
                    that.oCityPopup.bindAggregation("items",{
                        path: '/cities',
                        template: new sap.m.DisplayListItem({
                            label: '{name}',
                            value: '{famousFor}'
                        })
                    });
                    that.oCityPopup.setMultiSelect(false);
                    that.oCityPopup.open();
                });
            }else{
                this.oCityPopup.open();
            }
            
        },
        onLinkPress: function(oEvent){
            var sText = oEvent.getSource().getText();
            sText = 'https://google.com?q=' + sText;
            window.open(sText);
        },
        herculis: function(oEvent){
            var sPath = this.extractPath(oEvent);
            this.getView().bindElement({
                path: sPath,
                parameters:{
                    expand: 'To_Supplier'
                }
            }); // binding with /fruits/4 -

            // var sPath2 = this.extractPath(oEvent);
            // this.getView().bindElement({
            //     path: sPath2,
            //     parameters:{
            //         expand: 'To_Orders'
            //     }
            // });
        },
        onBack: function(){
            this.getView().getParent().to("idView1");
        }

    });
});