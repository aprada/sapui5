sap.ui.define([
"sap/ui/comp/valuehelpdialog/ValueHelpDialog", 
"zfgghadamantenimientousuario/zfgghadamantusuario/model/formatter" 

], 
function(ValueHelpDialog, formatter) {
	return {
		createContent: function(oController) {

            var viewBaseContoller = md.fiori.UtilityHada.getControllerInstance("viewBase");
			var viewP = md.fiori.UtilityHada.getControllerInstance("main");
		
		
			// DATOS ODATA
			var that = viewBaseContoller;
			var textos = viewBaseContoller.searchHelpJson[0];
			var keyFieldArr = [];
			// Rellenamos la clave de la ayuda de busqueda que sera la del campo en que estemos
			for (var k = 0; k < viewBaseContoller.searchHelpJson.length; k++) {
				if (viewBaseContoller.searchHelpJson[k].Key === true) {
					var keyField = {};
					keyField = viewBaseContoller.searchHelpJson[k].Fieldname;
					keyFieldArr.push(keyField);
				}
			}

			viewBaseContoller.aKeys = keyFieldArr;
			var oValueHelpDialog =  new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
				title: textos.Shlptext,
				supportMultiselect: viewBaseContoller.multiValue,
				supportRanges: false,
				supportRangesOnly: false,
				key: viewBaseContoller.aKeys[0],
				descriptionKey: viewBaseContoller.aKeys[1],

				ok: function(oControlEvent) {
					// Si la seleccion no es multiple, solo pueden seleccionar un valor
					if (oValueHelpDialog.getSupportMultiselect() === false) {
						var resultField = oControlEvent.getParameters().tokens[0].getKey();
						var resultFieldText = oControlEvent.getParameters().tokens[0].getText();
						var input;
						if (viewP.getView().byId(that.fieldSearch) !== undefined) {
							input = viewP.getView().byId(that.fieldSearch);
							input.setValue(resultField);
							input.fireChange(true);
							try {
						    var inputText = viewP.getView().byId(that.fieldSearch  + "T");
							inputText.setValue(resultFieldText);
							} catch (error) {
								
							}
						} else {
							input = sap.ui.getCore().byId(that.fieldSearch);
							input.setValue(resultField);
							try {
								input = viewP.getView().byId(that.fieldSearch  + "T");
								input.setValue(resultFieldText);
								} catch (error) {
									
								}
						}
						// Si tenemos error en el campo, debemos de quitarlo ya que el campo heredado sera correcto
						if (input.getValueState() === sap.ui.core.ValueState.Error) {
							input.setValueState(sap.ui.core.ValueState.None);
						}

						// Puede ser que nos haga falta algun dato adicional de la fila que se ha seleccionado
						var tableValueHelp = oValueHelpDialog.getTable().getModel().getData();
						var filaSelect = tableValueHelp.find(x => x[that.fieldSearch.toUpperCase()] == resultField);
						that.filaSelect = filaSelect;
					} else {
						if (oValueHelpDialog.getSupportMultiselect() === true) {
							var aTokens = oControlEvent.getParameter("tokens");
							var theTokenInput = sap.ui.getCore().byId(that.fieldSearch);
							for (var x = 0; x < aTokens.length; x++) {
								aTokens[x].setText(aTokens[x].getKey());
							}
							theTokenInput.setTokens(aTokens);
						}
					}
					try {
						//
					} catch (e) {}
					oValueHelpDialog.close();
					oValueHelpDialog.destroy();
					that.FragmentF4GenericCollective = undefined;
				},

				cancel: function(oControlEvent) {
					oValueHelpDialog.close();
					oValueHelpDialog.destroy();
					that.FragmentF4GenericCollective = undefined;
				},

				afterClose: function() {
					oValueHelpDialog.close();
					oValueHelpDialog.destroy();
					that.FragmentF4GenericCollective = undefined;
				}
			});



			// Inicializamos
			var columnsArr = [];
			var columnsArrTotal = [];
			var filterGroupItemsArr = [];
			var idFilter = "vhdFil";
			var codName = 0;
			var modelInvisibleInput = [];
			for (var k = 0; k < viewBaseContoller.searchHelpJson.length; k++) {
				if ((viewBaseContoller.searchHelpJson[k].Shlpoutput === true && viewBaseContoller.searchHelpJson[k].Inputinvisible === false)) {
					var columns = {};
					columns.label = viewBaseContoller.searchHelpJson[k].Ddtext;
					columns.template = viewBaseContoller.searchHelpJson[k].Fieldname;
					columnsArr.push(columns);
				}
				if (viewBaseContoller.searchHelpJson[k].Shlpoutput === true) {
					// Estos casos seran para columnas que nos llegaran con valor pero que no queremos que se devuelvan en la tabla de resultados
					// pero que esos datos nos son necesarios para mapearlos por derivacion
					var columns = {};
					columns.label = viewBaseContoller.searchHelpJson[k].Ddtext;
					columns.template = viewBaseContoller.searchHelpJson[k].Fieldname;
					columnsArrTotal.push(columns);
				}
				if (viewBaseContoller.searchHelpJson[k].Shlpinput === true) {
					if (viewBaseContoller.searchHelpJson[k].Inputinvisible === false) {
						var filterGroupItems = {};
						filterGroupItems.groupTitle = "Otros filtros";
						filterGroupItems.groupName = "of1";
						filterGroupItems.name = codName++;
						filterGroupItems.label = viewBaseContoller.searchHelpJson[k].Ddtext;
						filterGroupItems.control = new sap.m.Input(viewBaseContoller.searchHelpJson[k].Fieldname, {
							width: "50%"
						});
						filterGroupItems.control.setMaxLength(formatter.toNum(viewBaseContoller.searchHelpJson[k].Outputlen));
						filterGroupItems.id = idFilter.concat(viewBaseContoller.searchHelpJson[k].Fieldname);
						var filterGroup = {};
						filterGroup = new sap.ui.comp.filterbar.FilterGroupItem(filterGroupItems);
						filterGroupItemsArr.push(filterGroup);
					} else {
						var invisibleInput = {};
						invisibleInput.Fieldname = viewBaseContoller.searchHelpJson[k].Fieldname;
						modelInvisibleInput.push(invisibleInput);
					}
				}
			}

			that.setModel(filterGroupItemsArr, "filterGroupItemsArr");
			that.setModel(modelInvisibleInput, "invisibleInput");
			var oColModel = new sap.ui.model.json.JSONModel();
			oColModel.setData({
				cols: columnsArr
			});
			oValueHelpDialog.getTable().setModel(oColModel, "columns");
			that.setModel(columnsArrTotal, "columnsArrTotal");

			var oRowsModel = new sap.ui.model.json.JSONModel();
			oRowsModel.setData(that.aItems);
			oValueHelpDialog.getTable().setModel(oRowsModel);
			oValueHelpDialog.getTable().bindRows("/");

			// ***********************************************************************************************
			var c = oValueHelpDialog.getTable().getColumns();
			for (let index = 0; index < c.length; index++) {
				const element = c[index];
				element.setFilterProperty(columnsArr[index].template);
				element.setSortProperty(columnsArr[index].template);
				//if (index === 0) {
				//	element.setSorted(true);
				//	element.setSortOrder('Ascending');
				//}
				
			}
			// Se comprueba si tiene activado el Input para Ayuda de Busqueda................
			for (var k = 0; k < viewBaseContoller.searchHelpJson.length; k++) {
				if ((viewBaseContoller.searchHelpJson[k].Shlpinput === true) && (viewBaseContoller.searchHelpJson[k].Inputinvisible === false)) {
					// No nos sirve con poner el tamano al control del campo input. Debemos especificarlo asi para que lo regleje en el value help dialog
					var field = sap.ui.getCore().byId(viewBaseContoller.searchHelpJson[k].Fieldname);
					field.setWidth("50%");
				}
			}
			
			// Se valida si est activado el input para Ay. Busq. ..........
			if (field !== undefined) {
				that.visible = true;
			} else {
				that.visible = false;
			}
			try {
				that.field = field;
			} catch (error) {
				that.field = undefined;
			}
			
			
			return  oValueHelpDialog;

            
		}
	};
});