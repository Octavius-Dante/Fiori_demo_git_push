sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, MessageToast, JSONModel) {
    'use strict';
    return Controller.extend("emc.hr.payroll.controller.Add", {
        onInit: function () {
            this.oModel = new JSONModel();
            this.oModel.setData({
                "productData": {
                    "PRODUCT_ID": "",
                    "TYPE_CODE": "PR",
                    "CATEGORY": "Notebooks",
                    "NAME": "<enter name>",
                    "DESCRIPTION": "<Enter Desc.>",
                    "SUPPLIER_ID": "0100000051",
                    "SUPPLIER_NAME": "TECUM",
                    "TAX_TARIF_CODE": "1 ",
                    "PRICE": "0",
                    "CURRENCY_CODE": "USD",
                    "DIM_UNIT": "CM",
                    "To_Orders": []
                },
            });
            // setthing this model to view
            this.getView().setModel(this.oModel, "viewModel");
        },
        // added some changes for git 
        onEnter: function (oEvent) {

            var that = this;
            // Step 1 : read the product id from screen
            var sText = oEvent.getSource().getValue();
            // Step 2 : Get the odata model object 
            var oDataModel = this.getView().getModel();
            // Step 3 : Fire the read call 

            // enable loading indicator to show before processing
            this.getView().setBusy(true);

            // oDataModel.read("/ProductSet('" + sText + "')", {
            oDataModel.read("/ProductSet('" + sText + "')", {                
                // $expand parameters
                urlParameters:{
                    "$expand": "To_Orders"
                },
                // Step 4 : Handle success - set data to our local model 
                success: function(data) {
                    // disable loading indicator process is going to end
                    that.getView().setBusy(false);
                    that.oModel.setProperty("/productData", data);
                //$expand parameter mapping
                    that.oModel.setProperty("/productData/To_Orders", data.To_Orders.results);                     
                },
                // Step 5 : Error handling (input validation)
                error: function (oError) {
                    // disable loading indicator process is going to end
                    that.getView().setBusy(false);
                    var errorText = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                    MessageBox.error(errorText);
                }
            });
        },

        onMostExp: function () {
            var that = this;
            // Step 1 : Get the odata model object 
            var oDataModel = this.getView().getModel();
            // Step 2 : Send the call function 
            oDataModel.callFunction("/Get_Expensive_Product", {
                urlParameters: {
                    "I_CATEGORY": "Servers"
                },
                success: function (data) {
                    // Step 3 : Success Response set data on screen by local model 
                    that.oModel.setProperty("/productData", data);
                }
            })
        },

        onDelete: function (oEvent) {
            //for update call oDataModel.update("/Entity", payload)

            var oDataModel = this.getView().getModel();
            oDataModel.remove("/ProductSet('" + this.getView().byId("name").getValue() + "')", {
                success: function () {
                    MessageToast.show("Product is now deleted");
                }
            });

        },

        onUpdate: function () {
            var oDataModel = this.getView().getModel();

            var payload = this.oModel.getProperty("/productData");
            
            payload.PRODUCT_ID = this.getView().byId("name").getValue();
            payload.NAME = this.getView().byId("prod_name").getValue(); // product_id
            payload.DESCRIPTION = this.getView().byId("prod_desc").getValue(); // description 
            payload.SUPPLIER_ID = this.getView().byId("prod_supplier").getValue(); // Supplier_id
            payload.CURRENCY_CODE = this.getView().byId("prod_currency").getValue(); // Currency_code
            payload.PRICE = this.getView().byId("prod_price").getValue(); // price

            this.oModel.setProperty("/productData", payload);

            oDataModel.update("/ProductSet('" + payload.PRODUCT_ID + "')" , payload, {
            //oDataModel.update("/ProductSet('" + this.getView().byId("name").getValue() + "')" , payload, {
                method: "PATCH",
                success: function (data) {
                    MessageToast.show("The product updated successfully", data);
                },
                error: function (oError) {
                    var errorText = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                    MessageBox.error(errorText);
                }
            });
        },

        onClear: function () {
            // we can clear data in our local model 
            var payload = this.oModel.getProperty("/productData");
            payload.PRODUCT_ID = "";
            payload.SUPPLIER_ID = "";
            payload.CURRENCY_CODE = "USD";
            payload.PRICE = "";
            payload.NAME = "";
            payload.DESCRIPTION = "";
            this.oModel.setProperty("/productData", payload);
        },

        onSave: function () {
            // MessageBox.confirm("This functionality is under construction");            
            // Step 1 : Prepare the Payload
            var payload = this.oModel.getProperty("/productData");
            // Step 2 : Get the odata model object to communicate with backend 
            var oDataModel = this.getView().getModel();
            // Step 3 : Fire the POST call on entity set with payload
            oDataModel.create("/ProductSet", payload, {
                // Call back for positive response 
                success: function (data) {
                    MessageToast.show("The product was created successfully");
                },
                // Call back for negative response 
                error: function (oError) {
                    MessageBox.error("An internal error Occured");
                }

            });
        }
    });
});