sap.ui.define([
    "./BaseController",
    "sap/ui/model/SimpleType",
    "sap/ui/model/ValidateException",
    "sap/ui/core/Core",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, SimpleType, ValidateException, Core, JSONModel, MessageBox, MessageToast) {
        "use strict";

        //jQuery.sap.registerModulePath("hada.md.zfgghadagestorperfiles", "/sap/bc/ui5_ui5/sap/zfgg_hd_gestorp");

        return BaseController.extend("zfgghadamantenimientousuario.zfgghadamantusuario.controller.Main", {
            onInit: function () {

                var oView = this.getView(),
                    oMM = Core.getMessageManager();
                //md.fiori.UtilityHada.setControllerInstance(this, "main");
                var component = md.fiori.UtilityHada.getControllerInstance("component");
                // attach handlers for validation errors
                oMM.registerObject(oView.byId("I_BNAME"), true);
                oMM.registerObject(oView.byId("correo"), true);
                this.modifChangeFields = false;
                this.modifAplication = false;
                this.bajaAplication = false;
                this.visuAplication = false;
                this.createAplication = false;
                this.primeraEjecucion = true;
                this.oldUser = '';

                this.getRouter().getRoute("RouteMain").attachPatternMatched(this._onMasterMatched, this);

            },
            _onMasterMatched: function () {
                md.fiori.UtilityHada.setControllerInstance(this, "main");
                this.modifAplication = this.getView().getModel("aplicationType").getData().modif;
                this.bajaAplication = this.getView().getModel("aplicationType").getData().baja;
                this.visuAplication = this.getView().getModel("aplicationType").getData().visu;

                if (this.modifAplication === true) {
                    this.getView().byId("tituloApp").setText('Modificación Usuario');
                } else if (this.visuAplication === true) {
                    this.getView().byId("tituloApp").setText('Consulta Usuario');
                } else if (this.bajaAplication === true) {
                    this.getView().byId("tituloApp").setText('Baja de Usuario');
                } else {
                    this.getView().byId("tituloApp").setText('Creación Usuario');
                    this.createAplication = true;
                }

                if (this.primeraEjecucion === true) {
                    this._readOnlyFields();
                    this.primeraEjecucion = false;
                } else {
                    this._getDatosPerfil(this.getView().byId("I_BNAME").getValue());
                }
                //Si entramos en modo visualización
                if (this.visuAplication === true) {
                    this.getView().byId("save").setVisible(false);
                    this.getView().byId("footer").setVisible(false);

                }

                //Si entramos en modo visualización
                if (this.bajaAplication === true) {
                    this.getView().byId("save").setVisible(false);
                    this.getView().byId("baja").setVisible(true);
                    this.getView().byId("footer").setVisible(false);

                }

            },
            _readOnlyFields: function () {
                var oView = this.getView();
                oView.byId("nombre").setEditable(false);
                oView.byId("nif").setEditable(false);
                oView.byId("I_BUKRS").setEditable(false);
                oView.byId("I_GSBER").setEditable(false);
                oView.byId("I_FM_FICTR").setEditable(false);
                oView.byId("apellidos").setEditable(false);
                oView.byId("correo").setEditable(false);
                oView.byId("fechafin").setEditable(false);


            },
            _editableFields: function () {
                var oView = this.getView();
                oView.byId("nombre").setEditable(true);
                oView.byId("nif").setEditable(true);
                oView.byId("I_BUKRS").setEditable(true);
                oView.byId("I_GSBER").setEditable(true);
                oView.byId("I_FM_FICTR").setEditable(true);
                oView.byId("apellidos").setEditable(true);
                oView.byId("correo").setEditable(true);
                oView.byId("fechafin").setEditable(true);

            },
            _cleanFieldsValueState: function () {

                var oView = this.getView();
                oView.byId("nombre").setValueState("None");
                oView.byId("nif").setValueState("None");
                oView.byId("I_BUKRS").setValueState("None");
                oView.byId("I_GSBER").setValueState("None");
                oView.byId("I_FM_FICTR").setValueState("None");
                oView.byId("apellidos").setValueState("None");
                oView.byId("correo").setValueState("None");
                oView.byId("fechafin").setValueState("None");


            },
            _cleanFields: function () {

                var oView = this.getView();
                oView.byId("nombre").setValue("");
                oView.byId("nombre").setValueState("None");
                oView.byId("nif").setValue("");
                oView.byId("nif").setValueState("None");
                oView.byId("I_BUKRS").setValue("");
                oView.byId("I_BUKRS").setValueState("None");
                oView.byId("I_GSBER").setValue("");
                oView.byId("I_GSBER").setValueState("None");
                oView.byId("I_FM_FICTR").setValue("");
                oView.byId("I_FM_FICTR").setValueState("None");
                oView.byId("I_BUKRST").setValue("");
                oView.byId("I_GSBERT").setValue("");
                oView.byId("I_FM_FICTRT").setValue("");
                oView.byId("apellidos").setValue("");
                oView.byId("apellidos").setValueState("None");
                oView.byId("correo").setValue("");
                oView.byId("correo").setValueState("None");
                //oView.byId("fechafin").setValue("");
                oView.byId("fechafin").setValueState("None");

                //
                oView.byId("fechafin").setValue("");
                oView.byId("usumod").setValue("");
                oView.byId("fechamod").setValue("");
                var areaMsg = this.byId("areaMsg");
                areaMsg.setVisible(false);

                var wizard = this.byId("CreateUsuarioWizard");
                wizard.setCurrentStep(this.getView().getId() + "--DatosUsuarioStep")

                this.modifChangeFields = false;

            },
            _getDatosUsuario: function (Bname) {
                var that = this;
                this._openBusyDialog("Cargando Datos...");
                this.getModel().read("/mantenimientoUsuarioSet(Bname='" + Bname + "')", {
                    success: function (oData) {
                        var model = new sap.ui.model.json.JSONModel(oData);
                        that.setModel(model, "usuario");
                        if (that.visuAplication === true || that.bajaAplication === true) {
                            that._readOnlyFields();
                        } else {
                            that._editableFields();
                        }

                        that._closeBusyDialog();
                    },
                    error: function () {
                        MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("msg4"));

                    }
                });
            },
            _getDatosPerfil: function (Bname) {
                var that = this;
                //this._openBusyDialog("Cargando Datos...");
                var Filters = []
                Filters.push(this._createSearchFilterObject("Bname", sap.ui.model.FilterOperator.EQ, Bname));
                this.getModel().read("/asigPerfilUsuarioSet", {
                    filters: Filters,
                    success: function (oData) {
                        var model = new sap.ui.model.json.JSONModel(oData.results);
                        that.setModel(model, "usuarioPerfil");
                        //that._editableFields();
                        //that._closeBusyDialog();
                    },
                    error: function () {
                        MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("msg8"));

                    }
                });
            },
            _validateInput: function (oInput) {
                var sValueState = "None";
                var bValidationError = false;
                var oBinding = oInput.getBinding("value");

                oInput.setValue(oInput.getValue().toUpperCase());

                try {
                    oBinding.getType().validateValue(oInput.getValue());
                } catch (oException) {
                    sValueState = "Error";
                    bValidationError = true;
                }

                oInput.setValueState(sValueState);

                return bValidationError;
            },

            modifChange: function (oEvent) {

                this.modifChangeFields = true;

                var field = this.byId(oEvent.mParameters.id);

                if (oEvent.mParameters.id !== this.getView().getId() + "--correo") {
                    field.setValue(field.getValue().toUpperCase())
                }
                var wizard = this.byId("CreateUsuarioWizard");
                wizard.setCurrentStep(this.getView().getId() + "--DatosUsuarioStep")

            },

            onLoginChange: function (oEvent) {
                var oInput = oEvent.getSource();
                this._validateInput(oInput);

                if (this.oldUser !== '') {
                    this._denqueue(this.oldUser);
                }

                this.oldUser = oInput.getValue();

                var that = this;
                this._openBusyDialog("Validando usuario...");

                if (this.visuAplication === true) {
                    this.getModel().read("/checkUsuarioSet(Bname='" + oInput.getValue() + "')", {
                        success: function (oData) {
                            that._closeBusyDialog();
                            switch (oData.Estado) {
                                case "1": //El usuario existe en el sistema
                                    that._readOnlyFields();
                                    that._cleanFields();
                                    if (that.modifAplication === false) {
                                        that._getDatosUsuario(oData.Bname);
                                        that._getDatosPerfil(oData.Bname);
                                        var areaMsg = that.byId("areaMsg");
                                        areaMsg.setText("");
                                        areaMsg.setVisible(false);
                                    }
                                    break; //El usuario existe en el sistema pero esta dado de baja
                                default: //El usuario no existe en el sistema
                                    that._readOnlyFields();
                                    that._cleanFields();
                                    MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("msg18"));
                                    break;
                            }
                        },
                        error: function () {
                            that._closeBusyDialog();
                            that._readOnlyFields();
                            that._cleanFields();
                            MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("msg3"));

                        }
                    });
                } else {

                    setTimeout(() => {
                        fetch("/sap/zfgg_hada_userp?&Bname=" + oInput.getValue() + "&accion=BLOQUEAR", {
                            method: 'GET',
                            keepalive: true
                        }).then(function (data) {
                            return data.json();

                        }).then(function (data) {
                            if (data.TYPE === 'S') {

                                //Chequeamos que el usuario no este dado de alta en el sistema
                                that.getModel().read("/checkUsuarioSet(Bname='" + oInput.getValue() + "')", {
                                    success: function (oData) {
                                        that._closeBusyDialog();
                                        switch (oData.Estado) {
                                            case "1": //El usuario existe en el sistema
                                                that._readOnlyFields();
                                                that._cleanFields();
                                                if (that.modifAplication === false && that.bajaAplication === false) { //creacción de usuario
                                                    that._denqueue(that.oldUser);
                                                    that._cleanFields();
                                                    oInput.setValue('');
                                                    var areaMsg = that.byId("areaMsg");
                                                    areaMsg.setText(that.getView().getModel("i18n").getResourceBundle().getText("msg7"));
                                                    areaMsg.setVisible(true);
                                                } else if (that.bajaAplication === true) {
                                                    that._getDatosUsuario(oData.Bname);
                                                    that._getDatosPerfil(oData.Bname);
                                                    var areaMsg = that.byId("areaMsg");
                                                    areaMsg.setText("");
                                                    areaMsg.setVisible(false);
                                                } else {
                                                    that._getDatosUsuario(oData.Bname);
                                                    that._getDatosPerfil(oData.Bname);
                                                    var areaMsg = that.byId("areaMsg");
                                                    areaMsg.setText("");
                                                    areaMsg.setVisible(false);
                                                }
                                                break; //El usuario existe en el sistema pero esta dado de baja
                                            case "2":
                                                that._cleanFields();
                                                if (that.createAplication === true) {


                                                    MessageBox.warning("El usuario existe en el sistema con estado inactivo, desea continuar?.", {
                                                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                                        emphasizedAction: MessageBox.Action.OK,
                                                        onClose: function (sAction) {
                                                            switch (sAction) {
                                                                case 'OK':
                                                                    that._getDatosUsuario(oData.Bname);
                                                                    that.modifChangeFields = true;
                                                                    break;

                                                                default:
                                                                    that._denqueue(that.oldUser);
                                                                    that._cleanFields();
                                                                    oInput.setValue('');
                                                                    break;
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    that._denqueue(that.oldUser);
                                                    that._cleanFields();
                                                    oInput.setValue('');
                                                    MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("msg20"));
                                                }
                                                break;
                                            default: //El usuario no existe en el sistema
                                                that._cleanFields();

                                                if (that.modifAplication === false) {


                                                    var dateFechaFin = new Date(9999, 11, 31);
                                                    //dateFechaFin.setHours(-12)

                                                    var usuario = {
                                                        Bname: oData.Bname,
                                                        Stcd1: "",
                                                        NameFirst: "",
                                                        NameLast: "",
                                                        SmtpAddr: "",
                                                        Bukrs: "",
                                                        Butxt: "",
                                                        Gsber: "",
                                                        Gtext: "",
                                                        Fictr: "",
                                                        FictrDescr: "",
                                                        StatusHdusr: "",
                                                        ZFfvalus: dateFechaFin,
                                                        ZUua: "",
                                                        ZFua: new Date()

                                                    }
                                                    var model = new sap.ui.model.json.JSONModel(usuario);
                                                    that.setModel(model, "usuario");
                                                    that._editableFields();
                                                } else {
                                                    that._readOnlyFields();
                                                    MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("msg19"));
                                                }
                                                break;
                                        }
                                    },
                                    error: function () {
                                        that._closeBusyDialog();
                                        MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("msg3"));

                                    }
                                });
                            } else {
                                that._closeBusyDialog();
                                MessageToast.show(data.MSG);
                            }
                        }).catch(function (err) {
                            MessageToast.show("Something went wrong... " + err);
                        });
                     }, 2000);
                 }
            },
            _denqueue: function (bname) {
                fetch("/sap/zfgg_hada_userp?&Bname=" + bname + "&accion=DESBLOQUEAR", {
                    method: 'GET',
                    keepalive: true
                });


            },
            nifValid: function (oEvent) {
                this.modifChangeFields = true;
                var oInput = oEvent.getSource();
                oInput.setValue(oInput.getValue().toUpperCase());
                var that = this;
                this._openBusyDialog("Validando NiF...");
                var mHeaders = {};
                mHeaders.user = this.getView().byId("I_BNAME").getValue();
                this.getModel().setHeaders(mHeaders);
                //Chequeamos que el usuario no este dado de alta en el sistema
                this.getModel().read("/checkNifSet(Stcd1='" + oInput.getValue() + "')", {
                    success: function (oData) {
                        that._closeBusyDialog();
                        if (oData.Error === true) {
                            oInput.setValueStateText('Nif no valido');
                            oInput.setValueState("Error");
                        } else {
                            oInput.setValueStateText('');
                            oInput.setValueState("None");
                        }

                    },
                    error: function (oError, oResponse, aErrorResponse) {
                        that._closeBusyDialog();
                        that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);
                        oInput.setValueState("Error");

                    }
                });
            },
            gsberValid: function (oEvent) {
                this.modifChangeFields = true;
                var oInput = oEvent.getSource();
                oInput.setValue(oInput.getValue().toUpperCase());
                var that = this;
                this._openBusyDialog("Validando División...");
                //Chequeamos que la división exista en el sistema
                if ( oInput.getValue() != "") {
                    this.getModel().read("/checkGsberSet(Gsber='" + oInput.getValue() + "')", {
                        success: function (oData) {
                            that._closeBusyDialog();
                            that.byId("I_GSBERT").setValue(oData.Gtext);
                            if (oData.Error === true) {
                                oInput.setValueStateText('División no existe');
                                oInput.setValueState("Error");
                            } else {
                                oInput.setValueStateText('');
                                oInput.setValueState("None");
                            }

                        },
                        error: function (oError, oResponse, aErrorResponse) {
                            that._closeBusyDialog();
                            that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);
                            oInput.setValueState("Error");

                        }
                    });
                } else {
                    that._closeBusyDialog();
                    that.byId("I_GSBERT").setValue("");  
                }
            },

            fictrValid: function (oEvent) {
                this.modifChangeFields = true;
                var oInput = oEvent.getSource();
                oInput.setValue(oInput.getValue().toUpperCase());
                var that = this;
                this._openBusyDialog("Validando Centro Gestor...");
                //Chequeamos que el centro gestor exista en el sistema
                if ( oInput.getValue() != "") {
                    this.getModel().read("/checkFictrSet(Fictr='" + oInput.getValue() + "')", {
                        success: function (oData) {
                            that._closeBusyDialog();
                            that.byId("I_FM_FICTRT").setValue(oData.Beschr);
                            if (oData.Error === true) {
                                oInput.setValueStateText('Centro Gestor no existe');
                                oInput.setValueState("Error");
                            } else {
                                oInput.setValueStateText('');
                                oInput.setValueState("None");
                            }

                        },
                        error: function (oError, oResponse, aErrorResponse) {
                            that._closeBusyDialog();
                            that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);
                            oInput.setValueState("Error");

                        }
                    });
                } else {
                    that._closeBusyDialog();
                    that.byId("I_FM_FICTRT").setValue("");  
                }
            },

            handleNavigationChange: function (oEvent) {
                debugger
            },

            saveUsuario: function (oEvent) {

                var error = this._validateObjectForm();

                if (error === false) {
                    var that = this;
                    var usuario = this.getModel("usuario").getData();

                    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern: "yyyMMdd"
                    });

                    usuario.ZFfvalus.setHours(12); //= dateFormat.format(usuario.ZFfvalus);

                    this._openBusyDialog("Grabando datos...");
                    if (this.modifAplication === true) {
                        var mHeaders = {};
                        mHeaders.modif = "X";
                        this.getModel().setHeaders(mHeaders);
                    }
                    this.getModel().create("/mantenimientoUsuarioSet", usuario, {
                        success: function (oData, response) {
                            that.byId("usumod").setValue(oData.ZUua);
                            that.byId("fechamod").setDateValue(oData.ZFua);
                            that._closeBusyDialog();
                            that._cleanFieldsValueState();
                            var areaMsg = that.byId("areaMsg");
                            areaMsg.setText(that.getView().getModel("i18n").getResourceBundle().getText("msg6"));
                            areaMsg.setVisible(true);
                            that.modifChangeFields = false;
                            if (that.modifAplication === false) {
                                that._readOnlyFields();

                            }
                        },
                        error: function (oError, oResponse, aErrorResponse) {
                            that._closeBusyDialog();
                            that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);
                            var areaMsg = that.byId("areaMsg");
                            areaMsg.setVisible(false);
                        }
                    });
                }

            },

            bajaUsuario: function () {
                //Reiniciamos area de mensaje............................
                var areaMsg = this.byId("areaMsg");
                areaMsg.setText('');
                areaMsg.setVisible(false);

                var usuario = this.getModel("usuario").getData();
                var baja = {
                    Bname: usuario.Bname,
                    Url: ''
                }
                var that = this;
                MessageBox.warning("Desea continuar con la baja definitiva del usuario?.", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        switch (sAction) {
                            case 'OK':
                                that._openBusyDialog("Realizando la baja del usuario...");
                                that.getModel().create("/bajaTotalUsuarioSet", baja, {
                                    success: function (oData, response) {
                                        that._closeBusyDialog();
                                        that._cleanFields();
                                        that._cleanFieldsValueState();
                                        that._readOnlyFields();
                                        that.getView().byId("I_BNAME").setValue("");
                                        that._denqueue(usuario.Bname);
                                        var areaMsg = that.byId("areaMsg");
                                        areaMsg.setText(that.getView().getModel("i18n").getResourceBundle().getText("msg16"));
                                        areaMsg.setVisible(true);

                                        if (oData.Url !== '') {
                                            var fileURL = window.location.origin + oData.Url;
                                            var encodeUrl = encodeURI(fileURL);
                                            sap.m.URLHelper.redirect(encodeUrl, false);
                                        } else {
                                            MessageBox.success('Borrado realizado correctamente, no hay que dar ningún rol de baja');
                                        }


                                    },
                                    error: function (oError, oResponse, aErrorResponse) {
                                        that._closeBusyDialog();
                                        that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);
                                        var areaMsg = that.byId("areaMsg");
                                        areaMsg.setVisible(false);
                                    }
                                });

                                break;

                            default:
                                var areaMsg = that.byId("areaMsg");
                                areaMsg.setVisible(false);
                                break;
                        }
                    }
                });

            },

            _validateObjectForm: function () {
                var lError = false;

                var formParam = this.byId("principal");
                var content = formParam.getContent();
                for (let index = 0; index < content.length; index++) {
                    const element = content[index];
                    if (element.getId() === this.getView().getId() + '--I_BNAME' ||
                        element.getId() === this.getView().getId() + '--nombre' ||
                        element.getId() === this.getView().getId() + '--nif' ||
                        element.getId() === this.getView().getId() + '--I_BUKRS' ||
                        element.getId() === this.getView().getId() + '--I_GSBER' ||
                        element.getId() === this.getView().getId() + '--I_FM_FICTR' ||
                        element.getId() === this.getView().getId() + '--apellidos' || 
                        element.getId() === this.getView().getId() + '--correo') {
                        if (element.getValue().trim() === '') {
                            if (element.getId() != this.getView().getId() + '--correo' && 
                                element.getId() != this.getView().getId() + '--I_GSBER' && 
                                element.getId() != this.getView().getId() + '--I_FM_FICTR') {
                            //obtener los datos de un input simple
                                lError = true;
                                var areaMsg = this.byId("areaMsg");
                                areaMsg.setText(this.getView().getModel("i18n").getResourceBundle().getText("msg1"));
                                areaMsg.setVisible(true);
                                element.setValueState("Error");
                            }

                        } else if (element.getValueState() === 'Error' &&
                            (element.getId() === this.getView().getId() + '--nif' || element.getId() === this.getView().getId() + '--correo')) {
                            lError = true;
                            var areaMsg = this.byId("areaMsg");
                            areaMsg.setText(this.getView().getModel("i18n").getResourceBundle().getText("msg15"));
                            areaMsg.setVisible(true);
                            element.setValueState("Error");
                        } else {

                            element.setValueState("None");

                        }
                    }

                    if (lError === false) {
                        var areaMsg = this.byId("areaMsg");
                        areaMsg.setVisible(false);
                    }

                }

                if (this.byId("I_BNAME").getValue() === '') {
                    lError = true;
                    var areaMsg = this.byId("areaMsg");
                    areaMsg.setText(this.getView().getModel("i18n").getResourceBundle().getText("msg17"));
                    areaMsg.setVisible(true);
                }

                if (lError === false) {

                    var fechafin = this.byId("fechafin").getDateValue(),
                        sDay = fechafin.getDate(),
                        sMonth = fechafin.getMonth() + 1,
                        sYear = fechafin.getFullYear();
                        if (sMonth < 10) { sMonth = '0' + sMonth }
                        if (sDay < 10) { sDay = '0' + sDay }
                        fechafin='' + sYear + '' + sMonth + '' + sDay;

                    var sToday = new Date();
                        sDay = sToday.getDate(),
                        sMonth = sToday.getMonth() + 1,
                        sYear = sToday.getFullYear();
                        if (sMonth < 10) { sMonth = '0' + sMonth }
                        if (sDay < 10) { sDay = '0' + sDay }
                        sToday='' + sYear + '' + sMonth + '' + sDay;

                    if (fechafin < sToday) {
                        lError = true;
                        var areaMsg = this.byId("areaMsg");
                        areaMsg.setText(this.getView().getModel("i18n").getResourceBundle().getText("msg5"));
                        areaMsg.setVisible(true);
                        fechafin.setValueState("Error");
                    }

                }
                return lError;
            },

            onNextButton: function (oEvent) {
                //this.byId( "CreateUsuarioWizard");
                var error = this._validateObjectForm();
                if (error === false) {
                    if (this.modifChangeFields === true) {
                        var that = this;
                        MessageBox.warning("Para continuar es necesario grabar los datos primero, desea grabar y continuar?.", {
                            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                switch (sAction) {
                                    case 'OK':
                                        var error = that._validateObjectForm();

                                        if (error === false) {
                                            var usuario = that.getModel("usuario").getData();
                                            that._openBusyDialog("Grabando datos...");
                                            if (that.modifAplication === true) {
                                                var mHeaders = {};
                                                mHeaders.modif = "X";
                                                that.getModel().setHeaders(mHeaders);
                                            }
                                            usuario.ZFfvalus.setHours(12);
                                            that.getModel().create("/mantenimientoUsuarioSet", usuario, {
                                                success: function (oData, response) {
                                                    that._closeBusyDialog();
                                                    that._cleanFieldsValueState();
                                                    var areaMsg = that.byId("areaMsg");
                                                    areaMsg.setText(that.getView().getModel("i18n").getResourceBundle().getText("msg6"));
                                                    areaMsg.setVisible(true);
                                                    that.modifChangeFields = false;
                                                    that.byId("CreateUsuarioWizard").nextStep();
                                                    if (that.modifAplication === false) {
                                                        that._readOnlyFields();

                                                    }
                                                },
                                                error: function (oError, oResponse, aErrorResponse) {
                                                    that._closeBusyDialog();
                                                    that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);
                                                    var areaMsg = that.byId("areaMsg");
                                                    areaMsg.setVisible(false);
                                                }
                                            });
                                        }
                                        break;

                                    default:
                                        var areaMsg = that.byId("areaMsg");
                                        areaMsg.setVisible(false);
                                        break;
                                }
                            }
                        });
                    } else {
                        var wizard = this.byId("CreateUsuarioWizard");
                        wizard.setCurrentStep(this.getView().getId() + "--DatosUsuarioStep")
                        this.byId("CreateUsuarioWizard").nextStep();
                    }
                }
            },

            addPerfil: function (oEvent) {
                // Realizamos la navegación........................................
                this.getRouter().navTo("setPerfiles", {
                    BNAME: btoa(this.getView().byId("I_BNAME").getValue())
                });

            },
            deletePerfil: function (oEvent) {
                var indices = this.getView().byId("table").getSelectedIndices();
                var perfiles = this.getModel("usuarioPerfil").getData();



                if (indices.length > 0) {
                    var xml = '<?xml version="1.0" encoding="UTF-8"?>';
                    xml = xml + '<CONTENT>';
                    var error = false;
                    for (let index = 0; index < indices.length; index++) {
                        const element = indices[index];

                        if (perfiles[element].Estado !== 'I') {
                            error = true;
                        }
                        xml = xml + '<PERFIL>';
                        xml = xml + '<Bname>' + perfiles[element].Bname + '</Bname>';
                        xml = xml + '<CodPerfil>' + perfiles[element].CodPerfil + '</CodPerfil>';
                        xml = xml + '<Cont>' + perfiles[element].Cont + '</Cont>';
                        xml = xml + '</PERFIL>';
                    }

                    xml = xml + '</CONTENT>';
                    if (error === false) {
                        var delPerfiles = {
                            Estado: 'I',
                            Data: xml
                        };

                        this._openBusyDialog("Borrando registros...");
                        var that = this;
                        this.getModel().create("/operacionPerfilSet", delPerfiles, {
                            success: function (oData, response) {
                                that._closeBusyDialog();
                                MessageBox.success('Borrado realizado correctamente');
                                that._getDatosPerfil(that.getView().byId("I_BNAME").getValue());

                            },
                            error: function (oError, oResponse, aErrorResponse) {
                                that._closeBusyDialog();
                                that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);

                            }
                        });


                    } else {
                        //Mensaje de error
                        MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("msg9"));
                    }
                } else {
                    //Mensaje de error
                    MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("msg10"));
                }

            },
            altaPerfil: function (oEvent) {
                var indices = this.getView().byId("table").getSelectedIndices();
                var perfiles = this.getModel("usuarioPerfil").getData();


                var lFilter = [];
                if (indices.length > 0) {
                    var xml = '<?xml version="1.0" encoding="UTF-8"?>';
                    xml = xml + '<CONTENT>';
                    var error = false;
                    for (let index = 0; index < indices.length; index++) {
                        const element = indices[index];

                        if (perfiles[element].Estado !== 'I') {
                            error = true;
                        }
                        xml = xml + '<PERFIL>';
                        xml = xml + '<Bname>' + perfiles[element].Bname + '</Bname>';
                        xml = xml + '<CodPerfil>' + perfiles[element].CodPerfil + '</CodPerfil>';
                        xml = xml + '<Cont>' + perfiles[element].Cont + '</Cont>';
                        lFilter.push(this._createSearchFilterObject("CodPerfil", sap.ui.model.FilterOperator.BT, perfiles[element].CodPerfil, perfiles[element].Cont));
                        xml = xml + '</PERFIL>';
                    }

                    xml = xml + '</CONTENT>';
                    if (error === false) {
                        var delPerfiles = {
                            Estado: 'P',
                            Data: xml
                        };

                        this._openBusyDialog("Dando de alta los perfiles...");
                        var that = this;
                        this.getModel().create("/operacionPerfilSet", delPerfiles, {
                            success: function (oData, response) {
                                that._closeBusyDialog();

                                that._openBusyDialog("Descargando fichero...");
                                lFilter.push(that._createSearchFilterObject("Bname", sap.ui.model.FilterOperator.EQ, that.getView().byId("I_BNAME").getValue()));
                                lFilter.push(that._createSearchFilterObject("Estado", sap.ui.model.FilterOperator.EQ, 'P'));
                                //
                                // Hacemos la lectura correspondiente................
                                that.getModel().read("/generacionXlsSet", {
                                    filters: lFilter,
                                    success: function (oData, response) {
                                        that._closeBusyDialog();
                                        if (oData.results[0].Url !== '') {
                                            var fileURL = window.location.origin + oData.results[0].Url;
                                            var encodeUrl = encodeURI(fileURL);
                                            sap.m.URLHelper.redirect(encodeUrl, false);
                                            MessageBox.success('Se realizo correctamente el provisionamiento');
                                        } else {
                                            MessageBox.success('Se realizo correctamente el provisionamiento, no hay que dar ningún rol de alta');
                                        }




                                    },
                                    error: function (oError, oResponse, aErrorResponse) {
                                        that._closeBusyDialog();
                                        that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);
                                    }
                                });

                                that._getDatosPerfil(that.getView().byId("I_BNAME").getValue());

                            },
                            error: function (oError, oResponse, aErrorResponse) {
                                that._closeBusyDialog();
                                that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);

                            }
                        });


                    } else {
                        //Mensaje de error
                        MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("msg14"));
                    }
                } else {
                    //Mensaje de error
                    MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("msg13"));
                }

            },
            bajaPerfil: function (oEvent) {
                var indices = this.getView().byId("table").getSelectedIndices();
                var perfiles = this.getModel("usuarioPerfil").getData();


                var lFilter = [];
                if (indices.length > 0) {
                    var xml = '<?xml version="1.0" encoding="UTF-8"?>';
                    xml = xml + '<CONTENT>';
                    var error = false;
                    for (let index = 0; index < indices.length; index++) {
                        const element = indices[index];

                        if (perfiles[element].Estado !== 'P') {
                            error = true;
                        }
                        xml = xml + '<PERFIL>';
                        xml = xml + '<Bname>' + perfiles[element].Bname + '</Bname>';
                        xml = xml + '<CodPerfil>' + perfiles[element].CodPerfil + '</CodPerfil>';
                        xml = xml + '<Cont>' + perfiles[element].Cont + '</Cont>';
                        lFilter.push(this._createSearchFilterObject("CodPerfil", sap.ui.model.FilterOperator.BT, perfiles[element].CodPerfil, perfiles[element].Cont));
                        xml = xml + '</PERFIL>';
                    }

                    xml = xml + '</CONTENT>';
                    if (error === false) {
                        var delPerfiles = {
                            Estado: 'B',
                            Data: xml
                        };

                        this._openBusyDialog("Dando de alta los perfiles...");
                        var that = this;
                        this.getModel().create("/operacionPerfilSet", delPerfiles, {
                            success: function (oData, response) {
                                that._closeBusyDialog();

                                that._openBusyDialog("Descargando fichero...");
                                lFilter.push(that._createSearchFilterObject("Bname", sap.ui.model.FilterOperator.EQ, that.getView().byId("I_BNAME").getValue()));
                                lFilter.push(that._createSearchFilterObject("Estado", sap.ui.model.FilterOperator.EQ, 'B'));
                                //
                                // Hacemos la lectura correspondiente................
                                that.getModel().read("/generacionXlsSet", {
                                    filters: lFilter,
                                    success: function (oData, response) {
                                        that._closeBusyDialog();
                                        if (oData.results[0].Url !== '') {
                                            var fileURL = window.location.origin + oData.results[0].Url;
                                            var encodeUrl = encodeURI(fileURL);
                                            sap.m.URLHelper.redirect(encodeUrl, false);
                                            MessageBox.success('Se realizo correctamente la baja del perfil');
                                        } else {
                                            MessageBox.success('Se realizo correctamente la baja del perfil, no hay que dar ningún rol de baja');
                                        }

                                    },
                                    error: function (oError, oResponse, aErrorResponse) {
                                        that._closeBusyDialog();
                                        that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);
                                    }
                                });

                                that._getDatosPerfil(that.getView().byId("I_BNAME").getValue());

                            },
                            error: function (oError, oResponse, aErrorResponse) {
                                that._closeBusyDialog();
                                that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);

                            }
                        });


                    } else {
                        //Mensaje de error
                        MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("msg11"));
                    }
                } else {
                    //Mensaje de error
                    MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("msg12"));
                }

            },
            onCloseParam: function (oEvent) {
                oEvent.getSource().getParent().close();
                this._viewParameters.destroy(true);
                this._viewParameters = undefined;
            },

            viewParamPress: function (oEvent) {
                //var perfiles = this.getModel("usuarioPerfil").getData();
                //var row = this.byId(oEvent.oSource.getParent().getId());
                var perfil = oEvent.getSource().getBindingContext("usuarioPerfil").getObject();// perfiles[row.getIndex()];
                var that = this;
                var lFilter = [];

                lFilter.push(this._createSearchFilterObject("Bname", sap.ui.model.FilterOperator.EQ, perfil.Bname));
                lFilter.push(this._createSearchFilterObject("CodPerfil", sap.ui.model.FilterOperator.EQ, perfil.CodPerfil));
                lFilter.push(this._createSearchFilterObject("Cont", sap.ui.model.FilterOperator.EQ, perfil.Cont));
                this._openBusyDialog("Recuperando los parámetros del perfil...");

                this.getModel().read("/paramPerfilSet", {
                    filters: lFilter,
                    success: function (oData, response) {
                        that._closeBusyDialog();
                        var model = new sap.ui.model.json.JSONModel(oData.results);
                        that.setModel(model, "paramPerfil");
                        if (oData.results.length > 0) {

                            if (!that._viewParameters) {
                                that._viewParameters = sap.ui.xmlfragment("zfgghadamantenimientousuario.zfgghadamantusuario.view.fragment.ParametrosPerfiles", that);
                            }
                            that.getView().addDependent(that._viewParameters);

                            jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._viewParameters);
                            sap.ui.getCore().byId("dialogParamPerfil").setTitle(perfil.CodPerfil + '-' + perfil.DescPerfil);
                            that._viewParameters.open();

                        } else {
                            MessageBox.success('EL perfil no tiene parametros organizativos');
                        }

                    },
                    error: function (oError, oResponse, aErrorResponse) {
                        that._closeBusyDialog();
                        that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);
                    }
                });


            },

            //INI HADA 3
            onCloseOtrasAct: function (oEvent) {
                oEvent.getSource().getParent().close();
                this._viewOtrasAct.destroy(true);
                this._viewOtrasAct = undefined;
            },

            viewOtrasActPress: function (oEvent) {
                //var perfiles = this.getModel("usuarioPerfil").getData();
                //var row = this.byId(oEvent.oSource.getParent().getId());
                var perfil = oEvent.getSource().getBindingContext("usuarioPerfil").getObject();//perfiles[row.getIndex()];
                var that = this;
                var lFilter = [];

                lFilter.push(this._createSearchFilterObject("CodPerfil", sap.ui.model.FilterOperator.EQ, perfil.CodPerfil));
                this._openBusyDialog("Recuperando otras actuaciones del perfil...");

                this.getModel().read("/otrasActSet", {
                    filters: lFilter,
                    success: function (oData, response) {
                        that._closeBusyDialog();
                        var model = new sap.ui.model.json.JSONModel(oData.results);
                        that.setModel(model, "otrasAct");
                        if (oData.results.length > 0) {

                            if (!that._viewOtrasAct) {
                                that._viewOtrasAct = sap.ui.xmlfragment("zfgghadamantenimientousuario.zfgghadamantusuario.view.fragment.OtrasActuaciones", that);
                            }
                            that.getView().addDependent(that._viewOtrasAct);

                            jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._viewOtrasAct);
                            sap.ui.getCore().byId("dialogOtrasAct").setTitle(perfil.CodPerfil + '-' + perfil.DescPerfil);
                            that._viewOtrasAct.open();

                        } else {
                            MessageBox.success('EL perfil no tiene otras actuaciones');
                        }

                    },
                    error: function (oError, oResponse, aErrorResponse) {
                        that._closeBusyDialog();
                        that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);
                    }
                });
            },

            viewRolesPerfilPress: function (oEvent) {
                //var perfiles = this.getModel("usuarioPerfil").getData();
                //var row = this.byId(oEvent.oSource.getParent().getId());
                var perfil = oEvent.getSource().getBindingContext("usuarioPerfil").getObject(); //perfiles[row.getIndex()];
                var that = this;
                var lFilter = [];

                lFilter.push(this._createSearchFilterObject("Bname", sap.ui.model.FilterOperator.EQ, perfil.Bname));
                lFilter.push(this._createSearchFilterObject("CodPerfil", sap.ui.model.FilterOperator.EQ, perfil.CodPerfil));
                //lFilter.push(this._createSearchFilterObject("Cont", sap.ui.model.FilterOperator.EQ, "'" + perfil.Cont + "'"));
                lFilter.push(this._createSearchFilterObject("Cont", sap.ui.model.FilterOperator.EQ, perfil.Cont ));
                this._openBusyDialog("Recuperando los roles del perfil...");

                this.getModel().read("/rolesPerfilSet", {
                    filters: lFilter,
                    success: function (oData, response) {
                        that._closeBusyDialog();
                        var model = new sap.ui.model.json.JSONModel(oData.results);
                        that.setModel(model, "RolesPerfil");
                        if (oData.results.length > 0) {

                            if (!that._viewRolesPerfil) {
                                that._viewRolesPerfil = sap.ui.xmlfragment("zfgghadamantenimientousuario.zfgghadamantusuario.view.fragment.RolesPerfil", that);
                            }
                            that.getView().addDependent(that._viewRolesPerfil);

                            jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._viewRolesPerfil);
                            sap.ui.getCore().byId("dialogRolPerfil").setTitle(perfil.CodPerfil + '-' + perfil.DescPerfil);
                            that._viewRolesPerfil.open();

                        } else {
                            MessageBox.success('EL perfil no tiene roles');
                        }

                    },
                    error: function (oError, oResponse, aErrorResponse) {
                        that._closeBusyDialog();
                        that.showOdataErrorMsg(oError, oResponse, aErrorResponse, that);
                    }
                });

            },
            onCloseRolesPerfil: function (oEvent) {
                oEvent.getSource().getParent().close();
                this._viewRolesPerfil.destroy(true);
                this._viewRolesPerfil = undefined;
            },
            //FIN HADA 3

            /**
 * Custom model type for validating an E-Mail address
 * @class
 * @extends sap.ui.model.SimpleType
 */
            customEMailType: SimpleType.extend("email", {
                formatValue: function (oValue) {
                    return oValue;
                },

                parseValue: function (oValue) {

                    return oValue;
                },

                validateValue: function (oValue) {
                    if (oValue != "") {
                        var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                        if (!oValue.match(rexMail)) {
                            throw new ValidateException("'" + oValue + "' no es una dirección de correo electrónico válida");
                        }
                    }
                }
            })


        });
    });
