sap.ui.define([
	"com/new/prjt/znew_arm_prjt/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/model/json/JSONModel"
], function (BaseController, Controller, ODataModel, t) {
	"use strict"; 
	var oLoginModel2, ouserName, oPassword;
	var that = this;
	return BaseController.extend("com.new.prjt.znew_arm_prjt.controller.userLogin", {
		onInit: function () {
			oLoginModel2 = this.getView().getModel("userLogin");
			this.onAutoLogin();
		},
		// onAfterRendering: function () {
		// 	var oLoginModel1 = this.getView().getModel("userLogin");
		// 	jQuery("#" + this.createId("link1")).on("click", this.onLinkPressed.bind(this));
		// 	jQuery("#" + this.createId("link2")).on("click", this.onLinkPressed1.bind(this));

		// 	document.onkeyup = function (evt) {
		// 		if (evt.which === 13 && event.path[2].title === "Adani Easy Access") {
		// 			// this.onLinkPressed();
		// 		}
		// 	}.bind(this);
		// 	document.onkeydown = function (event) {
		// 		switch (event.keyCode) {
		// 			case 116: //F5 button
		// 				return false;
		// 		}
		// 	};

		// },
		// onLinkPressed1: function(evt){
		// },
		// onLinkPressed: function (element) {
		// 	this.showBusyIndicator();
		// 	ouserName = document.getElementById("container-znew_arm_prjt---userLogin--link0").value;
		// 	oPassword = document.getElementById("container-znew_arm_prjt---userLogin--link2").value;
		// 	var oLoginModel = this.getView().getModel("userLogin");
		// 	var URL = "/sap/opu/odata/SAP/ZARM_UI_LOGIN_SRV/loginSet?$filter=Username eq '" + ouserName + "' and Password eq '" +
		// 		oPassword + "'";

		// 	jQuery.ajax({
		// 		dataType: 'json',
		// 		url: URL,
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			"X-CSRF-Token": "Fetch"
		// 		},
		// 		type: "GET",
		// 		success: function (data, textStatus, jqXHR) {
		// 			var csrfToken = jqXHR.getResponseHeader("x-csrf-token");
		// 			sap.m.MessageToast.show("Login Success");
		// 			var odata = {
		// 				"oResult": data.d.results[0],
		// 				"oResponce": data,
		// 				"CSRFToken": csrfToken,
		// 				"RefreshFlag": false
		// 			};

		// 			var oModel = this.getOwnerComponent().getModel("navModel");
		// 			oModel.setData(odata);
		// 			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 			oRouter.navTo("Dashboard");
		// 		}.bind(this),
		// 		error: function (XMLHttpRequest, textStatus, errorThrown) {
		// 			var oResp = JSON.parse(XMLHttpRequest.responseText).error.message.value;
		// 			var ocsrgToken = XMLHttpRequest.getResponseHeader("x-csrf-token");
		// 			if (oResp === "User is already Logged in") {
		// 				var odata = {
		// 					"CSRFToken": ocsrgToken,
		// 					"User": ouserName
		// 				};
		// 				var oModel = this.getOwnerComponent().getModel("oForceLogout");
		// 				oModel.setData(odata);
		// 				this._getDialogRole();
		// 			}
		// 			sap.m.MessageToast.show(oResp);
		// 			this.hideBusyIndicator();
		// 		}.bind(this)
		// 	});

		// },
		onAutoLogin: function (element) {
			this.showBusyIndicator();
			var oLoginModel = this.getView().getModel("userLogin");
			var URL = "/sap/opu/odata/SAP/ZARM_UI_LOGIN_SRV/loginSet?";
			jQuery.ajax({
				dataType: 'json',
				url: URL,
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": "Fetch",
					"Connection": "Keep-Alive"
				},
				type: "GET",
				success: function (data, textStatus, jqXHR) {
					var csrfToken = jqXHR.getResponseHeader("x-csrf-token");
					//sap.m.MessageToast.show("Login Success");
					var odata = {
						"oResult": data.d.results[0],
						"oResponce": data,
						"CSRFToken": csrfToken,
						"RefreshFlag": false
					};

					var oModel = this.getOwnerComponent().getModel("navModel");
					oModel.setData(odata);
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("Dashboard");
				}.bind(this),
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					var oResp = JSON.parse(XMLHttpRequest.responseText).error.message.value;
					var ocsrgToken = XMLHttpRequest.getResponseHeader("x-csrf-token");
					if (oResp === "User is already Logged in") {
						var odata = {
							"CSRFToken": ocsrgToken,
							"User": ouserName
						};
						var oModel = this.getOwnerComponent().getModel("oForceLogout");
						oModel.setData(odata);
						this._getDialogRole();
					}
					sap.m.MessageToast.show(oResp);
					this.hideBusyIndicator();
					
				}.bind(this)
			});

		},
		_getDialogRole: function () {
			this.onGo();
		},
		onCancel: function () {
			this._DialogRole.close();
		},
		onExit:function(){
			this.onAutoLogOut();
		},
		
		handleContinue: function (evt) {
			this.showBusyIndicator();
			var oUser = this.getView().byId("userInput");
			var oPasswprd = this.getView().byId("passInput");
			var oFilter = [];
			if (oUser.getValue() === "") {
				oUser.setValueState("Error");
			} else {
				oUser.setValueState("None");
				var ouserName = oUser.getValue();
				oFilter.push(new sap.ui.model.Filter("Username", sap.ui.model.FilterOperator.EQ, ouserName));
			}
			if (oPasswprd.getValue() === "") {
				oPasswprd.setValueState("Error");
			} else {
				oPasswprd.setValueState("None");
				var oPassword = oPasswprd.getValue();
				oFilter.push(new sap.ui.model.Filter("Password", sap.ui.model.FilterOperator.EQ, oPassword));
			}
			this.loginBusyDialogOpen();
			var oLoginModel = this.getView().getModel("userLogin");
			var URL = "/sap/opu/odata/SAP/ZARM_UI_LOGIN_SRV/loginSet?$filter=Username eq '" + ouserName + "' and Password eq '" +
				oPassword + "'";

			jQuery.ajax({
				dataType: 'json',
				url: URL,
				headers: {
					"X-CSRF-Token": "Fetch",
					"Content-Type": "application/json",
					"Connection": "Keep-Alive"
				},
				type: "GET",
				success: function (data, textStatus, jqXHR) {

					var csrfToken = jqXHR.getResponseHeader("x-csrf-token");
					sap.m.MessageToast.show("Login Success");

					var odata = {
						"oResult": data.d.results[0],
						"oResponce": data,
						"CSRFToken": csrfToken,
						"RefreshFlag": false
					};
					var oModel = this.getOwnerComponent().getModel("navModel");
					oModel.setData(odata);
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("Dashboard");
					this.loginBusyDialogClose();

				}.bind(this),
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					sap.m.MessageToast.show("Login Failed");
					this.loginBusyDialogClose();
				}.bind(this),
			});

		}
	});
});