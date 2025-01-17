sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment"
], function (Controller, History, Fragment) {
    "use strict";

    return Controller.extend("zfgghadamantenimientousuario.zfgghadamantusuario.controller.BaseController", {
        /**
         * Convenience method for accessing the router in every controller of the application.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Convenience method for getting the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Event handler for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the list route.
         * @public
         */
        onNavBack: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();

            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("list", {}, true);
            }
        },

        _createSearchFilterObject: function (aFilterIds, aFilterOperator, aFilterValues, aFilterValues2) {
            var lFilter = new sap.ui.model.Filter({
                path: aFilterIds,
                operator: aFilterOperator,
                value1: aFilterValues,
                value2: aFilterValues2
            });
            return lFilter;
        },

        showFioriMsg: function (sText, type) {
            var icon;
            switch (type) {
                case "E":
                    icon = sap.m.MessageBox.Icon.ERROR;
                    break;

                case "S":
                    icon = sap.m.MessageBox.Icon.SUCCESS;
                    break;

                case "W":
                    icon = sap.m.MessageBox.Icon.WARNING;
                    break;
            }
            sap.m.MessageBox.show(sText, {
                icon: icon,
                styleClass: "sapUiSizeCompact"
            });
        },

        showOdataErrorMsg: function (oError, sText, aText, that) {

            if (oError.responseText !== null) {
                try {
                    var errorText = JSON.parse(oError.responseText);
                    var innerErrorArray = errorText.error.innererror.errordetails;
                } catch (e) { }
                if (innerErrorArray !== undefined) {

                    // Comprobamos el número de mensajes que vamos a sacar. Si es solo uno, lo sacaremos a continuación. Si son varios procederemos
                    var num_mensajes = 0;
                    var messages = [];
                    for (var t = 0; t < innerErrorArray.length; t++) {
                        var message = innerErrorArray[t];
                        if (message.code !== "/IWBEP/CX_MGW_TECH_EXCEPTION" && message.code !== "/IWBEP/CX_MGW_BUSI_EXCEPTION" && message.code !==
                            "/IWBEP/CM_LOGGING/666") {
                            num_mensajes++;
                            messages.push(message);
                        }
                    }
                    if (num_mensajes === 1) {
                        for (var t = 0; t < messages.length; t++) {
                            switch (messages[t].severity) {
                                case "sucess":
                                    sap.m.MessageToast.show(decodeURIComponent(messages[t].message), {
                                        duration: 8000
                                    });
                                    break;
                                case "warning":
                                    sap.m.MessageBox.show(messages[t].message, sap.m.MessageBox.Icon.WARNING,
                                        that.getView().getModel("i18n").getResourceBundle().getText("warningMessage"), [sap.m.MessageBox.Action.OK],
                                        function (oEvent) {
                                            if (oEvent) { }
                                        });
                                    break;
                                case "error":
                                    sap.m.MessageBox.show(messages[t].message, sap.m.MessageBox.Icon.ERROR,
                                        that.getView().getModel("i18n").getResourceBundle().getText("errorMessage"), [sap.m.MessageBox.Action.OK]); //fnCallback);
                                    break;
                            }
                        }
                    } else {
                        if (num_mensajes >= 1) {
                            var sLongText;
                            for (var t = 0; t < messages.length; t++) {
                                if (t === 0) {
                                    sLongText = messages[t].message + "\n";
                                } else {
                                    sLongText = sLongText + messages[t].message + "\n";
                                }
                            }
                            sap.m.MessageBox.show(sLongText, sap.m.MessageBox.Icon.ERROR, [sap.m.MessageBox.Action.OK]);
                        }
                    }
                }
            }
        },
        _openBusyDialog: function (text) {
            this.busyDialog = '';
            try {
                if (!this.busyDialog) {
                    this.busyDialog = new sap.m.BusyDialog("busyDialog", {
                        title: text
                    });
                }
                this.busyDialog.open();
            } catch (error) {

            }

        },
        _closeBusyDialog: function () {
            try {
                this.busyDialog.close();
                this.busyDialog.destroy(true);
                this.busyDialog = undefined;
            } catch (error) {
                this.busyDialog = undefined;
            }

        },
        // Evento por el que pasará cuando selecionemos por un campo con ayuda de búsqueda. 
        OnValueHelpCollective: function (oController) {
            var fieldSearch = md.fiori.UtilityHada.encontrarIdCampo(oController.getParameters().id);
            this.fieldSearch = fieldSearch;

            var that = this;
            var oModel = this.getModel("F4Generic");
            oModel.read("/F4DynamicCollPreSet", {
                urlParameters: {
                    search: fieldSearch
                },
                success: fSuccess,
                error: oDataF4Error
            });

            function fSuccess(oData, response) {
                that.searchHelpJson = response.data.results;
                var viewP = md.fiori.UtilityHada.getControllerInstance("viewParametros");
                that.multiValue = false;
			try {
				if (viewP.byId(that.fieldSearch) !== undefined && viewP.byId(that.fieldSearch).getEnableMultiLineMode() === true) {
					that.multiValue = true;
				}else if(sap.ui.getCore().byId(that.fieldSearch).getEnableMultiLineMode() === true){
					that.multiValue = true;
				};
			} catch (err) {
                that.multiValue = false;
            }

                md.fiori.UtilityHada.setControllerInstance(that, "viewBase");
                if (!that.FragmentF4GenericCollective) {

                    that.FragmentF4GenericCollective = Fragment.load({
                        type: 'JS',
                        name: "zfgghadamantenimientousuario.zfgghadamantusuario.view.fragment.F4GenericCollective"
                    }).then(function (oValueHelpDialog) {

                        var filterGroupItemsArr = that.getModel("filterGroupItemsArr")

                        var oFilterBar = new sap.ui.comp.filterbar.FilterBar({ 
                            advancedMode: true,
                            filterBarExpanded: true,
                            filterGroupItems: filterGroupItemsArr,
                            showGoOnFB: that.visible,

                            search: function (oEvt) {
                                if (that.field !== undefined) {
                                    var oSource = oEvt.getSource();
                                    var oFilterArr = [];

                                    // Comprobamos si estamos en Advanced Search para obtener el valor de los demas campos
                                    if (oSource.getAdvancedMode() === true) {
                                        var FilterAdv = oEvt.getParameters().selectionSet;
                                        for (var i = 0; i < FilterAdv.length; i++) {
                                            var value = FilterAdv[i].getProperty("value");
                                            if (value !== "") {
                                                var oFilter = new sap.ui.model.Filter(FilterAdv[i].getId(), sap.ui.model.FilterOperator.Contains, value);
                                                oFilterArr.push(oFilter);
                                            }
                                        }
                                    }
                                    // Debemos comprobar si tenemos campos de entrada pero que son invisibles. 
                                    // Esto quiere decir que se deberan de sacar de los datos de pantalla
                                    var modelInvisibleInput = that.getModel("invisibleInput");
                                    if (modelInvisibleInput !== undefined) {
                                        for (var k = 0; k < modelInvisibleInput.length; k++) {
                                            var value = undefined;
                                            var odataName = md.fiori.UtilityHada.getOdataNameFromSapName(modelInvisibleInput[k].Fieldname);
                                            var values = undefined;
                                            try {
                                                values = that.getView().byId(odataName).getTokens();
                                            } catch (e) {
                                                try {
                                                    var value = that.getView().byId(odataName).getValue();
                                                } catch (e) {
                                                    try {
                                                        var value = that.getView().byId(odataName).getText();
                                                    } catch (e) {

                                                    }
                                                }
                                            }
                                            if (value === undefined) {
                                                // Lo buscamos en el objeto
                                                value = that[odataName];
                                            }


                                            // Para el contrato lo gestionamos ya que puede haber varios
                                            if (values !== undefined) {
                                                var l_values = undefined;
                                                for (var x = 0; x < values.length; x++) {
                                                    if (l_values !== undefined) {
                                                        l_values = l_values + ',' + values[x].getKey();
                                                    } else {
                                                        l_values = values[x].getKey();
                                                    }
                                                }
                                                oFilterArr.push(that._createSearchFilterObject(modelInvisibleInput[k].Fieldname, sap.ui.model.FilterOperator.EQ,
                                                    l_values));
                                                values = undefined;
                                            } else {
                                                var oFilter = new sap.ui.model.Filter(modelInvisibleInput[k].Fieldname, sap.ui.model.FilterOperator.Contains, value);
                                                oFilterArr.push(oFilter);
                                            }
                                        }
                                    }
                                    if (oFilterArr !== null) {
                                        var mHeaders = {};
                                        for (var i = 0; i < oFilterArr.length; i++) {
                                            mHeaders[oFilterArr[i].sPath] = oFilterArr[i].oValue1;
                                        }
                                    }

                                    var oModel = that.getModel("F4Generic");
                                    oModel.setHeaders(mHeaders);
                                    var those = that;
                                    oModel.read("/F4DynamicCollPostSet", {
                                        urlParameters: {
                                            search: those.fieldSearch,
                                        },
                                        success: fSuccess,
                                        error: oDataF4Error
                                    });

                                    function fSuccess(oData, response) {
                                        those.searchHelpJson = response.data.results;
                                        var columnModel = those.getModel("columnsArrTotal");
                                        var tableResult = md.fiori.UtilityHada.getResultsVhdDynamic(those.searchHelpJson, columnModel);
                                        var oRowsModel = oValueHelpDialog.getTable().getModel();
                                        oRowsModel.setData(tableResult);
                                        oValueHelpDialog.getTable().setModel(oRowsModel);
                                        oValueHelpDialog.getTable().bindRows("/");
                                        var table = oValueHelpDialog.getTable();
                                        table.setTitle('Elementos ( ' + tableResult.length + ' )' )
                                    }

                                    function oDataF4Error(oError) { }
                                }
                            }
                        });

                        if (that.field === undefined) {
                            oFilterBar.setVisible(false);
                            var a;
                            this._searchHelpInput(a, that, oRowsModel, oValueHelpDialog);
                        }

                        // *****************************************
                        // Eliminamos la busqueda basica, los botones y 
                        //cambiamos el nombre al de buscar
                        var contentTool = oFilterBar.getContent();
                        var basicSearch = contentTool[0].getContent();
                        var botonGo = "btnGo";
                        var botonShowHide = "btnShowHide";
                        for (var i = 0; i < basicSearch.length; i++) {
                            var encontrado = basicSearch[i].getId().search(botonGo);
                            if (encontrado >= 0) {
                                basicSearch[i].setText("Buscar");
                            } else {
                                encontrado = basicSearch[i].getId().search(botonShowHide);
                                if (encontrado >= 0) {
                                    basicSearch[i].setVisible(false);
                                }
                            }
                        }
                        oValueHelpDialog.setFilterBar(oFilterBar);
                        oValueHelpDialog.open();
                        oValueHelpDialog.update();
                    });


                }
            }

            function oDataF4Error(oError) { }
        },

        _searchHelpInput: function (oEvt, that, oRowsModel, oValueHelpDialog) {
            var oFilterArr = [];
            if (oEvt !== undefined) {
                var oSource = oEvt.getSource();

                //	Comprobamos si estamos en Advanced Search para obtener el valor de los demas campos
                if (oSource.getAdvancedMode() === true) {
                    var FilterAdv = oEvt.getParameters().selectionSet;
                    for (var i = 0; i < FilterAdv.length; i++) {
                        var value = FilterAdv[i].getProperty("value");
                        if (value !== "") {
                            var oFilter = new sap.ui.model.Filter(FilterAdv[i].getId(), sap.ui.model.FilterOperator.Contains, value);
                            oFilterArr.push(oFilter);
                        }
                    }
                }
            }

            // Debemos comprobar si tenemos campos de entrada pero que son invisibles. 
            // Esto quiere decir que se deberin de sacar de los datos de pantalla
            var modelInvisibleInput = that.getModel("invisibleInput");
            if (modelInvisibleInput !== undefined) {
                for (var k = 0; k < modelInvisibleInput.length; k++) {
                    var value = undefined;
                    var odataName = md.fiori.UtilityHada.getOdataNameFromSapName(modelInvisibleInput[k].Fieldname);

                    var values = undefined;
                    try {
                        values = that.getView().byId(odataName).getTokens();
                    } catch (e) {

                        try {
                            var value = that.getView().byId(odataName).getValue();
                        } catch (e) {
                            try {
                                var value = that.getView().byId(odataName).getText();
                            } catch (e) {
                            }
                        }
                    }
                    if (value === undefined) {
                        // Lo buscamos en el objeto
                        value = that[odataName];
                    }
                    // Para el contrato lo gestionamos asi ya que puede haber varios
                    if (values !== undefined) {
                        var l_values = undefined;
                        for (var x = 0; x < values.length; x++) {
                            if (l_values !== undefined) {
                                l_values = l_values + ',' + values[x].getKey();
                            } else {
                                l_values = values[x].getKey();
                            }
                        }
                        oFilterArr.push(that._createSearchFilterObject(modelInvisibleInput[k].Fieldname, sap.ui.model.FilterOperator.EQ,
                            l_values));
                        values = undefined;
                    } else {
                        var oFilter = new sap.ui.model.Filter(modelInvisibleInput[k].Fieldname, sap.ui.model.FilterOperator.Contains, value);
                        oFilterArr.push(oFilter);
                    }

                }
            }
            if (oFilterArr !== null) {
                var mHeaders = {};
                for (var i = 0; i < oFilterArr.length; i++) {
                    mHeaders[oFilterArr[i].sPath] = oFilterArr[i].oValue1;
                }
            }

            var oModel = that.getView().getModel("F4Generic");
            oModel.setHeaders(mHeaders);
            var those = that;
            oModel.read("/F4DynamicCollPostSet", {
                urlParameters: {
                    search: those.fieldSearch,
                },
                success: fSuccess,
                error: oDataF4Error
            });

            function fSuccess(oData, response) {
                those.searchHelpJson = response.data.results;
                var columnModel = those.getModel("columnsArrTotal");
                var tableResult = md.fiori.UtilityHada.getResultsVhdDynamic(those.searchHelpJson, columnModel);
                var oRowsModel = oValueHelpDialog.getTable().getModel();
                oRowsModel.setData(tableResult);
                oValueHelpDialog.getTable().setModel(oRowsModel);
                oValueHelpDialog.getTable().bindRows("/");
            }

            function oDataF4Error(oError) { }
        }

    });

});