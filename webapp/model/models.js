sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/Device"], function (e, n) {
	"use strict";
	return {
		createDeviceModel: function () {
			var i = new e(n);
			i.setDefaultBindingMode("OneWay");
			return i
		},
		
		createJSONModel: function(val,BindingWay){
			var oModel = new e(val);
			if(!BindingWay){
			oModel.setDefaultBindingMode("OneWay");
			}else{
				oModel.setDefaultBindingMode(BindingWay);
			}
			return oModel;
		}
	}
});