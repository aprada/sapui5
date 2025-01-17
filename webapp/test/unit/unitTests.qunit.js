/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zfgghadamantenimientousuario/zfgg_hada_mant_usuario/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
