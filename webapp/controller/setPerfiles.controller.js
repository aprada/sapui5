sap.ui.define([
    "./BaseController",
    "sap/ui/model/SimpleType",
    "sap/ui/model/ValidateException",
    "sap/ui/core/Core",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "sap/m/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, SimpleType, ValidateException, Core, JSONModel, MessageBox, MessageToast, History, library) {
        "use strict";

        jQuery.sap.registerModulePath("hada.md.zfgghadagestorperfiles", "/sap/bc/ui5_ui5/sap/zfgg_hd_gestorp");



        return BaseController.extend("zfgghadamantenimientousuario.zfgghadamantusuario.controller.setPerfiles", {
            onInit: function () {

                //md.fiori.UtilityHada.setControllerInstance(this, "Perfil");
                debugger;
                //
                var main = md.fiori.UtilityHada.getControllerInstance("main");
                this.getView().setModel(main.getModel("usuario"), "main");
                //Unsuscribe Eventos...............................
                sap.ui.getCore().getEventBus().unsubscribe("hada.md.zfgghadamantusuario.ui5", "closeGestorPerfil", jQuery.proxy(this._onCancelar, this));
                sap.ui.getCore().getEventBus().subscribe("hada.md.zfgghadamantusuario.ui5", "closeGestorPerfil", jQuery.proxy(this._onCancelar, this));
                //this.getRouter().getRoute("Perfiles").attachPatternMatched(this._onMasterMatched, this);

            },
            _onMasterMatched: function () {
                debugger
            },
            onSavePerfil: function (oEvent) {

            },

            _onCancelar: function (oEvent) {
                sap.ushell.Container.getRenderer("fiori2").showHeaderItem("backBtn", false);
                var sPreviousHash = History.getInstance().getPreviousHash(),
                    oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

                if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
                    history.go(-1);
                } else {
                    this.getRouter().navTo("RouteMain", {}, true);
                }

                sap.ui.getCore().getEventBus().unsubscribe("hada.md.zfgghadamantusuario.ui5", "closeGestorPerfil", jQuery.proxy(this._onCancelar, this));
            },


        });
    });
