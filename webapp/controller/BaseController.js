sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (BaseController, Controller, ODataModel) {
	"use strict";
	return BaseController.extend("com.new.prjt.znew_arm_prjt.controller.BaseController", {

		getConfiguration: function (sName) {
			if (!this._customConfig)
				this._customConfig = this.getOwnerComponent().getCustomConfiguration();
			if (!sName) {
				return this._customConfig;
			}
			return this._customConfig[sName];
		},
		hideBusyIndicator: function (iDelay) {
			iDelay ? iDelay : 1000;
			sap.ui.core.BusyIndicator.hide(iDelay);
		},

		showBusyIndicator: function (iDuration, iDelay) {
			sap.ui.core.BusyIndicator.show(100);
		},
		getModel: function (sName) {
			if (sName) {
				return this.getView().getModel(sName);
			} else {
				return this.getView().getModel();
			}
		},
		setModel: function (oModel, sName) {
			if (sName) {
				return this.getView().setModel(oModel, sName);
			} else {
				return this.getView().setModel(oModel);
			}
		},

		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
		},

		showBusyIndicator: function (iDuration, iDelay) {
			sap.ui.core.BusyIndicator.show(300);
		},
		// common method to get service model
		getDefinedModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		// common method to get resources
		getResource: function (resLable) {
			if (!this._resourceBundle) {
				this._resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			}

			return this._resourceBundle.getText(resLable);
		},

		getFullName: function () {
			if (sap.ui.getCore().getModel("UserModel").getData().name !== undefined)
				return sap.ui.getCore().getModel("UserModel").getData().name;
			else
				return undefined;
		},
		getLang: function () {
			return sap.ui.getCore().getConfiguration().getLanguage();
		},

		// common method to get router
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		handleLiveChange: function (e) {
			if (e.getSource().getValue()) {
				var regEx, erroeTxt;
				if (e.getSource().getName() == "AlphaNum") {
					// regEx = /^[0-9a-zA-Z]+$/;
					// erroeTxt = 'Only Alpha Numeric Allowed'
					e.getSource().setValueState("None");
				} else if (e.getSource().getName() === "Email") {
					regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
					erroeTxt = 'Special characters not allowed'
				} else if (e.getSource().getName() === "CharOnly") {
					regEx = /^[A-Za-z]+$/
					erroeTxt = 'Only characters allowed'
				}
				var sValue = e.getSource().getValue();
				e.getSource().setValueState('None');
				if (!regEx.test(sValue)) {
					e.getSource().setValueState('Error');
					e.getSource().setValueStateText(erroeTxt);
					e.getSource().setValue("");
					return
				} else {
					e.getSource().setValueState(sap.ui.core.ValueState.Success)
				}
			}
		},
		onAutoLogOut: function () {
			var oForceModel = this.getOwnerComponent().getModel("oForceLogout");
			var URL = "/sap/opu/odata/SAP/ZARM_UI_LOGIN_SRV/logoutSet";
			var data = {
				"username": oForceModel.getData().User,
				"login": "X"
			};
			var s = JSON.stringify(data);
			jQuery.ajax({
				url: URL,
				headers: {
					"X-CSRF-Token": oForceModel.getData().CSRFToken
				},
				contentType: "application/json",
				dataType: "json",
				data: s,
				type: "POST",
				success: function (data, textStatus, jqXHR) {
					sap.m.MessageToast.show("Logged off");
					//this.onCancel();
				}.bind(this),
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					this.loginBusyDialogClose();
				}.bind(this),
			});
		},
		loginBusyDialogOpen: function () {
			if (!this._souploadbusydialog) {
				this._souploadbusydialog = sap.ui.xmlfragment("com.new.prjt.znew_arm_prjt.fragment.loginBusyDialog", this);
				this.getView().addDependent(this._souploadbusydialog);
			}

			// open dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._souploadbusydialog);
			this._souploadbusydialog.open();
		},

		loginBusyDialogClose: function () {
			if (this._souploadbusydialog) {
				this._souploadbusydialog.close();
			}
		},

	});

});