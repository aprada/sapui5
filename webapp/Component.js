/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "zfgghadamantenimientousuario/zfgghadamantusuario/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";
                
        return UIComponent.extend("zfgghadamantenimientousuario.zfgghadamantusuario.Component", {
            
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                
                var aplicationType = new sap.ui.model.json.JSONModel({
                    help: false,
                    required: true,
                    helpOnly:false,
                    modif: false,
                    visu: false,
                    baja: false,
                    selectionMode: 'MultiToggle'
                });
                //Obtenemos los parámetros........
                var parameters = this.getComponentData().startupParameters;
                try {
                    if (parameters.modif[0] === 'X'){
                        aplicationType.getData().help = true;
                        aplicationType.getData().helpOnly = false;
                        aplicationType.getData().modif = true;
                        
                    }
                } catch (error) {
                    
                    aplicationType.getData().modif = false;
                }

                try {
                    if (parameters.visu[0] === 'X'){
                        aplicationType.getData().help = true;
                        aplicationType.getData().helpOnly = false;
                        aplicationType.getData().required = false;
                        aplicationType.getData().visu = true;
                        aplicationType.getData().selectionMode = 'None';
                    }
                } catch (error) {
                    
                    aplicationType.getData().visu = false;
                }

                try {
                    if (parameters.baja[0] === 'X'){
                        aplicationType.getData().help = true;
                        aplicationType.getData().helpOnly = false;
                        aplicationType.getData().required = false;
                        aplicationType.getData().baja = true;
                        aplicationType.getData().selectionMode = 'None';
                    }
                } catch (error) {
                    
                    aplicationType.getData().baja = false;
                }

                this.setModel(aplicationType, "aplicationType");
                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
  
                
            },
            destroy: function () {
                //Bloqueos...................
                try {
                    var main = md.fiori.UtilityHada.getControllerInstance("main");
                    if (main.oldUser !== '') {
                        fetch("/sap/zfgg_hada_userp?&Bname=" + main.oldUser + "&accion=DESBLOQUEAR", {
                            method: 'GET',
                            keepalive: true
                        });
                    }
                } catch (error) {
                    
                }
                
                //
                UIComponent.prototype.destroy.apply(this, arguments);
            },
    
            /**
             * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
             * design mode class should be set, which influences the size appearance of some controls.
             * @public
             * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
             */
            getContentDensityClass: function () {
                if (this._sContentDensityClass === undefined) {
                    // check whether FLP has already set the content density class; do nothing in this case
                    // eslint-disable-next-line sap-no-proprietary-browser-api
                    if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                        this._sContentDensityClass = "";
                    } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                        this._sContentDensityClass = "sapUiSizeCompact";
                    } else {
                        // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                        this._sContentDensityClass = "sapUiSizeCozy";
                    }
                }
                return this._sContentDensityClass;
            }
        });
    }
);