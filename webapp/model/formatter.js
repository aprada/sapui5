sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		numberUnitVal: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(6);
		},
		toNum: function(maxlen) {
			return parseInt(maxlen);
		},
		numberUnitDecimalExit: function(sValue) {
			if (!sValue) {
				return "";
			}
			var oFloatFormatter = sap.ui.core.format.NumberFormat.getFloatInstance();
			oFloatFormatter.oFormatOptions.maxFractionDigits = 2;
			oFloatFormatter.oFormatOptions.minFractionDigits = 2;
			oFloatFormatter.oFormatOptions.maxIntegerDigits = 11;
			oFloatFormatter.oFormatOptions.maxFractionDigits = 2;
			oFloatFormatter.oFormatOptions.decimalSeparator = ",";
			oFloatFormatter.oFormatOptions.roundingMode = "away_from_zero";
			return oFloatFormatter.format(sValue);
		},
		saveDecimalField: function(decimal) {
			if (decimal !== "") {
				// Eliminamos los puntos identificativos de los miles y pasamos las comas a puntos para pasarlos a SAP
				decimal = decimal.replace(/[.]/g, '');
				decimal = decimal.replace(',', '.');
				return decimal;
			}
		}

	};

});