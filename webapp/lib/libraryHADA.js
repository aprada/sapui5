jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.declare("md.fiori.UtilityHada");

md.fiori.UtilityHada = {};

md.fiori.UtilityHada.setControllerInstance = function(oContoler, nameControler) {
	this[nameControler] = oContoler;
};

md.fiori.UtilityHada.getControllerInstance = function(nameControler) {
	return this[nameControler];
};

md.fiori.UtilityHada.getOdataNameFromSapName = function(sapName) {
	// La idea es pasar LIFNR => Lifnr o si tenemos nombres largos: ESTIMATED_COST => EstimatedCost
	var field = sapName.toLowerCase();
	var result = [];
	for (i = 0; i < field.length; ++i) {
		if (field[i] === "_") {
			result.push(i);
		}
	}
	for (i = 0; i < result.length; i++) {
		field[i + 1].toUpperCase();
	}
	field.replace("_", "");
	// Ademas la primera letra va en mayusculas
	field = field.charAt(0).toUpperCase() + field.slice(1);
	return field;
};
// Metodo para montar los resultados encontrados para una ayuda de busqueda (Value Help Dialog) dinamico
md.fiori.UtilityHada.getResultsVhdDynamic = function(results, columnModel) {
	var tableResult = [];
	var col_num = Number(results[0]["Desc"]);
	var records_num = (results.length - col_num - 1) / col_num;
	var index = col_num + 1;
	var row = {};
	var tableResult = [];
	var columnsIndexArr = [];
	// En la primera vuelta nos quedamos con el Template de la columna que lo tenemos en el modelo de columnas
	if (columnModel === undefined) {
		// Estos casos ser� cuando rellenamos un campo directamente en pantalla sin utilizar la ayuda de b�squeda. Debemos montar las columnas		
		for (var z = 0; z < col_num; z++) {
			var columnsIndex = {};
			columnsIndex.index = z + 1;
			columnsIndex.value = results[z + 1].F4Value;
			columnsIndexArr.push(columnsIndex);
		}
	} else {
		for (var y = 0; y < col_num; y++) {
			var text = results[y + 1].Desc;
			for (var t = 0; t < columnModel.length; t++) {
				if (columnModel[t].label === text) {
					var columnsIndex = {};
					columnsIndex.index = y;
					columnsIndex.value = columnModel[t].template;
					columnsIndex.desc = columnModel[t].label;
					columnsIndexArr.push(columnsIndex);
				}
			}
		}
	}
	for (var j = 0; j < records_num; j++) {
		for (var k = 0; k < col_num; k++) {
			// Debemos buscar la columna donde debe asignarse el valor, depediendo del array de columnas
			var columnEnc = columnsIndexArr.find(x => x.index == k);
			if (columnEnc != null) {
				row[columnEnc.value] = results[index].Desc;
			}
			index++;
		}
		tableResult.push(row);
		row = {};
	}
	return tableResult;
};

md.fiori.UtilityHada.encontrarIdCampo = function(controlInputChar) {

	if (controlInputChar.split("-").length > 1) {
		var indexCampo = controlInputChar.search("---");
		indexCampo = indexCampo + 3;
		var field = controlInputChar.substring(indexCampo);
		var indexCampo = field.search("--");
		indexCampo = indexCampo + 2;
		field = field.substring(indexCampo);
		// Aitor..........................
		var indexCampo = field.search("--");
		if (indexCampo > 0) {
			indexCampo = indexCampo + 2;
			field = field.substring(indexCampo);
		}
		var indexCampo = field.search("fil");
		if (indexCampo !== -1) {
			indexCampo = indexCampo + 3;
			field = field.substring(indexCampo);
		};
	} else {
		
		var array = controlInputChar.split("-");
		var field = array[array.length - 1]
			
	}
	return field;
};