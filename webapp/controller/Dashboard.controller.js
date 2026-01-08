sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel", "sap/m/Popover", "sap/m/Button", "sap/m/library",
	"sap/ui/export/Spreadsheet", "sap/m/MessageToast", "sap/ui/export/library", "sap/ui/core/message/ControlMessageProcessor",
	"sap/ui/core/message/Message", "sap/m/MessagePopover", "sap/m/MessagePopoverItem", "sap/ui/core/library",
	"com/new/prjt/znew_arm_prjt/model/formatter",
	"sap/ui/model/json/JSONModel", "sap/ui/core/Fragment", "sap/ui/table/Row",
	"sap/ui/unified/FileUploaderParameter", "sap/ui/model/Filter", "sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	'sap/viz/ui5/format/ChartFormatter',
	'sap/viz/ui5/api/env/Format',
	'../InitPage',
	"sap/ui/core/format/DateFormat",
	"sap/ui/table/library",
	"sap/ui/model/Sorter",
], function (e, t, o, a, i, s, r, n, l, d, g, c, p, formatter, JSONModel, Fragment, TableRow, FileUploaderParameter, Filter,
	FilterOperator, MessageBox, ChartFormatter, Format, InitPageUtil, DateFormat, library, Sorter) {
	"use strict";
	var idCard, csrf, oFields, oUserID, oConn, oSystemModel, oFfModel, dateFrom, dateTo, sys, oObject, authData, oModelName, oRFCDEST;
	var tcode, orgs;
	var u = p.MessageType;
	var h = n.EdmType;
	var f = i.ButtonType,
		m = i.PlacementType;
	var TcodeInfo = [];
	var SortOrder = library.SortOrder;
	var that = this;
	return e.extend("com.new.prjt.znew_arm_prjt.controller.Dashboard", {
		formatter: formatter,
		_data: {
			"date": new Date()
		},
		appInboxfunction:function(sChannelId, sEventId, sData){
			

		},


		onInit: function () {
			sap.ui.getCore().getEventBus().subscribe(
				"appInbox",
				"InboxEvent",
				this.appInboxfunction,
				this
			)

			if (!this.getOwnerComponent().getModel("navModel").oData.oResult) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("");
				location.reload();
				return false;
			}

			sap.ui.getCore().getEventBus().subscribe(
				"Dashboard",
				"CallDashboard",
				this.navToMyAccess,
				this
			);
			this._selectedReqKey = "myAccess";
			this.localModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.localModel, "localModel");
			var oDateModel = new JSONModel(this._data);
			this.getView().getModel("localModel").setProperty("/Date", this._data);
			////////////////////////////////////////////////////////////////////////////////////////
			window.onhashchange = function () {
				if (window.innerDocClick) { } else {
					this.handelLogOff();
				}
			}.bind(this);
			//////////////////////////////////////////////////////////////////////////////////////
			var that = this;

			$(window).unload(function (evt) {
				this.handelLogOff();
			}.bind(this));
			this.dragDropModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.dragDropModel, "dragDropModel");
			this._FlageOrgCheck = false;
			this._FlageOrgCheckRef = '';
			this._CheckUser = '';
			var e = new l;
			var o = sap.ui.getCore().getMessageManager();
			o.registerMessageProcessor(e);
			o.addMessages(new d({
				message: "Something wrong happened",
				type: u.Error,
				processor: e
			}));
			this._dataRole = {
				items: []
			};
			this.jModelRole = new sap.ui.model.json.JSONModel(this._dataRole);
			this.getView().setModel(this.jModelRole, "uploadRoleModel");
			this._data = {
				items: []
			};
			this.jModel = new sap.ui.model.json.JSONModel(this._data);
			this.getView().setModel(this.jModel, "uploadTCodeModel");
			var a = new sap.ui.model.json.JSONModel;
			this.getView().setModel(a, "uploadTCodeModel1");
			var i = {
				navigation: [{
					title: "My Access",
					icon: "sap-icon://learning-assistant",
					key: "myAccess",
					enabled: true
				}, 
				{
					title: "Approval Inbox",
					icon: "sap-icon://inbox",
					key: "appInbox",
					enabled: true,
					Visible:true
				}, 
				{
					title: "Access Request",
					icon: "sap-icon://request",
					key: "accRequest",
					enabled: true,
					items: [{
						title: "New/Modify Access",
						key: "ModifyReqstID",
						icon: "sap-icon://add-document",
						enabled: true
					}, {
						title: "Lock User",
						key: "removeAccesID",
						icon: "sap-icon://decline",
						enabled: true
					}, {
						title: "Firefighter Access",
						key: "fireFighterID1",
						icon: "sap-icon://request",
						enabled: true
					}, {
						title: "User Id Creation Adani",
						key: "newModifyReqstID",
						enabled: true
					}, {
						title: "User Id Creation 3rd Party",
						key: "3rdPartyID",
						enabled: true
					}]
				}],
				fixedNavigation: [{
					title: "Chat",
					icon: "sap-icon://discussion-2"
				}],
				reqType: [{
					type: "New/Modify Access"
				}, {
					type: "Lock User"
				}, {
					type: "Firefighter Access"
				}],
				OrgValueInfo: [{
					orgLevel: "OrgAAA",
					orgValedesc: "OrgDescBBB",
					tCode: "VA01"
				}],
				SystemTable: [{
					System: "OrgAAA",
					Description: "OrgDescBBB"
				}, {
					System: "OrgAAA1",
					Description: "OrgDescBBB1"
				}],
				DocCollection: [{
					title: "approval.txt",
					description: "Approval from manager"
				}, {
					title: "resuot.png",
					description: "Sanpshot"
				}]
			};
			var s = new t(i);
			this.getView().setModel(s);
			var oNavModel = this.getOwnerComponent().getModel("navModel");
			var oUserModel = new JSONModel(oNavModel.getData());
			this.getView().setModel(oUserModel, "oUserModel");
			//sample data for role selection criteria
			var oRoleData = {
				role: [{
					"text": "VA01,VA02,VA03",
					"system": "TGDCLNT210",
					"nodes": [{
						"text": "Role 1"
					}, {
						"text": "Role 2"
					}]
				}, {
					"text": "OASV,F-30",
					"nodes": [{
						"text": "Role 1"
					}, {
						"text": "Role 2"
					}]
				}]
			};
			var mRole = new t(oRoleData);
			this.getView().setModel(mRole, "mRole");

			//Subbu
			this._bIsNavigatedToStep3 = false;
			this._bIsNavigatedToStep3Mod = false;
			this._bAppLoadedFirstTime = true;
			//End of Subbu
			// Model for Employee Type
			var data = []
			var eTypeModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(eTypeModel, "EmployeeType");
			var data2 = []
			var rTypeModel = new sap.ui.model.json.JSONModel(data2);
			this.getView().setModel(rTypeModel, "RequestType");

			var data3 = [{
				key: "001",
				text: "Adani"
			}, {
				key: "002",
				text: "3rd Party User"
			}]
			var eTypeModel = new sap.ui.model.json.JSONModel(data3);
			this.getView().setModel(eTypeModel, "EmployeeTypeMod");
			var oJsonModel3rdParty = new sap.ui.model.json.JSONModel();
			oJsonModel3rdParty.setData({
				"Is3rdParty": false
			});
			this.getView().setModel(oJsonModel3rdParty, "3rdparty");
			var jQueryScript = document.createElement('script');
			jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/jszip.js');
			document.head.appendChild(jQueryScript);
			var jQueryScript = document.createElement('script');
			jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/xlsx.js');
			document.head.appendChild(jQueryScript);
			//this._onMyAccessPress();
		},

		_resetSortingState: function () {
			var oTable = this.getView().byId("newUSERTableReqSet");
			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				aColumns[i].setSorted(false);
			}
		},

		sortDeliveryDate: function (oEvent) {
			var oCurrentColumn = oEvent.getParameter("column");
			var oDeliveryDateColumn = this.getView().byId("deliverydate");
			if (oCurrentColumn != oDeliveryDateColumn) {
				oDeliveryDateColumn.setSorted(false); //No multi-column sorting
				return;
			}
			oEvent.preventDefault();
			var sOrder = oEvent.getParameter("sortOrder");
			var oDateFormat = DateFormat.getDateInstance({
				pattern: "dd/MM/yyyy"
			});
			this._resetSortingState(); //No multi-column sorting
			oDeliveryDateColumn.setSorted(false);
			oDeliveryDateColumn.setSortOrder(sOrder);
			var oSorter = new Sorter(oDeliveryDateColumn.getSortProperty(), sOrder === SortOrder.Descending);
			//The date data in the JSON model is string based. For a proper sorting the compare function needs to be customized.
			oSorter.fnCompare = function (a, b) {
				if (b == null) {
					return 1;
				}
				if (a == null) {
					return -1;
				}
				var aa = oDateFormat.parse(a).getTime();
				var bb = oDateFormat.parse(b).getTime();
				if (aa < bb) {
					return 1;
				}
				if (aa > bb) {
					return -1;
				}
				return 0;
			};
			this.getView().byId("newUSERTableReqSet").getBinding("rows").sort(oSorter);
		},

		handleResponsivePopoverPress: function (oEvent) {
			var oButton = oEvent.getSource();
			if (!this._oPopover) {
				Fragment.load({
					name: "com.new.prjt.znew_arm_prjt.fragment.Popover",
					controller: this
				}).then(function (oPopover) {
					this._oPopover = oPopover;
					this.getView().addDependent(this._oPopover);
					this._oPopover.bindElement("/ProductCollection/0");
					this._oPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oPopover.openBy(oButton);
			}
		},
		showBusyIndicator: function (iDuration, iDelay) {
			sap.ui.core.BusyIndicator.show(300);
		},
		loginBusyDialogOpen: function () {
			if (!this._souploadbusydialog) {
				this._souploadbusydialog = sap.ui.xmlfragment("app.ZGAMS_DASHBOARD.fragment.loginBusyDialog", this);
				this.getView().addDependent(this._souploadbusydialog);
			}
			// open dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._souploadbusydialog);
			this._souploadbusydialog.open();
		},

		loginBusyDialogClose: function () {
			this._souploadbusydialog.close();
		},
		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
		},
		handelLogOff: function (evt) {
			this.showBusyIndicator();
			var URL = "/sap/opu/odata/SAP/ZARM_UI_LOGIN_SRV/logoutSet";
			var csrf = this.getView().getModel("oUserModel").getData().CSRFToken;
			var data = {
				"username": oUserID,
				"login": "X"
			};
			var s = JSON.stringify(data);
			jQuery.ajax({
				url: URL,
				headers: {
					"X-CSRF-Token": csrf
				},
				contentType: "application/json",
				dataType: "json",
				data: s,
				type: "POST",
				success: function (data, textStatus, jqXHR) {
					sap.ui.core.BusyIndicator.show
					sap.ui.core.routing.HashChanger.getInstance().replaceHash("");
					sap.m.MessageToast.show("Logged off");
					location.reload();
				}.bind(this),
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					sap.ui.core.BusyIndicator.hide();
				}.bind(this),
			});
		},
		getSelectedRowContext: function (sTableId, fnCallback) {
			var oTable = this.byId(sTableId);
			var iSelectedIndex = oTable.getSelectedIndex();
			if (iSelectedIndex === -1) {
				MessageToast.show("Please select a row!");
				return;
			}
			var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
			if (oSelectedContext && fnCallback) {
				fnCallback.call(this, oSelectedContext, iSelectedIndex, oTable);
			}
			return oSelectedContext;
		},
		onDropSelectedProductsTable: function (oEvent) {
			var oTable1 = this.byId("table1");
			var oTable2 = this.byId("table2");
			var oDraggedItem = oEvent.getParameter("draggedControl");
			oDraggedItem.getBindingContext().getObject().FT = "SEL";
			oTable1.getModel().refresh(true);
			oTable2.getModel().refresh(true);
		},
		onDropAvailableProductsTable: function (oEvent) {
			var oTable1 = this.byId("table1");
			var oTable2 = this.byId("table2");
			var oDraggedItem = oEvent.getParameter("draggedControl");
			oDraggedItem.getBindingContext().getObject().FT = "AVL";
			oTable1.getModel().refresh(true);
			oTable2.getModel().refresh(true);
		},
		config: {
			initialRank: 0,
			defaultRank: 1024,
			rankAlgorithm: {
				Before: function (iRank) {
					return iRank + 1024;
				},
				Between: function (iRank1, iRank2) {
					// limited to 53 rows
					return (iRank1 + iRank2) / 2;
				},
				After: function (iRank) {
					return iRank / 2;
				}
			}
		},

		onDragStart: function (oEvent) {
			var oDraggedRow = oEvent.getParameter("target");
			var oDragSession = oEvent.getParameter("dragSession");
			// keep the dragged row context for the drop action
			oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext());
		},
		onSysInfoReferesh: function (event) {
			var oModelCom = this.getView().getModel('grac');
			var aUser = [];
			sap.ui.core.BusyIndicator.show(300);
			var oViewTable = this.byId("myAccesSysTable");
			oViewTable.getModel().refresh(true);
			aUser.push(new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, oUserID));
			oModelCom.read("/SystemSet", {
				filters: aUser,
				success: function (data) {
					sap.ui.core.BusyIndicator.hide();
					var oModel = new sap.ui.model.json.JSONModel({
						myItems: data.results
					});
					oViewTable.setModel(oModel);
				},
				error: function (event) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error('Error');
					return;
				}
			});
		},

		onDaysChange: function (oEvent) {

			var oValue = oEvent.getSource().getSelectedKey();
			var oModel1 = this.getView().getModel("grac");
			var filterme = [];
			filterme.push(new sap.ui.model.Filter("age", sap.ui.model.FilterOperator.LT, oValue));
			var oTable = this.getView().byId("newUSERTableReqSet");
			var oBinding = oTable.getBinding("rows");
			oBinding.filter(filterme);
			this.onShowFinishedReq();
		},
		onShowFinishedReq: function (eve) {
			var sel = this.getView().byId("showFinished").getSelected();
			var selShowAll = this.byId("showAll");
			var oValue = this.getView().byId("idAgeDays").getSelectedKey();
			var filterage = [];
			filterage.push(new sap.ui.model.Filter("age", sap.ui.model.FilterOperator.LT, oValue));
			var oTable = this.getView().byId("newUSERTableReqSet");
			if (selShowAll.getSelected()) {
				var showAll = 'X';
			} else {
				showAll = '';
			}
			var oViewnewUserSet = this.byId("newUSERTableReqSet");
			var oNewUserReqSet = this.byId("newUSERReqSet");
			var oModel1 = this.getView().getModel("grac");
			var filterme = [];
			filterme.push(new sap.ui.model.Filter("CREATED_BY", sap.ui.model.FilterOperator.EQ, oUserID));
			if (sel === true) {
				filterme.push(new sap.ui.model.Filter("showfinished", sap.ui.model.FilterOperator.EQ, 'X'));
				filterme.push(new sap.ui.model.Filter("showall", sap.ui.model.FilterOperator.EQ, showAll));
			} else {
				filterme.push(new sap.ui.model.Filter("showfinished", sap.ui.model.FilterOperator.EQ, ''));
				filterme.push(new sap.ui.model.Filter("showall", sap.ui.model.FilterOperator.EQ, showAll));
			}
			sap.ui.core.BusyIndicator.show(300);
			oModel1.read("/NewUserRequestSet", {
				filters: filterme,
				success: function (data, textStatus, jqXHR) {
					var oNewUser = new sap.ui.model.json.JSONModel({
						myItems: data.results
					});
					oNewUserReqSet.setCount(data.results.length);
					oViewnewUserSet.setModel(oNewUser);
					if (oValue != '') {
						var oBinding = oTable.getBinding("rows");
						oBinding.filter(filterage);
					}
					sap.ui.core.BusyIndicator.hide();
				}.bind(this),
				error: function (evt) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		onShowAllReq: function (eve) {
			var sel = this.getView().byId("showAll").getSelected();
			var selShowFinished = this.getView().byId("showFinished");
			var oValue = this.getView().byId("idAgeDays").getSelectedKey();
			//var oModel1 = this.getView().getModel("grac");
			var filterage = [];
			filterage.push(new sap.ui.model.Filter("age", sap.ui.model.FilterOperator.LT, oValue));
			var oTable = this.getView().byId("newUSERTableReqSet");
			if (selShowFinished.getSelected()) {
				var showFinished = 'X';
			} else {
				showFinished = '';
			}
			var oViewnewUserSet = this.byId("newUSERTableReqSet");
			var oNewUserReqSet = this.byId("newUSERReqSet");
			var oModel1 = this.getView().getModel("grac");
			var filterme = [];
			filterme.push(new sap.ui.model.Filter("CREATED_BY", sap.ui.model.FilterOperator.EQ, oUserID));
			if (sel === true) {
				filterme.push(new sap.ui.model.Filter("showall", sap.ui.model.FilterOperator.EQ, 'X'));
				filterme.push(new sap.ui.model.Filter("showfinished", sap.ui.model.FilterOperator.EQ, showFinished));
			} else {
				filterme.push(new sap.ui.model.Filter("showall", sap.ui.model.FilterOperator.EQ, ''));
				filterme.push(new sap.ui.model.Filter("showfinished", sap.ui.model.FilterOperator.EQ, showFinished));
			}
			sap.ui.core.BusyIndicator.show(300);
			oModel1.read("/NewUserRequestSet", {
				filters: filterme,
				success: function (data, textStatus, jqXHR) {
					var oNewUser = new sap.ui.model.json.JSONModel({
						myItems: data.results
					});
					oNewUserReqSet.setCount(data.results.length);
					oViewnewUserSet.setModel(oNewUser);
					if (oValue != '') {
						var oBinding = oViewnewUserSet.getBinding("rows");
						oBinding.filter(filterage);
					}
					sap.ui.core.BusyIndicator.hide();
				}.bind(this),
				error: function (evt) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		onUnloackUser: function (event) {
			var that = this;
			var oModelCom = this.getView().getModel('grac');
			var oViewTable = this.byId("myAccesSysTable");
			oViewTable.getModel().refresh(true);
			var selectedData = event.getSource().getBindingContext().getObject();
			sap.m.MessageBox.confirm("Your ID was locked.Click OK to Unlock ID", {
				onClose: function (sAction) {
					if (sAction === 'OK') {
						sap.ui.core.BusyIndicator.show(300);
						var oPayload = {
							"CONNECTOR": selectedData.CONNECTOR,
							"RFCDOC1": selectedData.RFCDOC1,
							"USER_ID": selectedData.USER_ID,
							"USER_GROUP": selectedData.USER_GROUP,
							"USER_TYPE": selectedData.USER_TYPE,
							"INACTIVE": "X",
							"EXPIRED": "",
							"VALID_FROM": "2019-07-02T00:00:00", //selectedData.VALID_FROM,
							"VALID_TO": "2020-01-31T00:00:00", //selectedData.VALID_TO,
							"STATUS": " ",
							"UFLAG": selectedData.UFLAG
						};
						var params = [];
						params["X-CSRF-Token"] = oModelCom.getSecurityToken();
						params["X-CSRF-Token"] = csrf;
						params["Content-Type"] = "application/json";
						oModelCom.create("/SystemSet", oPayload, {
							headers: params,
							success: function (data) {
								sap.ui.core.BusyIndicator.hide();
								var str = data.STATUS;
								var reqno = str.split("Success");
								if (typeof reqno[1] == 'undefined') {
									sap.m.MessageBox.success('User Unlock is successful');
									return;
								} else {
									sap.m.MessageBox.success("User Unlock is successful with Request Number ' " + reqno[1] + "'");
									return;
								}
							},
							error: function (event) {
								sap.ui.core.BusyIndicator.hide();
								sap.m.MessageBox.error("User Unlock is unsuccessful");
								return;
							}
						});
						var aUser = [];
						aUser.push(new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, selectedData.USER_ID));
						oModelCom.read("/SystemSet", {
							filters: aUser,
							success: function (data) {
								var oModel = new sap.ui.model.json.JSONModel({
									myItems: data.results
								});
								oViewTable.setModel(oModel);
							},
							error: function (event) {
								sap.m.MessageBox.error('Error');
								return;
							}
						});
					}
				}
			});
		},
		onPressFFExtendVal: function (ev) {
			var oModelCom = this.getView().getModel('grac');
			var oFFTable = this.byId("idTablefireFighter");
			oFFTable.getModel().refresh(true);
			var selectedData = ev.getSource().getBindingContext().getObject();
			var oUserInfoModel = this.getView().getModel("UserDatilsModel").getData().userDatails;
			sap.m.MessageBox.confirm("Click OK to Extend Validity for the FFID", {
				onClose: function (sAction) {
					if (sAction === 'OK') {
						sap.ui.core.BusyIndicator.show(300);
						var SysLandInfo = [];
						var tdata = {
							"USER_ID": oUserInfoModel.USER_ID,
							"CONNECTOR": selectedData.CONNECTOR
						};
						SysLandInfo.push(tdata);
						var FFVlidData = [];
						var getFFdata = {
							"USER_ID": oUserInfoModel.USER_ID,
							"FFOBJECT": selectedData.FFOBJECT,
							"CONNECTOR": selectedData.CONNECTOR,
							"VALID_FROM": selectedData.VALID_FROM.replace(/-/gi, ''),
							"VALID_TO": selectedData.VALID_TO.replace(/-/gi, ''),
						};
						FFVlidData.push(getFFdata);
						var oPayload = {
							"USER_ACTION": "SUBMIT",
							"IDENTIFIER": "FF",
							"USER_ID": oUserInfoModel.USER_ID,
							"FIRST_NAME": oUserInfoModel.FIRST_NAME,
							"LAST_NAME": oUserInfoModel.LAST_NAME,
							"EMPTYPE": oUserInfoModel.EMPTYPE,
							"ZRMID": oUserInfoModel.ZRMID,
							"ZEMPID": oUserInfoModel.ZEMPID,
							"DEPARTMENT": oUserInfoModel.ZDEPTD,
							"PHONE": oUserInfoModel.PHONE,
							"EMAIL": oUserInfoModel.EMAIL,
							"DESCRIPTION": "Firefighter Assignment Validity Extension",
							"NARSystemInformationSet": SysLandInfo,
							"GetFirefighterObjSet": FFVlidData
						};
						var params = [];
						params["X-CSRF-Token"] = oModelCom.getSecurityToken();
						params["X-CSRF-Token"] = csrf;
						params["Content-Type"] = "application/json";
						oModelCom.create('/NARUserInformationSet', oPayload, {
							headers: params,
							success: function (data) {
								var str = data.STATUS;
								var reqno = str.split("Success");
								sap.ui.core.BusyIndicator.hide();
								var mesg = "Your Request has been submitted successfully with request' " + reqno[0] + "'";
								sap.m.MessageBox.success(mesg);
							},
							error: function (data) {
								sap.ui.core.BusyIndicator.hide();
								if (JSON.parse(data.responseText)) {
									sap.m.MessageBox.error("Request Creation is unsuccessful'" + JSON.parse(data.responseText).error.message.value + "'");
								} else {
									sap.m.MessageBox.error("Request Creation is unsuccessful");
								}
							}
						});
					}
				}
			});
		},
		onPressPassReset: function (eve) {
			var oModelCom = this.getView().getModel('grac');
			var oViewTable = this.byId("myAccesSysTable");
			oViewTable.getModel().refresh(true);
			var selectedData = eve.getSource().getBindingContext().getObject();
			var email = this.getView().getModel("UserDatilsModel").getData().userDatails.EMAIL;
			sap.m.MessageBox.confirm("Click OK to Reset Password to your User", {
				onClose: function (sAction) {
					if (sAction === 'OK') {
						sap.ui.core.BusyIndicator.show(300);
						var oPayload = {
							"connector": selectedData.CONNECTOR,
							"user_id": selectedData.USER_ID,
							"conn_desc": selectedData.RFCDOC1,
							"email": email
						};
						var params = [];
						params["X-CSRF-Token"] = oModelCom.getSecurityToken();
						params["X-CSRF-Token"] = csrf;
						params["Content-Type"] = "application/json";
						oModelCom.create("/reset_passwordSet", oPayload, {
							headers: params,
							success: function (data) {
								sap.ui.core.BusyIndicator.hide();
								sap.m.MessageBox.success("Password reset is successful and the new Password is send to your Mail ID");
								return;
							},
							error: function (event) {
								sap.ui.core.BusyIndicator.hide();
								sap.m.MessageBox.error("Password Reset is unsuccessful.'" + JSON.parse(event.responseText).error.message.value + "'");
								return;
							}
						});
					}
				}
			});
		},
		onExtendSystemaccess: function (event) {
			var oModelCom = this.getView().getModel('grac');
			var oViewTable = this.byId("myAccesSysTable");
			oViewTable.getModel().refresh(true);
			var selectedData = event.getSource().getBindingContext().getObject();
			sap.m.MessageBox.confirm("Click Ok to submit an Access Request to extend Validity.", {
				onClose: function (sAction) {
					if (sAction === 'OK') {
						sap.ui.core.BusyIndicator.show(300);
						var oPayload = {
							"CONNECTOR": selectedData.CONNECTOR,
							"RFCDOC1": selectedData.RFCDOC1,
							"USER_ID": selectedData.USER_ID,
							"USER_GROUP": selectedData.USER_GROUP,
							"USER_TYPE": selectedData.USER_TYPE,
							"INACTIVE": "",
							"EXPIRED": "X",
							"VALID_FROM": "2019-07-02T00:00:00", //selectedData.VALID_FROM,
							"VALID_TO": "2020-01-31T00:00:00", //selectedData.VALID_TO,
							"STATUS": " ",
							"UFLAG": selectedData.UFLAG
						};
						var params = [];
						params["X-CSRF-Token"] = oModelCom.getSecurityToken();
						params["X-CSRF-Token"] = csrf;
						params["Content-Type"] = "application/json";
						oModelCom.create("/SystemSet", oPayload, {
							headers: params,
							success: function (data) {
								sap.ui.core.BusyIndicator.hide();
								var str = data.STATUS;
								var reqno = str.split("Success");
								sap.m.MessageBox.success("Request creation is successful with Request Number ' " + reqno[1] + "'");
								return;
							},
							error: function (event) {
								sap.ui.core.BusyIndicator.hide();
								sap.m.MessageBox.error("Request creation is unsuccessful");
								return;
							}
						});
						var aUser = [];
						aUser.push(new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, selectedData.USER_ID));
						oModelCom.read("/SystemSet", {
							filters: aUser,
							success: function (data) {
								var oModel = new sap.ui.model.json.JSONModel({
									myItems: data.results
								});
								this.byId("myAccesSysTable").setModel(oModel);
							},
							error: function (event) {
								sap.m.MessageBox.error('Error');
								return;
							}
						});
					}
				}
			});
		},
		onAuthNextStep: function (e) {
			if (e.getSource().getText() === "Next:Role Information") {
				this.byId("idAuth").nextStep();
				e.getSource().setVisible(false);
				return;
			}
			if (e.getSource().getText() === "Next:Request Submission") {
				this.byId("idAuth").nextStep();
				e.getSource().setVisible(false);
				var oRemAccTable = this.getOwnerComponent().getModel("AuthSubRoleInfoModel");
				var oRemAccSelectdata = [];
				var oTab = this.getOwnerComponent().getModel("AuthRoleInfoModel").getData().RolInfoData;
			}
		},
		onMyaccessNav: function (e) {
			var oTitle = e.getParameters().section.mProperties.title;
		},
		onNextStep: function (e) {
			if (e.getSource().getText() === "Next:System/Landscape Information") {
				this.getView().byId("table1").removeSelections();
				this.getView().byId("table2").removeSelections();
				if (this.byId("req_for").getSelectedItem().getText() === "") {
					sap.m.MessageBox.error('Please Select Request For and User.');
					return;
				}
				var aElementID = ["idNewText", "fanem", "lname", "managerID", "idDepart", "IDMOb", "idemail", "cbBusinessProcess"];
				var iErrorCount = 0;
				aElementID.forEach(function (id) {
					var oControl = this.getView().byId(id);
					if (id != 'cbBusinessProcess') {
						if (oControl.getValue() === "") {
							oControl.setValueState("Error");
							iErrorCount += 1;
						} else {
							oControl.setValueState("None");
						}
					} else {
						if (this.getView().byId("cbBusinessProcess").getSelectedKey() == "") {
							this.getView().byId("cbBusinessProcess").setValueState("Error");
							iErrorCount += 1;
						} else {
							this.getView().byId("cbBusinessProcess").setValueState("None");
						}
					}
				}.bind(this));
				if (iErrorCount > 0) {
					sap.m.MessageBox.error("Please fill mandatory fields");
					return false;
				}
				// Email Validation Start
				sap.ui.core.BusyIndicator.show(300);
				var that = this;
				var source = e.getSource();
				var oModelCom = that.getView().getModel('grac');
				var email = this.getView().byId("idemail").getValue();
				//var cCompany = this.getView().byId("cbContractCompany").getSelectedKey();
				var cCompany = this.getView().byId("cbContractCompany").getValue();
				var aFilter = [];
				aFilter.push(new sap.ui.model.Filter("CNORM", sap.ui.model.FilterOperator.EQ, cCompany));
				aFilter.push(new sap.ui.model.Filter("EMAIL", sap.ui.model.FilterOperator.EQ, email));
				oModelCom.read("/Validate_EmailSet", {
					filters: aFilter,
					success: function (data) {
						sap.ui.core.BusyIndicator.hide();
						if (data.results && data.results.length === 1) {
							if (data.results[0].VALID === "X") {
								that.getView().byId("idemail").setValueState("None");
								that.byId("CreateProductWizard").nextStep();
								that.byId("idNewButTcodeInfo").setVisible(true);
								source.setVisible(false);
							} else {
								that.getView().byId("idemail").setValueState("Error");
								sap.m.MessageBox.error('Please enter a valid Email id');
								return
							}
						}
					},
					error: function (event) {
						sap.ui.core.BusyIndicator.hide();
						that.getView().byId("idemail").setValueState("Error");
						sap.m.MessageBox.error('Please enter a valid Email id');
						return;
					}
				});
				// Email Validation End

				sap.ui.core.BusyIndicator.show(300);
				var that = this;
				var oModelCom = that.getView().getModel('grac');
				this.getView().byId("table1").getModel("SysLandInfo").setProperty("/SysLaData", []);
				this.getView().byId("table2").getModel("SeleSysLandInfo").setProperty("/sleSysLaData", []);
				var oNewUser = this.byId("idComboUser").getValue("");
				var aFilter = [];
				aFilter.push(new sap.ui.model.Filter("ACTION", sap.ui.model.FilterOperator.EQ, "UC"));
				aFilter.push(new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, oNewUser));
				oModelCom.read("/NARSystemInformationSet", {
					filters: aFilter,
					success: function (data) {
						if (data.results.length === 0) {
							sap.m.MessageBox.error('No Valid Systems Available');
							return;
						} else {
							for (var i = 0; i < data.results.length; i++) {
								var oSystemModelData = {
									CONNECTOR: data.results[i].CONNECTOR,
									ENVIRONMENT: data.results[i].ENVIRONMENT,
									RFCDOC1: data.results[i].RFCDOC1,
									key: i + 1
								};
								that.getOwnerComponent().getModel("SysLandInfo").getData().SysLaData.push(oSystemModelData);
							}
							that.getOwnerComponent().getModel("SysLandInfo").refresh(true);
							if (data.results.length === 1) {
								//that.getView().byId("table1").selectAll();
							}
						}
						sap.ui.core.BusyIndicator.hide();
					},
					error: function (event) {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageBox.error(JSON.parse(event.responseText));
						return;
					}
				});
			}
			if (e.getSource().getText() === "Next:Transaction code Information") {
				var aTcodeData = [];
				this.getView().byId("idTcode").removeSelections();
				var aSelectedContexts = this.getView().byId("table1").getSelectedContexts();
				var aSelectedRecords = [];
				if (aSelectedContexts.length > 0) {
					aSelectedContexts.forEach(function (oContext) {
						aSelectedRecords.push(oContext.getObject());
						aTcodeData.push({
							"ACTION_ID": "",
							"Connector": oContext.getObject().CONNECTOR,
							"Tcode": "",
							"TcodeDesc": ""
						});
					});
					this.getOwnerComponent().getModel("SeleSysLandInfo").setProperty("/sleSysLaData", aSelectedRecords);
					this.getOwnerComponent().getModel("SeleSysLandInfo").refresh(true);
					this.getView().byId("idTcode").getModel("TcodeModel").setProperty("/TcodeData", aTcodeData);
					this.byId("CreateProductWizard").nextStep();
					this.byId("idNewOrgNext").setVisible(true);
					e.getSource().setVisible(false);
					this._bIsNavigatedToStep3 = true;
					return;
				} else {
					sap.m.MessageBox.error('Please select at least one System.');
					return;
				}
			}
			if (e.getSource().getText() === "Next:Organization value Information") {
				debugger
				//Get Tcode Data for the UI
				var that = this;
				var TcodeModel = that.getOwnerComponent().getModel("TcodeModel").getData().TcodeData;
				var aSelTCodeData = that.getOwnerComponent().getModel("SeleSysLandInfo").getProperty("/sleSysLaData");
				var bNavToNextStep = true;
				aSelTCodeData.forEach(function (item, index) {
					var tmpArray = TcodeModel.filter(function (oRecord) {
						return (oRecord.Connector === item.CONNECTOR);
					});
					bNavToNextStep = tmpArray.length === 0 ? false : true;
				});
				TcodeModel.forEach((item, index) => {
					if (item.Tcode === "") {
						bNavToNextStep = false;
					}
				});

				if (bNavToNextStep) {
					this.byId("CreateProductWizard").nextStep();
					this.byId("idNewRoleNext").setVisible(true);
					e.getSource().setVisible(false);
					this._FlageOrgCheck = true;
					sap.ui.core.BusyIndicator.show(300);
					var TcodeInfo = [];
					//Clear Org Information Table before filling it
					that.getView().byId("idTableOrg").getModel("OrgTableModel").setProperty("/OrgData", []);
					if (TcodeModel.length !== 0) {
						tcode = "";
						TcodeModel.forEach((item, index) => {
							if (index !== 0) {
								tcode = tcode.concat(', ');
							}
							var tdata = {
								"TCODE": TcodeModel[index].Tcode,
								"CONNECTOR": TcodeModel[index].Connector
							};
							TcodeInfo.push(tdata);
							//Get the Tcode List
							tcode = tcode.concat(TcodeModel[index].Tcode);
						});
						//Set Text of Tcode list in Review tab
						this.getView().byId("idTcodesList").setText(tcode);
						var oPayload = {
							"USER_ACTION": "ROLE",
							"NARRoleInformationSet": TcodeInfo
						};
						var OrgTableModel = that.getOwnerComponent().getModel("OrgTableModel");
						var oModel = that.getView().getModel('grac');
						var params = [];
						var GUID;
						params["X-CSRF-Token"] = oModel.getSecurityToken();
						params["X-CSRF-Token"] = csrf;
						params["Content-Type"] = "application/json";
						oModel.create('/NARUserInformationSet', oPayload, {
							headers: params,
							success: function (data) {
								GUID = data.GUID;
								//get Org values from GUID
								var oFilter = [];
								if (GUID) {
									oFilter.push(new sap.ui.model.Filter("GUID", sap.ui.model.FilterOperator.EQ, GUID));
									oModel.read("/NAROrgValueInformationSet", {
										async: true,
										filters: oFilter,
										success: function (data1) {
											if (data1.results.length === 0) {
												sap.m.MessageBox.error('The Org Value is not Available for these Tcodes.');
												return;
											} else {
												//var newData = data.results[0];
												for (var i = 0; i < data1.results.length; i++) {
													if (data1.results[i].VTEXT !== "") {
														var newOrgData = {
															OrgLevel: data1.results[i].FIELDNAME,
															OrgVal: data1.results[i].VTEXT,
															Tcode: data1.results[i].ACTION,
															FromOrg: "", //neData.VALUE_FROM,
															ToOrg: "",
															Conn: data1.results[i].CONNECTOR,
															priority: data1.results[i].PRIORITY
														};
														OrgTableModel.getData().OrgData.push(newOrgData);
													}
													OrgTableModel.refresh(true);
												}
											}
											sap.ui.core.BusyIndicator.hide();
										},
										error: function (event) {
											sap.ui.core.BusyIndicator.hide();
											sap.m.MessageBox.error('Org Values not found for the GUID');
											return;
										}
									});
								}
							},
							error: function (data) {
								sap.ui.core.BusyIndicator.hide();
								sap.m.MessageBox.error("No Valid GUID Found");
							}
						});
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				} else {
					MessageBox.error("Please maintain Transaction Code for all the Systems.");
				}
			}
			if (e.getSource().getText() === "Next:Role Information") {
				sap.ui.core.BusyIndicator.show(300);
				var TcodeInfo = [];
				this.getView().byId("tableRole").getModel("RoleInfoModel").setProperty("/RolInfoData", []);
				var TcodeModel = this.getOwnerComponent().getModel("TcodeModel").getData().TcodeData;
				if (TcodeModel.length !== 0) {
					TcodeModel.forEach((item, index) => {
						var tdata = {
							"TCODE": TcodeModel[index].Tcode,
							"CONNECTOR": TcodeModel[index].Connector
						};
						TcodeInfo.push(tdata);
					});
				}
				var OrgTableModel = this.getOwnerComponent().getModel("OrgTableModel").getData().OrgData;
				if (OrgTableModel.length !== 0) {
					OrgTableModel.forEach((item, index) => {
						// text = text.concat(OrgTableModel[index].Tcode);
						var orgdata = {
							"TCODE": OrgTableModel[index].Tcode,
							"PRIORITY": "" + OrgTableModel[index].priority + "",
							"ORG_LEVEL": "$" + OrgTableModel[index].OrgLevel + "",
							"FROM_VALUE": OrgTableModel[index].FromOrg,
							"TO_VAUE": OrgTableModel[index].ToOrg,
							"CONNECTOR": OrgTableModel[index].Conn
						};
						TcodeInfo.push(orgdata);
					});
					var oPayload = {
						"USER_ACTION": "ROLE",
						"NARRoleInformationSet": TcodeInfo
					};
					var RoleTableModel = this.getOwnerComponent().getModel("RoleInfoModel");
					var oModel = this.getView().getModel('grac');
					var params = [];
					var GUID;
					params["X-CSRF-Token"] = oModel.getSecurityToken();
					params["X-CSRF-Token"] = csrf;
					params["Content-Type"] = "application/json";
					oModel.create('/NARUserInformationSet', oPayload, {
						headers: params,
						success: function (data) {
							GUID = data.GUID;
							//get Org values from GUID
							var oFilter = [];
							if (GUID) {
								oFilter.push(new sap.ui.model.Filter("GUID", sap.ui.model.FilterOperator.EQ, GUID));
								oModel.read("/NARRoleInformationSet", {
									async: true,
									filters: oFilter,
									success: function (data1) {
										if (data1.results.length === 0) {
											sap.m.MessageBox.error('Roles are not available');
											return;
										} else {
											//var newData = data.results[0];
											for (var i = 0; i < data1.results.length; i++) {
												var RolData = {
													System: data1.results[i].CONNECTOR,
													sysDesc: data1.results[i].RFCDOC1,
													tCode: data1.results[i].TCODE,
													role: data1.results[i].ROLE_NAME,
													Desc: data1.results[i].ROLE_DESCN,
													roleType: data1.results[i].ROLE_TYPE,
													key: i + 1
												};
												RoleTableModel.getData().RolInfoData.push(RolData);
												RoleTableModel.refresh(true);
											}
										}
										sap.ui.core.BusyIndicator.hide();
									},
									error: function (event) {
										sap.ui.core.BusyIndicator.hide();
										sap.m.MessageBox.error('Roles are not found for the GUID');
										return;
									}
								});
							}
						},
						error: function (data) {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageBox.error("No Valid GUID Found");
						}
					});
				} else {
					sap.ui.core.BusyIndicator.hide();
				}
				this.byId("CreateProductWizard").nextStep();
				this.byId("idNewRoleSubNext").setVisible(true);
				e.getSource().setVisible(false)
				return;
			}
			if (e.getSource().getText() === "Next:Risk Analysis") {
				this.byId("CreateProductWizard").nextStep();
				e.getSource().setVisible(false)
				return;
			}
			if (e.getSource().getText() === "Next:Attachments") {
				this.byId("CreateProductWizard").nextStep();
				e.getSource().setVisible(false)
				return;
			}
			if (e.getSource().getText() === "Next:Request Submission") {
				this.byId("txtFnameReviewRequest").setText(this.byId("fanem").getValue());
				this.byId("txtLnameReviewRequest").setText(this.byId("lname").getValue());
				this.byId("idReqRaisedFor").setText(this.byId("req_for").getSelectedItem().getText());
				this.byId("CreateProductWizard").nextStep();
				e.getSource().setVisible(false);
				return;
			}
			if (e.getSource().getText() === "Refresh Request Submission") {
				this.byId("txtFnameReviewRequest").setText(this.byId("fanem").getValue());
				this.byId("txtLnameReviewRequest").setText(this.byId("lname").getValue());
				this.byId("idReqRaisedFor").setText(this.byId("req_for").getSelectedItem().getText());
				var that = this;
				var TcodeInfo = [];
				var TcodeModel = that.getOwnerComponent().getModel("TcodeModel").getData().TcodeData;
				if (TcodeModel.length !== 0) {
					tcode = "";
					TcodeModel.forEach((item, index) => {
						if (index !== 0) {
							tcode = tcode.concat(', ');
						}
						var tdata = {
							"TCODE": TcodeModel[index].Tcode,
							"CONNECTOR": TcodeModel[index].Connector
						};
						TcodeInfo.push(tdata);
						//Get the Tcode List
						tcode = tcode.concat(TcodeModel[index].Tcode);
					});
					this.getView().byId("idTcodesList").setText(tcode);
				}
				return;
			}
		},
		onNextStepRemoveAccess: function (e) {
			if (e.getSource().getText() === 'Next:Access Information') {
				var aElementID = ["idRemText", "idRemFName", "idRemLName", "idRemRepMana", "idRemDept",
					"idRemMNumber",
					"idRemEmail",
				];
				var iErrorCount = 0;
				aElementID.forEach(function (id) {
					var oControl = this.getView().byId(id);
					if (oControl.getValue() === "") {
						oControl.setValueState("Error");
						iErrorCount += 1;
					} else {
						oControl.setValueState("None");
					}
				}.bind(this));
				if (iErrorCount > 0) {
					sap.m.MessageBox.error("Please fill mandatory fields");
					return false;
				}
				this.byId("CreateProductWizardId2").nextStep();
				this.byId("idRemButReq").setVisible(true);
				e.getSource().setVisible(false);
				this.getView().byId("idRemUpdSelBut").setVisible(true);
			}
			if (e.getSource().getText() === 'Next:Lock User') {
				var oRemAccTable = this.byId("idRemAccSelTable");
				var oRemAccSelectdata = [];
				var oTab = this.getView().byId("idRemAccTable");
				for (var i = 0; i < oTab.getSelectedContexts().length; i++) {
					oRemAccSelectdata[i] = oTab.getSelectedContexts()[i].getObject();
				};
				var oAccessModel = new JSONModel(oRemAccSelectdata);
				oAccessModel.setData({
					accessSelData: oRemAccSelectdata
				});
				oRemAccTable.setModel(oAccessModel);
				this.byId("CreateProductWizardId2").nextStep();
			}
			if (e.getSource().getText() === 'Next:Request Submission') {
				this.onUpdateSeleTable();
				this.byId("CreateProductWizardId2").nextStep();
			}
		},
		onUpdateSeleTable: function () {
			var oRemAccTable = this.byId("idRemAccSelTable");
			var oRemAccSelectdata = [];
			var oTab = this.getView().byId("idRemAccTable");
			for (var i = 0; i < oTab.getSelectedContexts().length; i++) {
				oRemAccSelectdata[i] = oTab.getSelectedContexts()[i].getObject();
			};
			var oAccessModel = new JSONModel(oRemAccSelectdata);
			oAccessModel.setData({
				accessSelData: oRemAccSelectdata
			});
			oRemAccTable.setModel(oAccessModel);
		},
		onNextStepFireFighter: function (e) {
			if (e.getSource().getText() === 'Next:System/Landscape Information') {
				this.getView().byId("table1FF").removeSelections();
				this.getView().byId("table2FF").removeSelections();
				var aElementID = ["idFfidText", "idFfFName", "idFfLName", "idFfRepMana", "idFfPNumber", "idFfDept", "idFfMNumber",
					"idFfEmail"
				];
				var iErrorCount = 0;
				aElementID.forEach(function (id) {
					var oControl = this.getView().byId(id);
					if (oControl.getValue() === "") {
						oControl.setValueState("Error");
						iErrorCount += 1;
					} else {
						oControl.setValueState("None");
					}
				}.bind(this));
				if (iErrorCount > 0) {
					sap.m.MessageBox.error("Please fill mandatory fields");
					return false;
				}
				this.getView().byId("table1FF").getModel("SysLandInfoFF").setProperty("/SysLaData", []);
				this.getView().byId("table2FF").getModel("SeleSysLandInfoFF").setProperty("/sleSysLaData", []);
				this.byId("CreateProductWizardId261").nextStep();
				//Commmented by Nikhil
				this.byId("idFFButGetFFID").setVisible(true);
				e.getSource().setVisible(false);
				var that = this;
				var oModelCom = that.getView().getModel('grac');
				sap.ui.core.BusyIndicator.show(300);
				var oFFUser = this.byId("idComboUser2FF").getValue("");
				var aFilter = [];
				aFilter.push(new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, oFFUser));
				oModelCom.read("/NARSystemInformationSet", {
					filters: aFilter,
					success: function (data) {
						if (data.results.length === 0) {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageBox.error('System is not Avilable.');
							return;
						} else {
							for (var i = 0; i < data.results.length; i++) {
								var oSystemModelData = {
									CONNECTOR: data.results[i].CONNECTOR,
									ENVIRONMENT: data.results[i].ENVIRONMENT,
									RFCDOC1: data.results[i].RFCDOC1,
									key: i + 1
								};
								that.getOwnerComponent().getModel("SysLandInfoFF").getData().SysLaData.push(oSystemModelData);
							}
							that.getOwnerComponent().getModel("SysLandInfoFF").refresh(true);
							if (data.results.length === 1) {
								that.getView().byId("table1FF").selectAll();
							}
							sap.ui.core.BusyIndicator.hide();
						}
					},
					error: function (event) {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageBox.error('Error');
						return;
					}
				});
			}
			if (e.getSource().getText() === 'Next:Firefighter IDs') {
				var aSlectedContexts = this.getView().byId("table1FF").getSelectedContexts();
				if (aSlectedContexts.length === 0) {
					MessageBox.error("Please select atleast one system.");
					return false;
				}
				this.getView().byId("DragTableFireFighterID").removeSelections();
				this.getView().byId("DropTableFireFighterID").removeSelections();
				this.getView().byId("DragTableFireFighterID").getModel("FireFiIds").setProperty("/FireFiId", []);
				this.getView().byId("DropTableFireFighterID").getModel("FireFiIdsel").setProperty("/FireFiId", []);
				this.byId("CreateProductWizardId261").nextStep();
				this.byId("idFFButFFID").setVisible(true);
				e.getSource().setVisible(false);
				this._FlageOrgCheck = true;
				var that = this;
				var aSelectedSysLandInfo = [];
				aSlectedContexts.forEach(function (oContext) {
					aSelectedSysLandInfo.push(oContext.getObject());
				});
				that.getOwnerComponent().getModel("SeleSysLandInfoFF").setProperty("/sleSysLaData", aSelectedSysLandInfo);
				var FireFiIdsel = aSelectedSysLandInfo;
				var oModelCom = that.getView().getModel('grac');
				var FFVlid = that.getOwnerComponent().getModel("FireFiIds");
				if (FireFiIdsel.length !== 0) {
					FireFiIdsel.forEach((item, index) => {
						var oFilter = [];
						var oFilterConnector = FireFiIdsel[index].CONNECTOR;
						if (oFilterConnector) {
							oFilter.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, oFilterConnector));
						}
						sap.ui.core.BusyIndicator.show(300);
						oModelCom.read("/GetFirefighterObjSet", {
							async: true,
							filters: oFilter,
							success: function (data) {
								if (data.results.length === 0) {
									sap.ui.core.BusyIndicator.hide();
									return;
								} else {
									for (var i = 0; i < data.results.length; i++) {
										var oSystemModelData = {
											"APP_TYPE": data.results[i].APP_TYPE,
											"CONNECTOR": data.results[i].CONNECTOR,
											"FFOBJECT": data.results[i].FFOBJECT,
											"USER_ID": data.results[i].USER_ID,
											"VALID_FROM": data.results[i].VALID_FROM,
											"VALID_TO": data.results[i].VALID_TO
										};
										FFVlid.getData().FireFiId.push(oSystemModelData);
									}
									FFVlid.refresh(true);
									sap.ui.core.BusyIndicator.hide();
								}
							},
							error: function (event) {
								sap.ui.core.BusyIndicator.hide();
								sap.m.MessageBox.error('Error Occured.');
								return;
							}
						});
					});
				}
			}
			if (e.getSource().getText() === 'Next:Firefighter Validity') {
				var aSelectedFFContexts = this.getView().byId("DragTableFireFighterID").getSelectedContexts();
				var aFFData = [];
				aSelectedFFContexts.forEach(function (oContext) {
					aFFData.push(oContext.getObject());
				});
				this.getView().byId("idFFValidTable").removeSelections();
				this.getView().byId("idFFValidTable").getModel("FFVlid").setProperty("/ffvData", []);
				this.byId("CreateProductWizardId261").nextStep();
				this.byId("idFFButReqSub").setVisible(true);
				e.getSource().setVisible(false);
				this._FlageOrgCheck = true;
				var that = this;
				var oModelCom = that.getView().getModel('grac');
				that.getOwnerComponent().getModel("FireFiIdsel").setProperty("/FireFiId", aFFData)
				var FireFiIdsel = that.getOwnerComponent().getModel("FireFiIdsel").getData().FireFiId;
				var FFVlid = that.getOwnerComponent().getModel("FFVlid");
				if (FireFiIdsel.length !== 0) {
					FireFiIdsel.forEach((item, index) => {
						var oFilter = [];
						var oFilterFFOBJECT = FireFiIdsel[index].FFOBJECT;
						var oFilterConnector = FireFiIdsel[index].CONNECTOR;
						if (oFilterFFOBJECT) {
							oFilter.push(new sap.ui.model.Filter("FFOBJECT", sap.ui.model.FilterOperator.EQ, oFilterFFOBJECT));
						}
						if (oFilterConnector) {
							oFilter.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, oFilterConnector));
						}
						sap.ui.core.BusyIndicator.show(300);
						oModelCom.read("/GetFirefighterObjSet", {
							async: true,
							filters: oFilter,
							success: function (data) {
								if (data.results.length === 0) {
									sap.ui.core.BusyIndicator.hide();
									sap.m.MessageBox.error('The Fire Fighter Vality data not Avilable.');
									return;
								} else {
									var newData = data.results;
									var oSystemModelData = {
										"APP_TYPE": data.results[0].APP_TYPE,
										"CONNECTOR": data.results[0].CONNECTOR,
										"FFOBJECT": data.results[0].FFOBJECT,
										"USER_ID": data.results[0].USER_ID,
										"VALID_FROM": data.results[0].VALID_FROM,
										"VALID_TO": data.results[0].VALID_TO
									};
									FFVlid.getData().ffvData.push(oSystemModelData);
									FFVlid.refresh(true);
									sap.ui.core.BusyIndicator.hide();
								}
							},
							error: function (event) {
								sap.ui.core.BusyIndicator.hide();
								sap.m.MessageBox.error('Error Occured.');
								return;
							}
						});
					});
				}
			}
			if (e.getSource().getText() === 'Next:Request Submission') {
				this.byId("CreateProductWizardId261").nextStep();
				this.byId("idFFButReqSub").setVisible(true);
				e.getSource().setVisible(false);
				this.getView().byId("idFfidSelTable").removeSelections();
				var oFfidTable = this.byId("idFfidSelTable");
				var oFfidSelectdata = [];
				var oTab = this.getView().byId("idFFValidTable");
				for (var i = 0; i < oTab.getSelectedContexts().length; i++) {
					oFfidSelectdata[i] = oTab.getSelectedContexts()[i].getObject();
				};
				var oFfidModel = new JSONModel(oFfidSelectdata);
				oFfidModel.setData({
					FfidSelData: oFfidSelectdata
				});
				oFfidTable.setModel(oFfidModel);
			}
			if (e.getSource().getText() === "Next:Attachments") {
				this.byId("CreateProductWizardId261").nextStep();
				e.getSource().setVisible(false);
			}
		},
		onMobilenumber: function (e) {
			e.getSource().setEditable(true);
			var no = e.getParameter("value");
			if (no.length > 10 && e.keyCode !== 46 // keycode for delete
				&&
				e.keyCode !== 8 // keycode for backspace
			) {
				e.preventDefault();
				e.getSource().setValue(value);
				e.getSource().setEditable(true);
			}
		},
		onEMpTypChange: function (e) {
			if (e.getParameter("selectedItem").getText() === "3rd Party User") {
				this.getView().byId("idempid").setVisible(true);
				this.getView().byId("idvendor").setVisible(true);
				this.getView().byId("idempidMod").setVisible(true);
				this.getView().byId("idvendorMod").setVisible(true);
				this.getView().byId("idFfEmpId").setVisible(true);
				this.getView().byId("idFfVenNum").setVisible(true);
				this.getView().byId("idRemEmpId").setVisible(true);
				this.getView().byId("idRemVenNum").setVisible(true);
				this.getView().byId("idNew3rdPary").setText("3rd Party User Details");
				this.getView().byId("idModify3rdPary").setText("3rd Party User Details");
				this.getView().byId("idFF3rdPary").setText("3rd Party User Details");
				this.getView().byId("idRemove3rdPary").setText("3rd Party User Details");
			}
			if (e.getParameter("selectedItem").getText() === "Adani") {
				this.getView().byId("idempid").setVisible(false);
				this.getView().byId("idvendor").setVisible(false);
				this.getView().byId("idempidMod").setVisible(false);
				this.getView().byId("idvendorMod").setVisible(false);
				this.getView().byId("idFfEmpId").setVisible(false);
				this.getView().byId("idFfVenNum").setVisible(false);
				this.getView().byId("idRemEmpId").setVisible(false);
				this.getView().byId("idRemVenNum").setVisible(false);
				this.getView().byId("idNew3rdPary").setText("");
				this.getView().byId("idModify3rdPary").setText("");
				this.getView().byId("idFF3rdPary").setText("");
				this.getView().byId("idRemove3rdPary").setText("");
				this.getView().byId("idModify3rdPary").setVisible(false);
			}
		},
		onValidatationCheck: function (e) {
			if (e.getParameter("value") === "") {
				e.getSource().setValueState(sap.ui.core.ValueState.Error)
			} else {
				e.getSource().setValueState(sap.ui.core.ValueState.Success)
			}
			if (e.getParameter("selectedItem").getText() === "3rd Party User") {
				this.getView().byId("idempid").setVisible(true);
				this.getView().byId("idvendor").setVisible(true);
				this.getView().byId("idempidMod").setVisible(true);
				this.getView().byId("idvendorMod").setVisible(true);
				this.getView().byId("idFfEmpId").setVisible(true);
				this.getView().byId("idFfVenNum").setVisible(true);
				this.getView().byId("idRemEmpId").setVisible(true);
				this.getView().byId("idRemVenNum").setVisible(true);
				this.getView().byId("idModify3rdPary").setVisible(true);
				this.getView().byId("idNew3rdPary").setText("3rd Party User Details");
				this.getView().byId("idModify3rdPary").setText("3rd Party User Details");
				this.getView().byId("idFF3rdPary").setText("3rd Party User Details");
				this.getView().byId("idRemove3rdPary").setText("3rd Party User Details");
			}
			if (e.getParameter("selectedItem").getText() === "Adani") {
				this.getView().byId("idempid").setVisible(false);
				this.getView().byId("idvendor").setVisible(false);
				this.getView().byId("idempidMod").setVisible(false);
				this.getView().byId("idvendorMod").setVisible(false);
				this.getView().byId("idFfEmpId").setVisible(false);
				this.getView().byId("idFfVenNum").setVisible(false);
				this.getView().byId("idRemEmpId").setVisible(false);
				this.getView().byId("idRemVenNum").setVisible(false);
				this.getView().byId("idNew3rdPary").setText("");
				this.getView().byId("idModify3rdPary").setText("");
				this.getView().byId("idFF3rdPary").setText("");
				this.getView().byId("idRemove3rdPary").setText("");
			}
		},
		onRoleSearchPress: function (e) {
			this.getView().byId("idRoleSearchTable").getModel("RoleInfoModel1").setProperty("/RolInfoData1", []);
			this.getView().byId("idRoleSearchTable").setVisible(true);
			var role = this.getView().byId("idRole").getValue();
			var sys = this.getView().byId("idSystem").getSelectedKey();
			var that = this;
			var RoleTableModel = that.getOwnerComponent().getModel("RoleInfoModel1");
			var oFilterRole = [];
			oFilterRole.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, sys));
			oFilterRole.push(new sap.ui.model.Filter("ROLE_NAME", sap.ui.model.FilterOperator.EQ, role));
			var oModelCom = that.getView().getModel('grac');
			oModelCom.read("/NARRoleInformationSet", {
				async: true,
				filters: oFilterRole,
				success: function (data) {
					if (data.results.length === 0) {
						sap.m.MessageBox.error('The Role Information is not avilable for selected System/Systems');
						return;
					} else {
						for (var i = 0; i < data.results.length; i++) {
							var RolData = {
								role: data.results[i].ROLE_NAME,
								Desc: data.results[i].ROLE_DESCN,
								System: data.results[i].CONNECTOR,
								sysDesc: data.results[i].RFCDOC1,
								roleType: data.results[i].ROLE_TYPE,
								key: i + 1
							};
							RoleTableModel.getData().RolInfoData1.push(RolData);
							RoleTableModel.refresh(true);
						}
					}
				},
				error: function (event) {
					sap.m.MessageBox.error('No Suitable Roles found');
					return;
				}
			});
		},
		addExistAssignPress: function () {
			var that = this;
			this.getView().byId("idExistRole").getModel("ExistRoleModel").setProperty("/RoleData", []);
			var RoleTableModel = that.getOwnerComponent().getModel("ExistRoleModel");
			var oTab = that.getView().getModel("ExistRoleModel");
			for (var i = 0; i < oTab.getData().RoleData.length; i++) {
				delete oTab.getData().RoleData[i]
			};
			var oFilterRole = [];
			oFilterRole.push(new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, oUserID));
			var oModelCom = that.getView().getModel('grac');
			oModelCom.read("/NARRoleInformationSet", {
				async: true,
				filters: oFilterRole,
				success: function (data) {
					if (data.results.length === 0) {
						sap.m.MessageBox.error('The Role Information is not avilable for selected System/Systems');
						return;
					} else {
						for (var i = 0; i < data.results.length; i++) {
							var RolData = {
								role: data.results[i].ROLE_NAME,
								Desc: data.results[i].ROLE_DESCN,
								System: data.results[i].CONNECTOR,
								sysDesc: data.results[i].RFCDOC1,
								roleType: data.results[i].ROLE_TYPE,
								key: i + 1
							};
							RoleTableModel.getData().RoleData.push(RolData);
							RoleTableModel.refresh(true);
						}
					}
				},
				error: function (event) {
					sap.m.MessageBox.error('No Roles Found');
					return;
				}
			});
			that.ExistingRoleonPress().open()
		},
		closeExistRoleonPress: function () {
			this.ExistingRoleonPress().close()
		},
		onExistRoleAddPress: function () {
			var RoleTableModel = this.getOwnerComponent().getModel("RoleInfoModelMod");
			var oTab = this.getView().byId("idExistRole");
			for (var i = 0; i < oTab.getSelectedContexts().length; i++) {
				var oRemAccSelectdata = oTab.getSelectedContexts()[i].getObject();
				oRemAccSelectdata.prov = "009";
				oRemAccSelectdata.action = "Remove";
				RoleTableModel.getData().RolInfoData.push(oRemAccSelectdata);
				RoleTableModel.refresh(true);
			};
			this.ExistingRoleonPress().close();
		},
		onAuthSubmit: function (e) {
			var oModel = this.getView().getModel("grac");
			var oRoleDateFromTable = this.getOwnerComponent().getModel("AuthRoleInfoModel").getData().RolInfoData;
			var RoleData = [];
			if (oRoleDateFromTable.length !== 0) {
				oRoleDateFromTable.forEach((item, index) => {
					var Roldata = {
						"CONNECTOR": oRoleDateFromTable[index].System,
						"ROLE_NAME": oRoleDateFromTable[index].role,
						"ROLE_TYPE": oRoleDateFromTable[index].roleType,
						"PROV_ACTION": "006"
					};
					RoleData.push(Roldata);
				});
			}

			var oPayload = {
				"USER_ACTION": "SUBMIT",
				"IDENTIFIER": "SU53",
				"USER_ID": this.getOwnerComponent().getModel("navModel").getData().oResult.user_id,
				"SU53RoleInformationSet": RoleData
			};
			var params = [];
			params["X-CSRF-Token"] = oModel.getSecurityToken();
			params["X-CSRF-Token"] = csrf;
			params["Content-Type"] = "application/json";
			oModel.create('/NARUserInformationSet', oPayload, {
				headers: params,
				success: function (data) {
					var mesg = "Your Request has been submitted successfully with request '" + data.STATUS + "'";
					var mesg2 = "Your Request has been saved successfully."
					var finalMesg = (that.flagM === "SAVE" ? mesg2 : mesg);
					sap.m.MessageBox.success(finalMesg);
				},
				error: function (data) {
					sap.m.MessageBox.error("Request Creation is unsuccessful");
				}
			});
		},

		onSubmit: function (Oevent) {
			var textFlag = Oevent.getSource().getText();
			if (textFlag === "Submit") {
				this._onSubmitOrSave("SUBMIT");
			} else if (textFlag === "Save") {
				this._onSubmitOrSave("SAVE");
			}
		},
		_onSubmitOrSave: function (saveOrSubmit) {
			sap.ui.core.BusyIndicator.show(300);
			var text = this.getView().byId("idNewText").getValue();
			var oFlagSavSub = saveOrSubmit;
			var oModel = this.getView().getModel("grac");
			var that = this;
			that.flagM = oFlagSavSub;
			var oUserInfoModel = this.getView().getModel("userInfoNew").getData();
			oUserInfoModel.EMPTYPE = this.getView().byId("idemptype").getSelectedKey();
			var oSeleSysLandInfo = this.getOwnerComponent().getModel("SeleSysLandInfo").getData().sleSysLaData;
			var SysLandInfo = [];
			if (oSeleSysLandInfo.length !== 0) {
				oSeleSysLandInfo.forEach((item, index) => {
					var tdata = {
						"USER_ID": oUserInfoModel.USER_ID,
						"CONNECTOR": oSeleSysLandInfo[index].CONNECTOR,
						"ENVIRONMENT": oSeleSysLandInfo[index].ENVIRONMENT,
						"RFCDOC1": oSeleSysLandInfo[index].RFCDOC1
					};
					SysLandInfo.push(tdata);
				});
			}
			//add Tcode and Org values in the description
			var tcode = "   TCODE: ";
			tcode = tcode.concat(this.getView().byId("idTcodesList").getText());
			text = text.concat(tcode);
			var oOrgDataInfo = this.getOwnerComponent().getModel("OrgTableModel").getData().OrgData;
			var OrgData = [];
			if (oOrgDataInfo.length !== 0) {
				oOrgDataInfo.forEach((item, index) => {
					if (oOrgDataInfo[index].FromOrg !== '') {
						var org = ", ORG_LEVEL : ";
						text = text.concat(org);
						text = text.concat(oOrgDataInfo[index].OrgLevel);
						var val = ", FROM_VALUE: ";
						text = text.concat(val);
						text = text.concat(oOrgDataInfo[index].FromOrg)
					}
				});
			}
			var oRoleDateFromTable = this.getOwnerComponent().getModel("RoleInfoModel").getData().RolInfoData;
			var RoleData = [];
			if (oRoleDateFromTable.length !== 0) {
				oRoleDateFromTable.forEach((item, index) => {
					var Roldata = {
						"CONNECTOR": oRoleDateFromTable[index].System,
						"ROLE_NAME": oRoleDateFromTable[index].role,
						"RFCDOC1": oRoleDateFromTable[index].sysDesc,
						"ROLE_TYPE": oRoleDateFromTable[index].roleType,
						"ROLE_DESCN": oRoleDateFromTable[index].Desc,
						"PROV_ACTION": "006"
					};
					RoleData.push(Roldata);
				});
			}
			var is3rdParty = this.getView().getModel("3rdparty").getProperty("/Is3rdParty");
			var idnt = "";
			if (is3rdParty) {
				idnt = "CA"
			} else {
				idnt = "AA"
			}
			var BProcess = this.getView().byId("cbBusinessProcess").getSelectedKey();
			var oPayload = {
				"USER_ACTION": oFlagSavSub,
				"IDENTIFIER": idnt,
				"USER_ID": this.byId("idComboUser").getValue(),
				"FIRST_NAME": this.byId("fanem").getValue(),
				"LAST_NAME": this.byId("lname").getValue(),
				"EMPTYPE": this.byId("idemptype").getSelectedKey(),
				"ZRMID": this.byId("managerID").getValue(),
				"ZEMPID": this.byId("idPNumber").getValue(),
				"DEPARTMENT": this.byId("idDepart").getValue(),
				"PHONE": this.byId("IDMOb").getValue(),
				"EMAIL": this.byId("idemail").getValue(),
				"NARSystemInformationSet": SysLandInfo,
				"NARRoleInformationSet": RoleData,
				"DESCRIPTION": text,
				"ALIAS": this.byId("idAlias").getValue(),
				"requester": oUserID
			};
			var params = [];
			params["X-CSRF-Token"] = oModel.getSecurityToken();
			params["X-CSRF-Token"] = csrf;
			params["Content-Type"] = "application/json";
			var slug = this.file.name;
			var filetype = this.file.type;
			var oCSRFToken = oModel.getSecurityToken();
			//attach file after we get req no
			// var slug = this.file.name;
			// var filetype = this.file.type;

			//var oCSRFToken = oModel.getSecurityToken();

			oModel.create('/NARUserInformationSet', oPayload, {
				headers: params,
				success: function (data) {
					sap.ui.core.BusyIndicator.hide();
					var mesg = "Your Request has been submitted successfully with request '" + data.STATUS + "'";
					var mesg2 = "Your Request has been saved successfully."
					var finalMesg = (that.flagM === "SAVE" ? mesg2 : mesg);
					sap.ui.core.BusyIndicator.show();
					sap.m.MessageBox.success(finalMesg);
					//var oFileUploader = that.getView().byId("idRemfileUploader");
					var oFileUploader = sap.ui.getCore().byId("idfileUploader1");
					if (oFileUploader.getValue() === "") {
						MessageToast.show("Please Choose any File");
					}
					oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						name: "SLUG",
						value: slug
					}));
					oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						name: "Content-Type",
						value: filetype
					}));
					oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						name: "x-csrf-token",
						value: oModel.getSecurityToken()
					}));
					var sUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/NARUserInformationSet(USER_ID='" + data.STATUS + "')/AttachementsSet";
					oFileUploader.setUploadUrl(sUrl);
					oFileUploader.setSendXHR(true);
					oFileUploader.upload();
					var AttDataRem = {
						"AttInfoData": []
					};
					that.getOwnerComponent().getModel("AttInfoModelMod").setData(AttDataRem);
					that.handleUploadCompleteMod(that.flagM);
				},
				error: function (data) {
					sap.ui.core.BusyIndicator.hide();
					if (JSON.parse(data.responseText)) {
						sap.m.MessageBox.error("Request Creation is unsuccessful'" + JSON.parse(data.responseText).error.message.value + "'");
					} else {
						sap.m.MessageBox.error("Request Creation is unsuccessful");
					}
				}
			});
		},
		onUploadEx1cel: function (e) {
			this._import(e.getParameter("files") && e.getParameter("files")[0]);
		},
		_import: function (file) {
			var t = this;
			var o = {};
			if (file && window.FileReader) {
				var a = new FileReader;
				a.onload = function (e) {
					var a = e.target.result;
					var i = XLSX.read(a, {
						type: "binary"
					});
					i.SheetNames.forEach(function (sheetName) {
						o = XLSX.utils.sheet_to_row_object_array(i.Sheets[sheetName])
					});
					t.localModel.setData({
						items: o
					});
					t.localModel.refresh(true)
				};
				a.onerror = function (ex) {
					console.log(ex)
				};
				a.readAsBinaryString(file)
			}
		},
		validateBeforeUpload: function () {
			var e = sap.ui.getCore().byId("idfileUploader");
			if (e.getValue() === "") {
				MessageBox.warning(this.getResource("poupload_validation_please_select_file"));
				return false
			}
			return true
		},
		validateBeforeUploadRole: function () {
			var e = sap.ui.getCore().byId("idfileUploaderRole");
			if (e.getValue() === "") {
				MessageBox.warning(this.getResource("poupload_validation_please_select_file"));
				return false
			}
			return true
		},
		clearTable: function () {
			var e = this.getView().byId("tblExcelData")
		},
		BusinessChange: function (e) {
			var oItemdBusiness = e.getSource().getItems();
			var oValueFound = 0;
			for (var oBusiness = 0; oBusiness <= oItemdBusiness.length - 1; oBusiness++) {
				if (e.getSource().getItems()[oBusiness].getBindingInfo("text").binding.vOriginalValue == e.getParameter("value")) {
					oValueFound += 1;
				}
			}
			if (oValueFound == 0) {
				e.getSource().setValue("");
			}
		},
		onUpload1: function (e) {
			this._import(e.getParameter("files") && e.getParameter("files")[0]);
		},

		_import: function (file) {
			var that = this;
			var excelData = {};
			if (file && window.FileReader) {
				var reader = new FileReader();
				reader.onload = function (e) {
					var data = e.target.result;
					var workbook = XLSX.read(data, {
						type: 'binary'
					});
					workbook.SheetNames.forEach(function (sheetName) {
						// Here is your object for every sheet in workbook
						excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
					});
					var copyExcelData = [...excelData];
					var oSelectedTcodes = that.getOwnerComponent().getModel("SeleSysLandInfoMod").getProperty("/sleSysLaData");
					oSelectedTcodes = oSelectedTcodes.filter(x => x !== undefined);
					var oFullTcodes = that.getOwnerComponent().getModel("SysLandInfoMod").getProperty("/SysLaData");
					var existingData = that.getOwnerComponent().getModel("TcodeModelMod").getProperty("/TcodeData");
					var uploadIndex = existingData.length;
					for (var i = 0; i <= excelData.length - 1; i++) {
						var oCon = excelData[i].Connector;
						var oTCode = excelData[i]['Transaction Code'];
						oTCode = oTCode.toUpperCase();
						if (oFullTcodes.map(function (o) {
							return o.CONNECTOR;
						}).indexOf(oCon) >= 0) {
							var indexTcode = oFullTcodes.map(function (o) {
								return o.CONNECTOR;
							}).indexOf(oCon);
							if (!oSelectedTcodes.some(person => person.CONNECTOR === oCon)) {
								oSelectedTcodes.push(oFullTcodes[indexTcode]);
								var oSlectedTcodeItems = that.getView().byId("tableMod1").getItems();
								for (var j = 0; j <= oSlectedTcodeItems.length - 1; j++) {
									if (that.getView().byId("tableMod1").getItems()[j].getCells()[j].getProperty("text") == oCon) {
										that.getView().byId("tableMod1").getItems()[j].setSelected(true);
									}
								}
							}
							if (!existingData.some(person => person.Connector === oCon && person.Tcode === oTCode)) {
								that.onTcodeChangeMod(e, oTCode, oCon, uploadIndex);
								var oo = {
									Connector: excelData[i]['Connector'],
									Tcode: excelData[i]['Transaction Code']
								};
								existingData.push(oo);
							}
						}
						that.getOwnerComponent().getModel("SeleSysLandInfoMod").setProperty("/sleSysLaData", oSelectedTcodes);
						uploadIndex++;
					}
					var excelData = excelData.map(e => ({
						Connector: e['Connector'],
						Tcode: e['Transaction Code']
					}));
					that.getOwnerComponent().getModel("TcodeModelMod").refresh(true);
					// Setting the data to the local model 
					that.localModel.setData({
						items: excelData
					});
					that.localModel.refresh(true);
				};
				reader.onerror = function (ex) {
					console.log(ex);
				};
				reader.readAsBinaryString(file);
			}
		},

		onUploadUserCre: function (e) {
			this._importUSerCre(e.getParameter("files") && e.getParameter("files")[0]);
		},

		_importUSerCre: function (file) {
			var that = this;
			var excelData = {};
			var selectedData = {};
			var excelDataFilter = [];
			if (file && window.FileReader) {
				var reader = new FileReader();
				reader.onload = function (e) {
					var data = e.target.result;
					var workbook = XLSX.read(data, {
						type: 'binary'
					});
					workbook.SheetNames.forEach(function (sheetName) {
						excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
					});
					var excelDataCount = excelData.length;
					var copyExcelData = [...excelData];
					var oSelectedTcodes = that.getOwnerComponent().getModel("SeleSysLandInfo").getProperty("/sleSysLaData");
					var oFullTcodes = that.getOwnerComponent().getModel("SysLandInfo").getProperty("/SysLaData");
					var existingData = that.getOwnerComponent().getModel("TcodeModel").getProperty("/TcodeData");
					var uploadIndex = existingData.length;
					for (var i = 0; i <= excelData.length - 1; i++) {
						var oCon = excelData[i].Connector;
						var oTCode = excelData[i]['Transaction Code'];
						oTCode = oTCode.toUpperCase();
						if (oFullTcodes.map(function (o) {
							return o.CONNECTOR;
						}).indexOf(oCon) >= 0) {
							var indexTcode = oFullTcodes.map(function (o) {
								return o.CONNECTOR;
							}).indexOf(oCon);
							if (!oSelectedTcodes.some(person => person.CONNECTOR === oCon)) {
								oSelectedTcodes.push(oFullTcodes[indexTcode]);
								var oSlectedTcodeItems = that.getView().byId("tableMod1").getItems();
								for (var j = 0; j <= oSlectedTcodeItems.length - 1; j++) {
									if (that.getView().byId("tableMod1").getItems()[j].getCells()[j].getProperty("text") == oCon) {
										that.getView().byId("tableMod1").getItems()[j].setSelected(true);
									}
								}
							}
							if (!existingData.some(person => person.Connector === oCon && person.Tcode === oTCode)) {
								that.onTcodeChangeMod(e, oTCode, oCon, uploadIndex);
								var oo = {
									Connector: excelData[i]['Connector'],
									Tcode: excelData[i]['Transaction Code']
								};
								existingData.push(oo);
							}
						}
						that.getOwnerComponent().getModel("SeleSysLandInfo").setProperty("/sleSysLaData", oSelectedTcodes);
						uploadIndex++;
					}
					var excelData = excelDataFilter.map(e => ({
						Connector: e['Connector'],
						Tcode: e['Transaction Code']
					}));
					that.getOwnerComponent().getModel("TcodeModel").refresh(true);
					// Setting the data to the local model 
					that.localModel.setData({
						items: excelData
					});
					that.localModel.refresh(true);
				};
				reader.onerror = function (ex) {
					console.log(ex);
				};
				reader.readAsBinaryString(file);
			}
		},
		onFileSelect: function (oEvent) {
			this.file = oEvent.getParameter("files")[0];
			sap.ui.getCore().byId("idfileUploader1").setPlaceholder("Please Choose");
		},
		onRemAttachUpload: function (e) {
			this._getRemAttachDialog().close();
			var AttTableModel = this.getOwnerComponent().getModel("RemAttInfoModel");
			var AttData = {
				tile: this.file.name,
				type: this.file.type,
				addedOn: new Date(),
				addedBy: oUserID,
				key: i + 1
			};
			AttTableModel.getData().AttInfoData.push(AttData);
			AttTableModel.refresh(true);
		},
		onAttachUpload: function (e) {
			this._oAttachDialog.close();
			var AttTableModel = this.getOwnerComponent().getModel("AttInfoModelMod");
			var AttData = {
				tile: this.file.name,
				type: this.file.type,
				addedOn: new Date(),
				addedBy: oUserID,
				key: i + 1
			};
			AttTableModel.getData().AttInfoData.push(AttData);
			AttTableModel.refresh(true);
			sap.ui.getCore().byId("idfileUploader1").setPlaceholder();
		},
		onUploadExcelNew: function () {
			var fU = this.getView().byId("idfileUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			// Create a File Reader object
			var reader = new FileReader();
			var t = this;
			reader.onload = function (e) {
				var strCSV = e.target.result;
				//var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
				var arrCSV = strCSV.split('\n');
				var noOfCols = 5;
				var data2 = [];
				//while (arrCSV.length > 0) {
				var obj = {};
				var cols;
				for (var i = 0; i < arrCSV.length - 1; i++) {
					//split by separator (,) and get the columns
					if (i != 0) {
						cols = arrCSV[i].split(',');
						data2[i] = {
							VBELN: cols[0],
							ERDAT: cols[1],
							VBTYP: cols[2],
							TRVOG: cols[3],
							AUART: cols[4],
						};
					}
				}
				var results = data2.filter(element => {
					if (
						typeof element === 'object' &&
						!Array.isArray(element) &&
						Object.keys(element).length === 0
					) {
						return false;
					} else {
						return true;
					}
				});
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(results);
				var oTable = t.byId("idTable");
				oTable.setModel(oModel);
			};
			reader.readAsBinaryString(file);
		},
		onUploadExcel: function (e) {
			var t = this;
			if (this.validateBeforeUpload() === false) {
				return
			}
			this._getDialog().close();
			var o = this.getView().byId("idTcodeMod");
			var a = sap.ui.getCore().byId("idfileUploader");
			var i = a.getValue();
			var s = a.getFocusDomRef();
			var r = s.files[0];
			var n = undefined;
			var l = new FileReader;
			var t = this;
			var d = typeof FileReader !== "undefined" && FileReader.prototype && FileReader.prototype.readAsBinaryString;
			l.onload = function (e) {
				var o = e.target.result;
				var a, i;
				var s = {
					type: d ? "binary" : "base64"
				};

				function r() {
					var e = window.XLSX.read(o, s);
					var a = t.to_json(e);
					var i = e.SheetNames;
					var r = a[i[0]];
					var n = [];
					for (var l = 0; l < r.length - 1; l++) {
						n[l] = r[l + 1]
					}
					var n = n.map(e => ({
						Connector: e[0],
						Tcode: e[1],
						TcodeDesc: e[2]
					}));
					var action = t._uploadAction;
					var modelName = "";
					if (action === "new") {
						modelName = "TcodeModel";
					} else {
						modelName = "TcodeModelMod";
					}
					t._validateTcodes(n, modelName);
				}
				r()
			};
			if (d) l.readAsBinaryString(r);
			else l.readAsArrayBuffer(r);
			a.clear()
		},
		to_json: function (e) {
			var t = false;
			if (t && e.SSF) window.XLSX.SSF.load_table(e.SSF);
			var o = {};
			e.SheetNames.forEach(function (t) {
				var a = window.XLSX.utils.sheet_to_json(e.Sheets[t], {
					header: 1
				});
				if (a.length > 0) o[t] = a
			});
			return o
		},
		createColumnConfig: function () {
			return [{
				label: "Transaction Code",
				property: "tCode",
				type: h.Number,
				scale: 0
			}, {
				label: "Transaction Description",
				property: "Firstname",
				width: "25"
			}, {
				label: "Connector",
				property: "Lastname",
				width: "25"
			}]
		},
		createColumnConfigRole: function () {
			return [{
				label: "System",
				property: "System",
				type: h.Number,
				scale: 0
			}, {
				label: "System Description",
				property: "sysDesc",
				width: "25"
			}, {
				label: "Tcode",
				property: "tCode",
				width: "25"
			}, {
				label: "Role",
				property: "role",
				width: "25"
			}, {
				label: "Description",
				property: "Desc",
				width: "25"
			}, {
				label: "Role Type",
				property: "roleType",
				width: "25"
			}]
		},
		onExportRole: function () {
			var e, t, o, a;
			e = this.createColumnConfigRole();
			t = [{
				System: "",
				sysDesc: "",
				tCode: "",
				role: "",
				Desc: "",
				roleType: ""
			}];
			o = {
				workbook: {
					columns: e
				},
				dataSource: t,
				fileName: "TransactionCode.xlsx"
			};
			a = new s(o);
			a.build().then(function () {
				r.show("Role Template export has finished")
			}).finally(a.destroy)
		},
		onExport: function () {
			var e, t, o, a;
			e = this.createColumnConfig();
			t = [{
				tCode: "",
				Firstname: "",
				Lastname: ""
			}];
			o = {
				workbook: {
					columns: e
				},
				dataSource: t,
				fileName: "TransactionCode.xlsx"
			};
			a = new s(o);
			a.build().then(function () {
				r.show("Spreadsheet export has finished")
			}).finally(a.destroy)
		},
		handleOpen: function (e) {
			var t = e.getSource();
			if (!this._actionSheet) {
				this._actionSheet = sap.ui.xmlfragment("com.new.prjt.znew_arm_prjt.fragment.ActionSheet", this);
				this.getView().addDependent(this._actionSheet)
			}
			this._actionSheet.openBy(t)
		},
		handleOpenRole: function (e) {
			var t = e.getSource();
			if (!this._actionSheetRole) {
				this._actionSheetRole = sap.ui.xmlfragment("com.new.prjt.znew_arm_prjt.fragment.ActionSheetRole", this);
				this.getView().addDependent(this._actionSheetRole)
			}
			this._actionSheetRole.openBy(t)
		},
		openAttachDialog: function (e) {
			this._getAttachDialog().open();
			sap.ui.getCore().byId("idfileUploader1").setButtonText("Please Choose");
			sap.ui.getCore().byId("idfileUploader1").setPlaceholder();
		},
		onAttachUploadCancel: function (e) {
			this._oAttachDialog.close()
		},

		openRemAttachDialog: function () {
			this._getRemAttachDialog().open()
		},
		onRemAttachUploadCancel: function (e) {
			this._getRemAttachDialog().close()
		},

		openDialog: function (oEvent) {
			this._getDialog().open();
			var action = oEvent.getSource().data("action");
			this._uploadAction = action;
		},
		onUploadCancel: function (e) {
			this._getDialog().close()
		},
		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.new.prjt.znew_arm_prjt.fragment.UploadDialog", this);
				this.getView().addDependent(this._oDialog)
			}
			return this._oDialog
		},
		getAttachDialog: function () {
			if (!this._oAttachDialog) {
				this._oAttachDialog = sap.ui.xmlfragment("com.new.prjt.znew_arm_prjt.fragment.AttachUploadDialog", this);
				this.getView().addDependent(this._oAttachDialog);
				sap.ui.getCore().byId("idfileUploader1").setPlaceholder();
			}
			var oPlace = "Please Choose";
			sap.ui.getCore().byId("idfileUploader1").setPlaceholder(oPlace);
			sap.ui.getCore().byId("idfileUploader1").setValue("");
			this._oAttachDialog.open();
		},
		_getRemAttachDialog: function () {
			if (!this._oRemAttachDialog) {
				this._oRemAttachDialog = sap.ui.xmlfragment("com.new.prjt.znew_arm_prjt.fragment.RemAttachUploadDialog", this);
				this.getView().addDependent(this._oRemAttachDialog)
			}
			return this._oRemAttachDialog;
		},
		fetchRecords: function (e) {
			console.log(this._data.Products)
		},
		addRowRole: function (e) {
			this._dataRole.items.push({
				System: "",
				sysDesc: "",
				tCode: "",
				role: "",
				Desc: "",
				roleType: ""
			});
			var t = this.getView().getModel("uploadRoleModel");
			t.refresh()
		},
		addRow: function (e) {
			var TcodeModel = this.getOwnerComponent().getModel("TcodeModel");
			var TcodObj = {
				"Tcode": "",
				"TcodeDesc": "",
				"Connector": "",
				"ACTION_ID": ""
			};
			var selectedSystems = this.getOwnerComponent().getModel("SeleSysLandInfo").getData();
			if (selectedSystems && selectedSystems.sleSysLaData && selectedSystems.sleSysLaData.length === 1) {
				TcodObj.Connector = selectedSystems.sleSysLaData[0].CONNECTOR;
			}
			TcodeModel.getData().TcodeData.push(TcodObj);
			TcodeModel.refresh(true);
			if (this._FlageOrgCheck === true) {
				this._FlageOrgCheckRef = 'X';
			}
		},
		addNewOrg: function (e) {
			var oCopyOrg = e.getSource().getBindingContext("OrgTableModel").getObject();
			var OrgModel = this.getOwnerComponent().getModel("OrgTableModel");
			var orgObj = {
				"Conn": oCopyOrg.Conn,
				"FromOrg": "",
				"OrgLevel": oCopyOrg.OrgLevel,
				"OrgVal": oCopyOrg.OrgVal,
				"Tcode": oCopyOrg.Tcode,
				"priority": oCopyOrg.priority
			};
			OrgModel.getData().OrgData.push(orgObj);
			OrgModel.refresh(true);
		},
		addNewOrgMod: function (e) {
			var oCopyOrg = e.getSource().getBindingContext("OrgTableModelMod").getObject();
			var OrgModel = this.getOwnerComponent().getModel("OrgTableModelMod");
			var orgObj = {
				"Conn": oCopyOrg.Conn,
				"FromOrg": "",
				"OrgLevel": oCopyOrg.OrgLevel,
				"OrgVal": oCopyOrg.OrgVal,
				"Tcode": oCopyOrg.Tcode,
				"priority": oCopyOrg.priority
			};
			OrgModel.getData().OrgData.push(orgObj);
			OrgModel.refresh(true);
		},
		removeNewOrg: function (r) {
			var removeOrgRow = r.getSource().getBindingContext("OrgTableModel").getObject();
			var oOrgDataFromTable = this.getOwnerComponent().getModel("OrgTableModel").getData().OrgData;
			for (var o = 0; o < oOrgDataFromTable.length; o++) {
				if (oOrgDataFromTable[o] == removeOrgRow) {
					oOrgDataFromTable.splice(o, 1);
					var a = this.getView().getModel("OrgTableModel");
					a.refresh();
					break
				}
			}
		},
		removeNewOrgMod: function (r) {
			var removeOrgRow = r.getSource().getBindingContext("OrgTableModelMod").getObject();
			var oOrgDataFromTable = this.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData;
			for (var o = 0; o < oOrgDataFromTable.length; o++) {
				if (oOrgDataFromTable[o] == removeOrgRow) {
					oOrgDataFromTable.splice(o, 1);
					var a = this.getView().getModel("OrgTableModelMod");
					a.refresh();
					break
				}
			}
		},
		addRowMod: function (e) {
			var TcodeModel = this.getOwnerComponent().getModel("TcodeModelMod");
			var TcodObj = {
				"Tcode": "",
				"TcodeDesc": "",
				"Connector": ""
			};
			var selectedSystems = this.getOwnerComponent().getModel("SeleSysLandInfoMod").getData();
			if (selectedSystems && selectedSystems.sleSysLaData && selectedSystems.sleSysLaData.length === 1) {
				TcodObj.Connector = selectedSystems.sleSysLaData[0].CONNECTOR;
			}
			TcodeModel.getData().TcodeData.push(TcodObj);
			TcodeModel.refresh(true);
			if (this._FlageOrgCheck === true) {
				this._FlageOrgCheckRef = 'X';
			}
		},
		deleteRowRole: function (e) {
			var t = e.getSource().getBindingContext("AttInfoModelMod").getObject();
			var oRoleDateFromTable = this.getOwnerComponent().getModel("AttInfoModelMod").getData().AttInfoData;
			for (var o = 0; o < oRoleDateFromTable.length; o++) {
				if (oRoleDateFromTable[o] == t) {
					oRoleDateFromTable.splice(o, 1);
					var a = this.getView().getModel("AttInfoModelMod");
					a.refresh();
					break
				}
			}
		},
		deleteRowRoleMod: function (e) {
			var t = e.getSource().getBindingContext("RoleInfoModelMod").getObject();
			var oRoleDateFromTable = this.getOwnerComponent().getModel("RoleInfoModelMod").getData().RolInfoData;
			for (var o = 0; o < oRoleDateFromTable.length; o++) {
				if (oRoleDateFromTable[o] == t) {
					oRoleDateFromTable.splice(o, 1);
					var a = this.getView().getModel("RoleInfoModelMod");
					a.refresh();
					break
				}
			}
		},
		deleteRow: function (e) {
			var t = e.getSource().getBindingContext("uploadTCodeModel").getObject();
			for (var o = 0; o < this._data.items.length; o++) {
				if (this._data.items[o] == t) {
					this._data.items.splice(o, 1);
					var a = this.getView().getModel("uploadTCodeModel");
					a.refresh();
					break
				}
			}
		},
		onUserTypeChng: function (oEvent) {
			var oUserID = this.getOwnerComponent().getModel("navModel").getData().oResult.user_id;
			if (oEvent == "Self") {
				var type = "self";
			} else {
				var type = oEvent.getParameter("selectedItem").getKey();
			}
			if (type === 'self') {
				this.byId("idComboUser1").setValue(oUserID);
				this.byId("idComboUser1").setEditable(false);
				this.onUserSelectRem(oUserID);
			} else if (type === 'others') {
				this._clearRemoveRequest();
				this.byId("idComboUser1").setEditable(true);
				this.byId("idComboUser1").setValue('');
				this.myOthers();
			} else {
				this._clearRemoveRequest();
				this.getView().byId("idComboUser1").setEditable(true);
				this.byId("idComboUser1").setValue('');
				this.myReportees();
			}
		},
		onUserChangeRem: function (oEvent) {
			var oUser = oEvent.getParameter("selectedItem").getText();
			this.onUserSelectRem(oUser);
		},

		onUserSelectRem: function (oUser) {
			this._clearRemoveRequest();
			this.byId("idComboUser1").setValue(oUser);
			var oUserID = oUser;
			var oModel1 = this.getView().getModel("grac");
			var oRemAccTable = this.byId("idRemAccTable");
			oModel1.read("/AccessInformationSet", {
				filters: [new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, oUserID)],
				success: function (data) {
					// Access Information
					var oAcc = {
						"system": data.results
					};
					var oAccessModel = new JSONModel(oAcc);
					oAccessModel.setData({
						accessData: data.results
					});
					oRemAccTable.setModel(oAccessModel);
				}.bind(this),
				error: function (err) { }
			})
			oModel1.read("/PersonnelSet(AD_ID='" + oUserID + "')", {
				success: function (data) {
					var oUserData = {
						"users": data
					};
					var oUserModel = new JSONModel(oUserData);
					this.getView().setModel(oUserModel, "UserData");
					this.getView().getModel("UserData").refresh(true);
					this.getView().byId("idRemFName").setValueState("None");
					this.getView().byId("idRemLName").setValueState("None");
					this.getView().byId("idRemEmpType").setValueState("None");
					this.getView().byId("idRemRepMana").setValueState("None");
					this.getView().byId("idRemPNumber").setValueState("None");
					this.getView().byId("idRemDept").setValueState("None");
					this.getView().byId("idRemMNumber").setValueState("None");
					this.getView().byId("idRemEmail").setValueState("None");
					this.getView().byId("idRemEmpId").setValueState("None");
					this.getView().byId("idRemVenNum").setValueState("None");
					if (data) {
						var oUserInfoModel = this.getOwnerComponent().getModel("userInfoRem");
						var data = {
							"DEPARTMENT": data.ZDEPTD,
							"EMAIL": data.EMAIL,
							"EMPTYPE": data.EMPTYPE,
							"FIRST_NAME": data.FIRST_NAME,
							"IDENTIFIER": data.IDENTIFIER,
							"LAST_NAME": data.LAST_NAME,
							"PHONE": data.PHONE,
							"USER_ACTION": data.USER_ACTION,
							"USER_ID": data.USER_ID,
							"ZEMPID": data.ZEMPID,
							"ZRMID": data.ZRMRMID,
						};
						oUserInfoModel.setData(data);
						oUserInfoModel.refresh(true);
						this.getView().byId("idNameRem").setText(data.FIRST_NAME + " " + data.LAST_NAME);
					}
				}.bind(this),
				error: function (evt) { }
			});
		},

		onSuerSelectFF: function (oEvent) {
			var oUserID = this.getOwnerComponent().getModel("navModel").getData().oResult.user_id;
			if (oEvent == "Self") {
				var type = "self";
			} else {
				var type = oEvent.getSource().getSelectedKey();
			}
			var oUserId = "";
			if (type === 'self') {
				var oUserID = this.getOwnerComponent().getModel("navModel").getData().oResult.user_id;
				this.getView().byId("idComboUser2FF").setEditable(false);
				this.getView().byId("idComboUser2FF").setSelectedKey("");
				this.byId("idComboUser2FF").setValue(oUserID);
				this.FFuser("", oUserID);
			} else if (type === "others") {
				this._clearFFRequest();
				this.getView().byId("idComboUser2FF").setSelectedKey("");
				this.getView().byId("idComboUser2FF").setEditable(true);
				this.byId("idComboUser2FF").setValue('');
				// this.onValHelpUSER();
				this.myOthers();
			} else if (type === "reportee") {
				this._clearFFRequest();
				this.getView().byId("idComboUser2FF").setEditable(true);
				this.byId("idComboUser2FF").setValue('');
				//	this.onValHelpUSER();
				this.myReportees();
			}
		},
		onRemAccTableChng: function (oEvent) {
			var data = oEvent.getParameters("listItem");
		},
		onRemAccTableItemPress: function (e) {
			var data = oEvent.getParameters("listItem");
		},
		onUserChange: function (userId, onSelf) {
			this._clearNewRequest();
			var that = this;
			var oUser = "";
			if (onSelf === true) {
				oUser = this.getOwnerComponent().getModel("navModel").getData().oResult.user_id;
			} else {
				oUser = userId;
				this.byId("idComboUser").setValue(userId);
			}
			var oUserFilters = new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, oUser);
			var oModel1 = this.getView().getModel("grac");
			var oTable1 = this.byId("table1");
			var oTable2 = this.byId("table2");
			// var comboUser = this.byId("idComboUser");
			oModel1.read("/PersonnelSet(AD_ID='" + oUser + "')", {
				// filters: [new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, oUser)],
				urlParameters: {
					"$expand": "SystemSet"
				},
				success: function (data) {
					//user details
					var oUserData = {
						"users": data
					};
					var oUserModel = new JSONModel(oUserData);
					this.getView().setModel(oUserModel, "UserData");
					// system landscape details
					for (var i = 0; i < data.SystemSet.results.length; i++) {
						data.SystemSet.results[i].FT = "AVL";
					}
					var oSystem = {
						"system": data.SystemSet.results
					};
					var oSystemModel = new JSONModel(oSystem);
					oSystemModel.setData({
						modelData: data.SystemSet.results
					});
					oTable1.setModel(oSystemModel);
					oTable2.setModel(oSystemModel);
					this.getView().byId("fanem").setValue(oUserData.users.FIRST_NAME);
					this.getView().byId("fanem").setValueState("None");
					this.getView().byId("lname").setValue(oUserData.users.LAST_NAME);
					this.getView().byId("lname").setValueState("None");
					this.getView().byId("idemptype").setSelectedKey(oUserData.users.EMPTYPE);
					this.getView().byId("idemptype").setValueState("None");
					this.getView().byId("managerID").setValue(oUserData.users.ZRMNAME);
					this.getView().byId("managerID").setValueState("None");
					this.getView().byId("idPNumber").setValue(oUserData.users.PHONE);
					this.getView().byId("idPNumber").setValueState("None");
					this.getView().byId("idDepart").setValue(oUserData.users.ZDEPTD);
					this.getView().byId("idDepart").setValueState("None");
					this.getView().byId("IDMOb").setValue(oUserData.users.PHONE);
					this.getView().byId("IDMOb").setValueState("None");
					this.getView().byId("idemail").setValue(oUserData.users.EMAIL);
					this.getView().byId("idemail").setValueState("None");
					this.getView().byId("idempid").setValue(oUserData.users.ZEMPID);
					this.getView().byId("idempid").setValueState("None");
					this.getView().byId("idvendor").setValue(oUserData.users.VENDORNAME);
					this.getView().byId("idvendor").setValueState("None");
					this.getView().byId("idName").setText(oUserData.users.FIRST_NAME + " " + oUserData.users.LAST_NAME);
					that._CheckUser = 'X';
					if (data) {
						var data = {
							"DEPARTMENT": data.ZDEPTD,
							"EMAIL": data.EMAIL,
							"EMPTYPE": data.EMPTYPE,
							"FIRST_NAME": data.FIRST_NAME,
							"IDENTIFIER": data.IDENTIFIER,
							"LAST_NAME": data.LAST_NAME,
							"PHONE": data.PHONE,
							"USER_ACTION": data.USER_ACTION,
							"USER_ID": data.USER_ID,
							"ZEMPID": data.ZEMPID,
							"ZRMID": data.ZRMRMID,
							"USERALIAS": data.USERALIAS,
							"VENDORNAME": data.VENDORNAME
						};
						var oUserInfoModel = new sap.ui.model.json.JSONModel(data);
						that.getView().setModel(oUserInfoModel, "userInfoNew");
						this.getView().byId("idReqRaisedFor").setText(oUser);
					}
				}.bind(this),
				error: function (evt) { }
			});
		},
		onNewAccRefreshBut: function () {
			var oViewnewUserSet = this.byId("newUSERTableReqSet");
			var oNewUserReqSet = this.byId("newUSERReqSet");
			var oModel = this.getView().getModel("grac");
			var filterme = [];
			filterme.push(new sap.ui.model.Filter("CREATED_BY", sap.ui.model.FilterOperator.EQ, oUserID));
			oModel.read("/NewUserRequestSet", {
				filters: filterme,
				success: function (d) {
					var oNewUser = new sap.ui.model.json.JSONModel({
						myItems: d.results
					});
					oNewUserReqSet.setCount(d.results.length);
					oViewnewUserSet.setModel(oNewUser);
				}.bind(this),
				error: function (evt) { }
			});
		},
		onRemAccRefreshBut: function () {
			var oViewRemoveUserSet = this.byId("newRemoveReqSet");
			var oRemoveReqSet = this.byId("newRemoveCReqSet");
			var oModel = this.getView().getModel("grac");
			var filterme = [];
			filterme.push(new sap.ui.model.Filter("CREATED_BY", sap.ui.model.FilterOperator.EQ, oUserID));
			oModel.read("/RemoveAccessRequestSet", {
				filters: filterme,
				success: function (d) {
					var oRemoveAccess = new sap.ui.model.json.JSONModel({
						myItems: d.results
					});
					oRemoveReqSet.setCount(d.results.length);
					oViewRemoveUserSet.setModel(oRemoveAccess);
				}.bind(this),
				error: function (evt) { }
			});
		},
		onNewFFRefreshBut: function () {
			var oViewFirefighterSet = this.byId("newFireReqSet");
			var oFireReqSet = this.byId("newFireCReqSet");
			var oModel = this.getView().getModel("grac");
			var filterme = [];
			filterme.push(new sap.ui.model.Filter("CREATED_BY", sap.ui.model.FilterOperator.EQ, oUserID));
			oModel.read("/FirefighterRequestSet", {
				filters: filterme,
				success: function (d) {
					var oFirefighterAccess = new sap.ui.model.json.JSONModel({
						myItems: d.results
					});
					oFireReqSet.setCount(d.results.length);
					oViewFirefighterSet.setModel(oFirefighterAccess);
				}.bind(this),
				error: function (evt) { }
			});
		},
		onBeforeRendering: function () {
			if (!this.getOwnerComponent().getModel("navModel").oData.oResult) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("");
				location.reload();
				//this.handelLogOff();
				return false;
			}
			this.onUserValidationForMyinbox();     //added by Suresh on 07-06-2024
			this.onUserValidationForFFAccess();   //added by Suresh on 07-06-2024
		},
		onUserValidationForFFAccess: function() {
			var oModel1 = this.getView().getModel("grac");
			var oUserID = this.getOwnerComponent().getModel("navModel").getData().oResult.user_id;

			var oFilterUserName = new sap.ui.model.Filter("Username", sap.ui.model.FilterOperator.EQ, oUserID);
			var that = this;
			oModel1.read("/approval_inbox_accessSet", {
				filters: [oFilterUserName],
				success: function (oData) {
					var bFlag = false;
					if (oData.results[0].FF_Access === "X") {
						bFlag = true;
					}
					that.getView().byId("toolPage").getSideContent().getItem().getItems()[2].getItems()[2].setEnabled(bFlag); //Added by Suresh on 28-11-2024

					that.hideBusyIndicator(3000);
				}.bind(this),
				error: function () {
					that.hideBusyIndicator();
				}
			});
		},
		onUserValidationForMyinbox: function () {
			//this.showBusyIndicator();
			var oViewTable = this.byId("myAccesSysTable");
			var oViewTablefirefighter = this.byId("idTablefireFighter");
			var oViewnewUserSet = this.byId("newUSERTableReqSet");
			var oViewRemoveUserSet = this.byId("newRemoveReqSet");
			var oViewFirefighterSet = this.byId("newFireReqSet");
			//var oModel = this.getView().getModel("myAccess");
			var oModel1 = this.getView().getModel("grac");
			var oUserID = this.getOwnerComponent().getModel("navModel").getData().oResult.user_id;
			//ids for Access Request
			var oNewUserReqSet = this.byId("newUSERReqSet");
			var oRemoveReqSet = this.byId("newRemoveCReqSet");
			var oFireReqSet = this.byId("newFireCReqSet");
			var oFilterUserName = new sap.ui.model.Filter("Username", sap.ui.model.FilterOperator.EQ, oUserID);
			var that = this;
			oModel1.read("/approval_inbox_accessSet", {
				filters: [oFilterUserName],
				success: function (oData) {
					var bFlag = false;
					if (oData.results[0].access === "X") {
						bFlag = true;
					}
					that.getView().byId("toolPage").getSideContent().getItem().getItems()[1].setEnabled(bFlag);
					that.hideBusyIndicator(3000);
				}.bind(this),
				error: function () {
					that.hideBusyIndicator();
				}
			});
			var oTable1 = this.byId("table1");
			var oTable2 = this.byId("table2");
		},
		onMessagesButtonPress: function (e) {
			var t = e.getSource();
			if (!this._messagePopover) {
				this._messagePopover = new g({
					items: {
						path: "message>/",
						template: new c({
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});
				t.addDependent(this._messagePopover)
			}
			this._messagePopover.toggle(t)
		},

		responsiveSystemButPress: function () {
			if (!this.dialog) {
				this.dialog = sap.ui.xmlfragment(this.getView().getId(), "com.new.prjt.znew_arm_prjt.fragment.f4_selection", this);
				this.getView().addDependent(this.dialog)
			}
			this.dialog.open()
		},
		onButClose: function () {
			this.dialog.close()
		},
		onResponsiveButtonPress: function (e) {
			var t = e.getSource();
			this.byId("actionSheet").openBy(t)
		},
		onCancel1: function (e) {
			// this.getView().getId("CreateProductWizard").destroySteps();	
			// this.byId("pageContainer").getPages()[3].getContent()[0].getItems()[1].discardProgress();
			var oWizard = this.byId("CreateProductWizard");
			var oFirstStep = oWizard.getSteps()[0];
			oWizard.discardProgress(oFirstStep);
			// scroll to top
			oWizard.goToStep(oFirstStep);
			// invalidate first step
			oFirstStep.setValidated(false);
			this.getView().byId("idNewButSysInfo").setVisible(true);
			this.getView().byId("idNewButTcodeInfo").setVisible(true);
			this.getView().byId("idNewOrgNext").setVisible(true);
			this.getView().byId("idNewRoleNext").setVisible(true);
			this.getView().byId("idNewRoleSubNext").setVisible(true);
		},
		onSU53Cancel: function (e) {
			var oWizard = this.byId("idAuth");
			var oFirstStep = oWizard.getSteps()[0];
			oWizard.discardProgress(oFirstStep);
			// scroll to top
			oWizard.goToStep(oFirstStep);
			// invalidate first step
			oFirstStep.setValidated(false);

			this.getView().byId("idButtonSU53Review").setVisible(true);
		},
		onCancelMod: function (e) {
			var oWizard = this.byId("CreateProductWizard11");
			var oFirstStep = oWizard.getSteps()[0];
			oWizard.discardProgress(oFirstStep);
			// scroll to top
			oWizard.goToStep(oFirstStep);
			// invalidate first step
			oFirstStep.setValidated(false);
			this.getView().byId("idNewButSysInfoMod").setVisible(true);
			this.getView().byId("idNewButTcodeInfoMod").setVisible(true);
			this.getView().byId("idNewOrgNextMod").setVisible(true);
			this.getView().byId("idNewRoleNextMod").setVisible(true);
			this.getView().byId("idNewRoleSubNextMod").setVisible(true);
		},
		onCancelRem: function (eve) {
			var oWizard = this.byId("CreateProductWizardId2");
			var oFirstStep = oWizard.getSteps()[0];
			oWizard.discardProgress(oFirstStep);
			// scroll to top
			oWizard.goToStep(oFirstStep);
			// invalidate first step
			oFirstStep.setValidated(false);
			this.getView().byId("idRemButAccInfo").setVisible(true);
			this.getView().byId("idRemButReq").setVisible(true);
		},
		onCancelFF: function (ev) {
			var oWizard = this.byId("CreateProductWizardId261");
			var oFirstStep = oWizard.getSteps()[0];
			oWizard.discardProgress(oFirstStep);
			// scroll to top
			oWizard.goToStep(oFirstStep);
			// invalidate first step
			oFirstStep.setValidated(false);
			this.getView().byId("idFFButSys").setVisible(true);
			this.getView().byId("idFFButGetFFID").setVisible(true);
			this.getView().byId("idFFButFFID").setVisible(true);
			this.getView().byId("idFFButReqSub").setVisible(true);
		},
		showWarningOnItemSelect: function (oEvent) {
			var that = this;
			var oItem = oEvent.getParameter("item");

			if (that._selectedReqKey === "myAccess") {
				that._selectedReqKey = oItem.getKey();
				that.getView().byId("idrootTitle").setText(oItem.getProperty("text"));
				that.onItemSelect(oItem);
				that.onSideNavButtonPress();
				if (that._prevSelect) {
					that._prevSelect.$().css('background-color', '');
				}
				oItem.$().css('background-color', '#BD3861 !important');
				that._prevSelect = oItem;
				return false;
			}

			that._selectedReqKey = oItem.getKey();
			if (this._selectedReqKey === "myAccess" || this._selectedReqKey === "newModifyReqstID" || this._selectedReqKey === "3rdPartyID" || this._selectedReqKey === "ModifyReqstID" ||
				this._selectedReqKey ===
				"removeAccesID" || this._selectedReqKey === "fireFighterID1" || this._selectedReqKey === "appInbox") {
				sap.m.MessageBox.warning("All the selections will be removed. Are you sure?", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === "YES") {
							that._selectedReqKey = oItem.getKey();
							that.getView().byId("idrootTitle").setText(oItem.getProperty("text"));
							that.onItemSelect(oItem);
							that.onSideNavButtonPress();
							if (that._prevSelect) {
								that._prevSelect.$().css('background-color', '');
							}
							oItem.$().css('background-color', '#BD3861 !important');
							that._prevSelect = oItem;
						} else {
							that.getView().getContent()[0].getSideContent().setSelectedKey(that._selectedReqKey);
							return false;
						}
					}
				});
			} else {
				that._selectedReqKey = oItem.getKey();
				that.onItemSelect(oItem);
			}
		},
		onItemSelect: function (oItem) {
			var t = oItem;
			var key = t.getKey();
			this.byId("pageContainer").to(this.getView().createId(key));
			// if (key === "3rdparty") {
			// 	this.byId("pageContainer").to(this.getView().createId("3rdPartyID"));
			// 	this.getView().getModel("3rdparty").setProperty("/Is3rdParty", true);
			// 	this.getView().byId("cbBusinessProcess").setSelectedItemId("");
			// } else {

			// 	this.getView().getModel("3rdparty").setProperty("/Is3rdParty", false);
			// 	this.getView().byId("cbBusinessProcess").setSelectedItemId("");
			// }
			var aElementID = [];
			switch (oItem.getKey()) {
				case "myAccess":
					sap.ui.getCore().getEventBus().publish(
						"myAccess",
						"CallmyAccess",
						"is called from function of the second controller."
					);
					//this._onMyAccessPress();
					//this.getView().byId("idrootTitle").setText("My Access");
					break;
				//case "newModifyReqstID":
				case "3rdPartyID": {
					sap.ui.getCore().getEventBus().publish(
						"thirdParty",
						"SomeEvent",
						"is called from function of the second controller."
					);
					// this.byId("req_for").setSelectedKey("");
					// if (oItem.getText() === "User Id Creation - Adani") {
					// 	var ExistingUserModel = new JSONModel();
					// 	var oExistingUser = [];
					// 	oExistingUser.editable = false;
					// 	ExistingUserModel.setData(oExistingUser);
					// 	this.getView().setModel(ExistingUserModel, "ExistingUser");
					// 	this._clearNewRequest();
					// 	this.onSelectRequest("Self");
					// 	this.byId("chbExistingUser").setVisible(false);
					// 	this.byId("req_for").setSelectedKey("mpt");
					// 	this.byId("labelContractCompany").setVisible(false);
					// 	this.byId("cbContractCompany").setVisible(false);
					// 	this.byId("idComboUser").setEnabled(true);
					// 	this.getView().getModel("EmployeeType").setProperty("/", [{
					// 		key: "001",
					// 		text: "Adani"
					// 	}]);
					// 	this.getView().getModel("RequestType").setProperty("/", [{
					// 		key: "Self",
					// 		text: "Self"
					// 	}, {
					// 		key: "Other",
					// 		text: "Other User"
					// 	}]);
					// } else {
					// 	this.byId("chbExistingUser").setVisible(true);
					// 	//this.onSelectRequest("Self");
					// 	if (!this.getView().byId("chbExistingUser").getSelected()) {
					// 		var ExistingUserModel = new JSONModel();
					// 		var oExistingUser = [];
					// 		oExistingUser.editable = true;
					// 		ExistingUserModel.setData(oExistingUser);
					// 		this.getView().setModel(ExistingUserModel, "ExistingUser");
					// 	}
					// 	this.byId("labelContractCompany").setVisible(true);
					// 	this.byId("cbContractCompany").setVisible(true);
					// 	this.byId("idComboUser").setEnabled(false);
					// 	this.getView().getModel("EmployeeType").setProperty("/", [{
					// 		key: "002",
					// 		text: "3rd Party User"
					// 	}]);
					// 	this.getView().getModel("RequestType").setProperty("/", [{
					// 		key: "Other",
					// 		text: "Other User"
					// 	}]);
					// 	this._clearNewRequest();
					// 	this.getView().getModel("3rdparty").setProperty("/Is3rdParty", true);
					// 	this.byId("idNew3rdPary").setText("3rd Party User Details");
					// }
					// this.byId("cbContractCompany").setSelectedKey("");
					// this.byId("chbExistingUser").setSelected(false);
					break;
				}
				case "newModifyReqstID": {
					sap.ui.getCore().getEventBus().publish(
						"UserIDAdani",
						"SomeEvent",
						"is called from function of the second controller."
					);
					break;
				}
				case "ModifyReqstID": {
					sap.ui.getCore().getEventBus().publish(
						"modifyRequest",
						"SomeEvent",
						"is called from function of the second controller."
					);
					break;
				}
				case "removeAccesID": {
					sap.ui.getCore().getEventBus().publish(
						"removeAccess",
						"SomeEvent",
						"is called from function of the second controller."
					);
					break;
				}
				case "fireFighterID1": {
					sap.ui.getCore().getEventBus().publish(
						"FFAccess",
						"SomeEvent",
						"is called from function of the second controller."
					);

					break;
				}
				case "appInbox": {
					this.onPressApprovalInboxP();
					sap.m.MessageBox.information("Work Inbox opened in a new window");
					sap.ui.getCore().getEventBus().publish(
						"appInbox",
						"InboxEvent",
						"is called from function of the second controller."
					);

					break;
				}
			}
			var oTable1 = this.byId("DragTableFireFighter");
			var oTable2 = this.byId("DragTableFireFighterID");
			var oModel = this.getView().getModel("grac");
			var name = this.getView().createId(t.getKey());
			if (this.getView().createId(t.getKey()) === "__xmlview4--Auth") {
				sap.ui.core.BusyIndicator.show(300);
				var authTab = this.byId("authTab");
				oModel.read("/su53Set", {
					filters: [new sap.ui.model.Filter("BNAME", sap.ui.model.FilterOperator.EQ, oUserID)],
					success: function (data) {
						var oDataResults = {
							"userDatails": data
						};
						var oModelAuth = new sap.ui.model.json.JSONModel({
							myItems: data.results
						});
						authTab.setModel(oModelAuth);
						sap.ui.core.BusyIndicator.hide();
					}.bind(this),
					error: function (evt) {
						sap.ui.core.BusyIndicator.hide();
					}
				});
			}
			if (this.getView().createId(t.getKey()) === "__xmlview4--appInbox") {
				var newValue = 0;
				var approverInboxTable = this.byId("approverInboxTable");
				oModel.read("/ApprovalInboxCountSet", {
					filters: [new sap.ui.model.Filter("ApproverUser", sap.ui.model.FilterOperator.EQ, oUserID)],
					success: function (data) {
						var oDataResults = {
							"userDatails": data
						};
						for (var i = 0; i < data.results.length; i++) {
							if (data.results[i].COUNT === "NaN") {
								data.results[i].COUNT = "NA";
							}
							if (data.results[i].REQTYPE === "001") {
								newValue = newValue + data.results[i].COUNT;
							} else if (data.results[i].REQTYPE === "002") {
								newValue = newValue + data.results[i].COUNT;
							} else if (data.results[i].REQTYPE === "006") {
								this.getView().byId("idFfidValue").setValue(data.results[i].COUNT);
							} else if (data.results[i].REQTYPE === "003") { } else if (data.results[i].REQTYPE === "005") {
								this.getView().byId("idUnlockValue").setValue(data.results[i].COUNT);
							} else { }
						}
						if (newValue === "NaN") {
							newValue = "NA";
						}
						this.getView().byId("idNewValue").setValue(newValue);
					}.bind(this),
					error: function (evt) { }
				});
				oModel.read("/ApprovalInboxSet", {
					filters: [new sap.ui.model.Filter("ApproverUser", sap.ui.model.FilterOperator.EQ, oUserID)],
					success: function (data) {
						var oDataResults = {
							"userDatails": data
						};
						var oModel = new sap.ui.model.json.JSONModel({
							myItems: data.results
						});
						approverInboxTable.setModel(oModel);
					}.bind(this),
					error: function (evt) { }
				});
			}
		},
		_clearNewRequest: function () {
			var aElementID = ["idNewText", "fanem", "lname", "idemptype", "managerID", "idPNumber", "idDepart", "IDMOb", "idemail", "idempid",
				"idvendor",
			];
			this.getView().byId("table1").removeSelections();
			this.getView().byId("table2").removeSelections();
			this.getView().byId("idTcode").removeSelections();
			this.getView().byId("idTableOrg").removeSelections();
			this.byId("idComboUser").setValue("");
			this.byId("idName").setText("");
			this.byId("idNewText").setValue("");
			this.getView().byId("idemptype").setSelectedKey("");
			aElementID.forEach(function (id) {
				this.getView().byId(id).setValue("");
				this.getView().byId(id).setValueState("None");
			}.bind(this));
			this.byId("CreateProductWizard").previousStep();
			this.byId("CreateProductWizard").previousStep();
			this.byId("CreateProductWizard").previousStep();
			this.byId("CreateProductWizard").previousStep();
			this.byId("CreateProductWizard").previousStep();
			this.byId("idNewButSysInfo").setVisible(true);
			this.byId("idAlias").setVisible(false);
			this.byId("idempid").setVisible(false);
			this.byId("idvendor").setVisible(false);
			this.byId("idNew3rdPary").setText("");
		},
		_clearModifyRequest: function () {
			var aElementID = ["idModifyText", "fanemMod", "lnameMod", "idemptypeMod", "managerIDMod", "idPNumberMod", "idDepartMod", "IDMObMod",
				"idemailMod", "idempidMod",
				"idvendorMod"
			];
			this.byId("idComboUserMod").setValue("");
			this.byId("idNameMod").setText("");
			this.byId("idModifyText").setValue("");
			this.byId("idemptypeMod").setSelectedKey("");
			this.byId("cbBusinessProcessMod").setSelectedKey("");
			this.getView().byId("tableMod1").removeSelections();
			this.getView().byId("table2Mod").removeSelections();
			this.getView().byId("idTcodeMod").removeSelections();
			this.getView().byId("tblExcelDatfa134tg").removeSelections();
			aElementID.forEach(function (id) {
				this.getView().byId(id).setValue("");
				this.getView().byId(id).setValueState("None");
			}.bind(this));
			this.byId("CreateProductWizard11").previousStep();
			this.byId("CreateProductWizard11").previousStep();
			this.byId("CreateProductWizard11").previousStep();
			this.byId("CreateProductWizard11").previousStep();
			this.byId("CreateProductWizard11").previousStep();
			this.byId("idNewButSysInfoMod").setVisible(true);
			this.getView().byId("idModify3rdPary").setText("");
			this.getView().byId("idempidMod").setVisible(false);
			this.getView().byId("idvendorMod").setVisible(false);
		},
		_clearRemoveRequest: function () {
			var aElementID = ["idRemText", "idRemFName", "idRemLName", "idRemRepMana", "idRemPNumber", "idRemDept",
				"idRemMNumber",
				"idRemEmail", "idRemEmpId",
				"idRemVenNum"
			];
			this.getView().byId("idRemAccTable").removeSelections();
			this.getView().byId("idRemAccSelTable").removeSelections();
			this.byId("idComboUser1").setValue("");
			this.byId("idNameRem").setText("");
			this.byId("idRemText").setValue("");
			this.getView().byId("idRemEmpType").setSelectedKey("");
			aElementID.forEach(function (id) {
				this.getView().byId(id).setValue("");
				this.getView().byId(id).setValueState("None");
			}.bind(this));
			this.byId("CreateProductWizardId2").previousStep();
			this.byId("CreateProductWizardId2").previousStep();
			this.byId("CreateProductWizardId2").previousStep();
			this.byId("CreateProductWizardId2").previousStep();
			this.byId("CreateProductWizardId2").previousStep();
			this.byId("idRemButAccInfo").setVisible(true);
			this.byId("idRemove3rdPary").setText("");
			this.byId("idRemEmpId").setVisible(false);
			this.byId("idRemVenNum").setVisible(false);
		},
		_clearFFRequest: function () {
			var aElementID = ["idFfidText", "idFfFName", "idFfLName", "idFfEmpType", "idFfRepMana", "idFfPNumber", "idFfDept", "idFfMNumber",
				"idFfEmail", "idFfEmpId",
				"idFfVenNum"
			];
			this.getView().byId("table1FF").removeSelections();
			this.getView().byId("table2FF").removeSelections();
			this.getView().byId("DragTableFireFighterID").removeSelections();
			this.getView().byId("DropTableFireFighterID").removeSelections();
			this.getView().byId("idFFValidTable").removeSelections();
			this.getView().byId("idFfidSelTable").removeSelections();
			this.byId("idComboUser2FF").setValue("");
			this.byId("idNameFF").setText("");
			this.byId("idFfidText").setValue("");
			this.byId("idFfEmpType").setSelectedKey("");
			this.getView().getModel("FireFiIds").setProperty("/FireFiId", []);
			aElementID.forEach(function (id) {
				this.getView().byId(id).setValue("");
				this.getView().byId(id).setValueState("None");
			}.bind(this));
			this.byId("CreateProductWizardId261").previousStep();
			this.byId("CreateProductWizardId261").previousStep();
			this.byId("CreateProductWizardId261").previousStep();
			this.byId("CreateProductWizardId261").previousStep();
			this.byId("CreateProductWizardId261").previousStep();
			this.byId("idFFButSys").setVisible(true);
			this.byId("idFF3rdPary").setText("");
			this.byId("idFfEmpId").setVisible(false);
			this.byId("idFfVenNum").setVisible(false);
		},
		handleUserNamePress: function (e) {
			var t = new o({
				showHeader: false,
				placement: m.Bottom,
				content: [new a({
					text: "Details",
					type: f.Transparent
				}), new a({
					text: "Logoff",
					type: f.Transparent
				})]
			}).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");
			t.openBy(e.getSource())
		},
		onSideNavButtonPress: function () {
			var e = this.byId("toolPage");
			var t = e.getSideExpanded();
			this._setToggleButtonTooltip(t);
			e.setSideExpanded(!e.getSideExpanded())
		},
		_setToggleButtonTooltip: function (e) {
			var t = this.byId("sideNavigationToggleButton");
			if (e) {
				t.setTooltip("Large Size Navigation")
			} else {
				t.setTooltip("Small Size Navigation")
			}
		},
		myOthers: function () {
			this.showBusyIndicator();
			var oModel1 = this.getView().getModel("grac");
			var comboUser = this.byId("idComboUser");
			var comboUser1 = this.byId("idComboUser1");
			var comboUserMod = this.byId("idComboUserMod");
			var comboUserFF = this.byId("idComboUser2FF");
			var oModel2 = new sap.ui.model.json.JSONModel();
			var data = [];
			oModel2.setData(data);
			comboUser.setModel(oModel2);
			comboUser1.setModel(oModel2);
			comboUserMod.setModel(oModel2);
			comboUserFF.setModel(oModel2);
			if (this._selectedReqKey !== "3rdparty") {
				oModel1.read("/PersonnelSet", {
					success: function (data) {
						sap.ui.core.BusyIndicator.hide();
						var oUsers = {
							"users": data
						};
						var oModel1 = new sap.ui.model.json.JSONModel({
							myItems: data.results
						});
						oModel1.setSizeLimit(100000);
						comboUser.setModel(oModel1);
						comboUser1.setModel(oModel1);
						comboUserMod.setModel(oModel1);
						comboUserFF.setModel(oModel1);
						this.hideBusyIndicator();
					}.bind(this),
					error: function (evt) {
						sap.ui.core.BusyIndicator.hide();
					}
				});
			} else {
				sap.ui.core.BusyIndicator.hide();
				if (!this.getView().byId("chbExistingUser").getSelected()) {
					this.getView().getModel("ExistingUser").setProperty("/editable", true);
				} else {
					this.getView().getModel("ExistingUser").setProperty("/editable", false);
				}
				this._loadUsersFor3rdParty();
				this.getView().byId("fanem").setValue("");
				this.getView().byId("idAlias").setValue("");
				this.getView().byId("lname").setValue("");
				this.getView().byId("idemptype").setValue("");
				this.getView().byId("managerID").setValue("");
				this.getView().byId("idPNumber").setValue("");
				this.getView().byId("idDepart").setValue("");
				this.getView().byId("IDMOb").setValue("");
				this.getView().byId("idemail").setValue("");
				this.getView().byId("idempid").setValue("");
				this.getView().byId("idvendor").setValue("");
			}
		},

		onChnageConnectorMod: function (oEvent) {
			var that = this;
			var path = parseInt(oEvent.getSource().getParent().getBindingContextPath().match(/\d/g).join('',));
			that.TcodeModel = that.getOwnerComponent().getModel("TcodeModelMod");
			that.TcodeModel.getData().TcodeData[path].Connector = oEvent.getSource().getSelectedItem().getText();
			that.TcodeModel.refresh(true);
		},
		onChnageConnector: function (oEvent) {
			var that = this;
			var path = parseInt(oEvent.getSource().getParent().getBindingContextPath().match(/\d/g).join('',));
			that.TcodeModel = that.getOwnerComponent().getModel("TcodeModel");
			that.TcodeModel.getData().TcodeData[path].Connector = oEvent.getSource().getSelectedItem().getText();
			that.TcodeModel.refresh(true);
		},

		onTcodeChange: function (oEvent, onUploadTcode, onUploadConn, uploadIndex) {
			var that = this;
			that.TcodeModel = that.getOwnerComponent().getModel("TcodeModel");
			var oModelCom = that.getView().getModel('grac');
			var oFilter = [];
			if (onUploadTcode == undefined) {
				var path = parseInt(oEvent.getSource().getParent().getBindingContextPath().match(/\d/g).join('',));
				var oFilterTcode = oEvent.getSource().getValue().toUpperCase();
				var oFilterConnector = that.TcodeModel.getData().TcodeData[path].Connector;
				var aTcodeData = that.getOwnerComponent().getModel("TcodeModel").getData().TcodeData;
				var aTmp = aTcodeData.filter(function (oRecord) {
					return (oFilterConnector === oRecord.Connector && oFilterTcode === oRecord.Tcode && oFilterTcode !== "");
				});
				if (oFilterTcode) {
					oFilter.push(new sap.ui.model.Filter("ACTION", sap.ui.model.FilterOperator.EQ, oFilterTcode));
				}
				if (oFilterConnector) {
					oFilter.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, oFilterConnector));
				}
			} else {
				var oFilterTcode = onUploadTcode.toUpperCase();
				if (oFilterTcode) {
					oFilter.push(new sap.ui.model.Filter("ACTION", sap.ui.model.FilterOperator.EQ, onUploadTcode));
				}
				if (onUploadConn) {
					oFilter.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, onUploadConn));
				}
				var path = uploadIndex;
			}
			oModelCom.read("/TCodeInfoSet", {
				filters: oFilter,
				success: function (data) {
					if (data.results.length === 0) {
						sap.m.MessageBox.error('Please Enter Correct Tcode');
						return;
					} else {
						var newData = data.results[0];
						that.TcodeModel.getData().TcodeData[path].Tcode = newData.ACTION;
						that.TcodeModel.getData().TcodeData[path].TcodeDesc = newData.DESCN;
						that.TcodeModel.getData().TcodeData[path].Connector = newData.CONNECTOR;
						that.TcodeModel.getData().TcodeData[path].ACTION_ID = newData.ACTION_ID;
						that.TcodeModel.refresh(true);
					}
				},
				error: function (event) {
					sap.m.MessageBox.error('Please Enter Correct Tcode');
					return;
				}
			});
		},

		_TCodeexists: function (aTmp, Tcode) {
			return aTmp.some(function (el) {
				return el.Tcode === Tcode;
			});
		},
		onTcodeChangeMod: function (oEvent, onUploadTcode, onUploadConn, uploadIndex) {
			var that = this;
			that.TcodeModel = that.getOwnerComponent().getModel("TcodeModelMod");
			var oModelCom = that.getView().getModel('grac');
			var aTcodeData = that.TcodeModel.getData().TcodeData;
			var oFilter = [];
			if (onUploadTcode == undefined) {
				var path = parseInt(oEvent.getSource().getParent().getBindingContextPath().match(/\d/g).join('',));
				var oFilterTcode = oEvent.getSource().getValue().toUpperCase();
				var oFilterConnector = that.TcodeModel.getData().TcodeData[path].Connector;
				var aTmp = aTcodeData.filter(function (oRecord) {
					return (oFilterConnector === oRecord.Connector && oFilterTcode === oRecord.Tcode && oFilterTcode !== "");
				});
				if (oFilterTcode) {
					oFilter.push(new sap.ui.model.Filter("ACTION", sap.ui.model.FilterOperator.EQ, oFilterTcode));
				}
				if (oFilterConnector) {
					oFilter.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, oFilterConnector));
				}
			} else {
				var oFilterTcode = onUploadTcode.toUpperCase();
				if (oFilterTcode) {
					oFilter.push(new sap.ui.model.Filter("ACTION", sap.ui.model.FilterOperator.EQ, onUploadTcode));
				}
				if (onUploadConn) {
					oFilter.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, onUploadConn));
				}
				var path = uploadIndex;
			}
			oModelCom.read("/TCodeInfoSet", {
				filters: oFilter,
				success: function (data) {
					if (data.results.length === 0) {
						sap.m.MessageBox.error('Please Enter Correct Tcode');
						return;
					} else {
						var newData = data.results[0];
						that.TcodeModel.getData().TcodeData[path].Tcode = newData.ACTION;
						that.TcodeModel.getData().TcodeData[path].TcodeDesc = newData.DESCN;
						that.TcodeModel.getData().TcodeData[path].Connector = newData.CONNECTOR;
						that.TcodeModel.refresh(true);
					}
				},
				error: function (event) {
					sap.m.MessageBox.error('Please Enter Correct Tcode');
					return;
				}
			});
		},
		onRoleRefresh: function () {
			sap.ui.core.BusyIndicator.show(300);
			var TcodeInfo = [];
			this.getView().byId("tableRole").getModel("RoleInfoModel").setProperty("/RolInfoData", []);
			var OrgTableModel = this.getOwnerComponent().getModel("OrgTableModel").getData().OrgData;
			var TcodeModel = this.getOwnerComponent().getModel("TcodeModel").getData().TcodeData;
			if (TcodeModel.length !== 0) {
				TcodeModel.forEach((item, index) => {
					var tdata = {
						"TCODE": TcodeModel[index].Tcode,
						"CONNECTOR": TcodeModel[index].Connector
					};
					TcodeInfo.push(tdata);
				});
			}
			if (OrgTableModel.length !== 0) {
				OrgTableModel.forEach((item, index) => {
					var orgdata = {
						"TCODE": OrgTableModel[index].Tcode,
						"PRIORITY": "" + OrgTableModel[index].priority + "",
						"ORG_LEVEL": "$" + OrgTableModel[index].OrgLevel + "",
						"FROM_VALUE": OrgTableModel[index].FromOrg,
						"TO_VAUE": OrgTableModel[index].ToOrg,
						"CONNECTOR": OrgTableModel[index].Conn
					};
					TcodeInfo.push(orgdata);
				});
				var oPayload = {
					"USER_ACTION": "ROLE",
					"NARRoleInformationSet": TcodeInfo
				};
				var RoleTableModel = this.getOwnerComponent().getModel("RoleInfoModel");
				var oModel = this.getView().getModel('grac');
				var params = [];
				var GUID;
				params["X-CSRF-Token"] = oModel.getSecurityToken();
				params["X-CSRF-Token"] = csrf;
				params["Content-Type"] = "application/json";
				oModel.create('/NARUserInformationSet', oPayload, {
					headers: params,
					success: function (data) {
						GUID = data.GUID;
						//get Org values from GUID
						var oFilter = [];
						if (GUID) {
							oFilter.push(new sap.ui.model.Filter("GUID", sap.ui.model.FilterOperator.EQ, GUID));
							oModel.read("/NARRoleInformationSet", {
								async: true,
								filters: oFilter,
								success: function (data1) {
									if (data1.results.length === 0) {
										sap.m.MessageBox.error('Roles are not available');
										return;
									} else {
										for (var i = 0; i < data1.results.length; i++) {
											var RolData = {
												System: data1.results[i].CONNECTOR,
												sysDesc: data1.results[i].RFCDOC1,
												tCode: data1.results[i].TCODE,
												role: data1.results[i].ROLE_NAME,
												Desc: data1.results[i].ROLE_DESCN,
												roleType: data1.results[i].ROLE_TYPE,
												key: i + 1
											};
											RoleTableModel.getData().RolInfoData.push(RolData);
											RoleTableModel.refresh(true);
										}
									}
									sap.ui.core.BusyIndicator.hide();
								},
								error: function (event) {
									sap.ui.core.BusyIndicator.hide();
									sap.m.MessageBox.error('Roles are not found for the GUID');
									return;
								}
							});
						}
					},
					error: function (data) {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageBox.error("No Valid GUID Found");
					}
				});
			} else {
				sap.ui.core.BusyIndicator.hide();
			}
		},
		onRoleRefreshMod: function () {
			sap.ui.core.BusyIndicator.show(300);
			var TcodeInfo = [];
			var OrgTableModel = this.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData;
			//clear the data from the table first
			this.getView().byId("idRoleTableMod").getModel("RoleInfoModelMod").setProperty("/RolInfoData", []);
			var TcodeModel = this.getOwnerComponent().getModel("TcodeModelMod").getData().TcodeData;
			if (TcodeModel.length !== 0) {
				TcodeModel.forEach((item, index) => {
					var tdata = {
						"TCODE": TcodeModel[index].Tcode,
						"CONNECTOR": TcodeModel[index].Connector
					};
					TcodeInfo.push(tdata);
				});
			}
			if (OrgTableModel.length !== 0) {
				OrgTableModel.forEach((item, index) => {
					var orgdata = {
						"TCODE": OrgTableModel[index].Tcode,
						"PRIORITY": "" + OrgTableModel[index].priority + "",
						"ORG_LEVEL": "$" + OrgTableModel[index].OrgLevel + "",
						"FROM_VALUE": OrgTableModel[index].FromOrg,
						"TO_VAUE": OrgTableModel[index].ToOrg,
						"CONNECTOR": OrgTableModel[index].Conn
					};
					TcodeInfo.push(orgdata);
				});
				var oPayload = {
					"USER_ACTION": "ROLE",
					"NARRoleInformationSet": TcodeInfo
				};
				var RoleTableModel = this.getOwnerComponent().getModel("RoleInfoModelMod");
				var oModel = this.getView().getModel('grac');
				var params = [];
				var GUID;
				params["X-CSRF-Token"] = oModel.getSecurityToken();
				params["X-CSRF-Token"] = csrf;
				params["Content-Type"] = "application/json";
				oModel.create('/NARUserInformationSet', oPayload, {
					headers: params,
					success: function (data) {
						GUID = data.GUID;
						//get Org values from GUID
						var oFilter = [];
						if (GUID) {
							oFilter.push(new sap.ui.model.Filter("GUID", sap.ui.model.FilterOperator.EQ, GUID));
							oModel.read("/NARRoleInformationSet", {
								async: true,
								filters: oFilter,
								success: function (data1) {
									if (data1.results.length === 0) {
										sap.m.MessageBox.error('Roles are not available');
										return;
									} else {
										for (var i = 0; i < data1.results.length; i++) {
											var RolData = {
												System: data1.results[i].CONNECTOR,
												sysDesc: data1.results[i].RFCDOC1,
												tCode: data1.results[i].TCODE,
												role: data1.results[i].ROLE_NAME,
												Desc: data1.results[i].ROLE_DESCN,
												roleType: data1.results[i].ROLE_TYPE,
												key: i + 1
											};
											RoleTableModel.getData().RolInfoData.push(RolData);
											RoleTableModel.refresh(true);
										}
									}
									sap.ui.core.BusyIndicator.hide();
								},
								error: function (event) {
									sap.ui.core.BusyIndicator.hide();
									sap.m.MessageBox.error('Roles are not found for the GUID');
									return;
								}
							});
						}
					},
					error: function (data) {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageBox.error("No Valid GUID Found");
					}
				});
			}
		},
		onSearchFromVal: function (oEvent) {

			var oValue = oEvent.getParameter("value") || "";
			var oBinding = oEvent.getParameter("itemsBinding");
			if(oValue.indexOf("*")>-1){
				var oValueArray  = oValue.split("*");
				var filter1 =[];
				oValueArray.forEach(function (oItem) {
					if(oItem !==""){
					filter1.push(new sap.ui.model.Filter("CUR_VALUE", sap.ui.model.FilterOperator.Contains, oItem));
					}	
				});
				oBinding.filter(filter1);
			}else{
			var filter1 = new sap.ui.model.Filter("CUR_VALUE", sap.ui.model.FilterOperator.Contains, oValue);
			oBinding.filter([filter1]);
			}

		},
		onValueHelpDialogClose: function (e) {
			var that = this;
			// if (e.getParameter("selectedItem")) {
			// 	var oSelValue = e.getParameter("selectedItem").mProperties.title;
			// 	oObject.FromOrg = oSelValue;
			// }
			var aSelectedItems = e.getParameter("selectedContexts");
			if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
					oObject.FromOrg = oObject.FromOrg.length > 0 ? oObject.FromOrg + "," + oItem.getObject().CUR_VALUE : oItem.getObject().CUR_VALUE;
				});
			}
			this.getOwnerComponent().getModel(oModelName).refresh(true);

		},
		onRuleValueHelpDialogClose: function (e) {
			if (e.getParameter("selectedItem")) {
				var oSelValue = e.getParameter("selectedItem").mProperties.title;
				this.getView().byId("idRuleSet").setValue(oSelValue);
				this.getView().byId("idRuleSet").setValueState("None");
			}
		},
		onOrgFromAuth: function (eve) {
			sap.ui.core.BusyIndicator.show(300);
			oObject = eve.getSource().getBindingContext("AuthOrgTableModel").getObject();
			var oPath = eve.getSource().getBindingContext("AuthOrgTableModel").getPath();
			var num = oPath.split("/");
			var inum = parseInt(num[2] + "<br>");
			var oTable = this.getOwnerComponent().getModel("AuthOrgTableModel").getData().OrgData;
			oModelName = "AuthOrgTableModel";
			var oModel = this.getView().getModel("grac");
			//var oF4Table = this.getView().byId("idF4");
			var aFilters = [];
			if (!this._oValueHelpDialog) {
				this._oValueHelpDialog = sap.ui.xmlfragment(this.getView().getId(), "com.new.prjt.znew_arm_prjt.fragment.F4FromOrgVal", this);
				this.getView().addDependent(this._oValueHelpDialog);
			}
			for (var i = 0; i < oTable.length; i++) {
				if (i > inum) {
					break;
				}
				if (i === inum) {
					aFilters.push(new sap.ui.model.Filter("CUR_ORG", sap.ui.model.FilterOperator.EQ, "$" + oTable[i].OrgLevel + ""));
				} else {
					aFilters.push(new sap.ui.model.Filter("PRE_ORG_VALUE", sap.ui.model.FilterOperator.EQ, "$" + oTable[i].OrgLevel + " = " +
						oTable[i].FromOrg + ""));
				}
			};
			oModel.read("/SU53OrgValueFromSet", {
				filters: aFilters,
				success: function (data) {
					sap.ui.core.BusyIndicator.hide();
					var oAccessModel = new sap.ui.model.json.JSONModel({
						F4Values: data.results
					});
					this._oValueHelpDialog.setModel(oAccessModel);
				}.bind(this),
				error: function (error) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
			this._oValueHelpDialog.getBinding("items");
			var oBinding = this._oValueHelpDialog.getBinding("items");
			this._oValueHelpDialog.open();
		},
		onOrgFrom: function (eve) {
			oObject = eve.getSource().getBindingContext("OrgTableModel").getObject();
			var oPath = eve.getSource().getBindingContext("OrgTableModel").getPath();
			var num = oPath.split("/");
			var inum = parseInt(num[2] + "<br>");
			var oTable = this.getOwnerComponent().getModel("OrgTableModel").getData().OrgData;
			this.onF4Click(oTable, inum, oObject);
			oModelName = "OrgTableModel";
		},
		onOrgFromMod: function (eve) {
			oObject = eve.getSource().getBindingContext("OrgTableModelMod").getObject();
			var oPath = eve.getSource().getBindingContext("OrgTableModelMod").getPath();
			var num = oPath.split("/");
			var inum = parseInt(num[2] + "<br>");
			var oTable = this.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData;
			this.onF4Click(oTable, inum, oObject);
			oModelName = "OrgTableModelMod";
		},
		onF4Click: function (oTable, inum, oObject) {
			var oModel = this.getView().getModel("grac");
			//var oF4Table = this.getView().byId("idF4");
			var aFilters = [];
			if (!this._oValueHelpDialog) {
				this._oValueHelpDialog = sap.ui.xmlfragment("idOrgValF4", "com.new.prjt.znew_arm_prjt.fragment.F4FromOrgVal", this);
				this.getView().addDependent(this._oValueHelpDialog);
			}
			var oOrgValueFound = oTable.some(e => e.OrgLevel === oObject.OrgLevel);
			var oIndex = oTable.map(oObject => oObject.OrgLevel).indexOf(oObject.OrgLevel);
			var inum = oIndex;
			for (var i = 0; i < oTable.length; i++) {
				if (i > inum) {
					break;
				}
				if (i === 0) {
					aFilters.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, oTable[i].Conn));
				}
				if (i === inum) {
					aFilters.push(new sap.ui.model.Filter("CUR_ORG", sap.ui.model.FilterOperator.EQ, "$" + oTable[i].OrgLevel + ""));
				} else {
					if (oObject.OrgLevel !== oTable[i].OrgLevel) {
						aFilters.push(new sap.ui.model.Filter("PRE_ORG_VALUE", sap.ui.model.FilterOperator.EQ, "$" + oTable[i].OrgLevel + " = " +
							oTable[i].FromOrg + ""));
					}
				}
			};
			oModel.read("/NARORGVALUEFROMSet", {
				filters: aFilters,
				success: function (data) {
					sap.ui.core.BusyIndicator.hide();
					var oOrgModel = new sap.ui.model.json.JSONModel();
					oOrgModel.setData(data.results);
					this._oValueHelpDialog.setModel(oOrgModel, "OrgModel");
					this._oValueHelpDialog.open();
				}.bind(this),
				error: function (error) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("No Values Found");
					return;
				}
			});
		},

		onDropAvailableSysLand: function (oEvent) {
			var pathTable1 = oEvent.mParameters.draggedControl.oBindingContexts.SysLandInfo.sPath;
			var oModelTable1 = this.getOwnerComponent().getModel("SysLandInfo");
			var oModelTable2 = this.getOwnerComponent().getModel("SeleSysLandInfo");
			var oData1 = [];
			oData1.push(oModelTable1.getProperty(pathTable1));
			if (oData1.length !== 0) {
				oModelTable2.getData().sleSysLaData.push(oModelTable1.getProperty(pathTable1));
				oModelTable2.refresh(true);
				var index = parseInt(pathTable1.match(/\d/g).join('',));
				oModelTable1.getData().SysLaData.splice(index, 1);
				oModelTable1.refresh(true);
			}
		},
		onDropAvailableSysLandS: function (oEvent) {
			var pathTable1 = oEvent.mParameters.draggedControl.oBindingContexts.SeleSysLandInfo.sPath;
			var oModelTable2 = this.getOwnerComponent().getModel("SysLandInfo");
			var oModelTable1 = this.getOwnerComponent().getModel("SeleSysLandInfo");
			var oData1 = [];
			oData1.push(oModelTable1.getProperty(pathTable1));
			if (oData1.length !== 0) {
				oModelTable2.getData().SysLaData.push(oModelTable1.getProperty(pathTable1));
				oModelTable2.refresh(true);
				var index = parseInt(pathTable1.match(/\d/g).join('',));
				oModelTable1.getData().sleSysLaData.splice(index, 1);
				oModelTable1.refresh(true);
			}
		},

		onDropSelectedProductsTableMod: function (oEvent) {
			var pathTable1 = oEvent.mParameters.draggedControl.oBindingContexts.SysLandInfoMod.sPath;
			var oModelTable1 = this.getOwnerComponent().getModel("SysLandInfoMod");
			var oModelTable2 = this.getOwnerComponent().getModel("SeleSysLandInfoMod");
			var oData1 = [];
			oData1.push(oModelTable1.getProperty(pathTable1));
			if (oData1.length !== 0) {
				oModelTable2.getData().sleSysLaData.push(oModelTable1.getProperty(pathTable1));
				oModelTable2.refresh(true);
				var index = parseInt(pathTable1.match(/\d/g).join('',));
				oModelTable1.getData().SysLaData.splice(index, 1);
				oModelTable1.refresh(true);
			}
		},
		onDropSelectedProductsTableModS: function (oEvent) {
			var pathTable1 = oEvent.mParameters.draggedControl.oBindingContexts.SeleSysLandInfoMod.sPath;
			var oModelTable2 = this.getOwnerComponent().getModel("SysLandInfoMod");
			var oModelTable1 = this.getOwnerComponent().getModel("SeleSysLandInfoMod");
			var oData1 = [];
			oData1.push(oModelTable1.getProperty(pathTable1));
			if (oData1.length !== 0) {
				oModelTable2.getData().SysLaData.push(oModelTable1.getProperty(pathTable1));
				oModelTable2.refresh(true);
				var index = parseInt(pathTable1.match(/\d/g).join('',));
				oModelTable1.getData().sleSysLaData.splice(index, 1);
				oModelTable1.refresh(true);
			}
		},

		onSelectModifierA: function (oEvent) {
			var oUserID = this.getOwnerComponent().getModel("navModel").getData().oResult.user_id;
			if (oEvent == "Self") {
				var oSelectItem = "Self";
			} else {
				var oSelectItem = oEvent.getSource().getSelectedKey();
			}
			if (oSelectItem === "Other") {
				this._clearModifyRequest();
				this.getView().byId("idComboUserMod").setEditable(true);
				this.getView().byId("idComboUserMod").setSelectedKey("");
				this.getView().byId("idBusinessProcess").setRequired(true);
				this.myOthers();
			} else if (oSelectItem === "Self") {
				this.getView().byId("idComboUserMod").setEditable(false);
				this.getView().byId("idComboUserMod").setSelectedKey("");
				this.onUserChangeMod(oUserID, true);
				this.byId("idComboUserMod").setValue(oUserID);
				this.getView().byId("idBusinessProcess").setRequired(false);
				this.getView().byId("cbBusinessProcessMod").setValueState("None");
			} else if (oSelectItem === "Multiple") {
				this._clearModifyRequest();
				this.getView().byId("idComboUserMod").setEditable(true);
				this.myReportees();
			}
		},

		_userInfo: function () {
			var oModelG = this.getView().getModel("grac");
			var oUserInfoModel = this.getOwnerComponent().getModel("PersonalInfoSet");
			oModelG.read("/PersonnelSet", {
				success: function (data) {
					oUserInfoModel.setData(data.results);
					oUserInfoModel.refresh(true);
				},
				error: function (event) {
					sap.m.MessageBox.error('Error Occurs.');
					return;
				}
			});
		},

		onUserChangeMod: function (userId, onSelf) {
			this._clearModifyRequest();
			var that = this;
			var oUser
			if (onSelf === true) {
				oUser = this.getOwnerComponent().getModel("navModel").getData().oResult.user_id;
			} else {
				oUser = userId;
				this.byId("idComboUserMod").setValue(userId);
			}
			var oModelG = this.getView().getModel("grac");
			oModelG.read("/NARUserInformationSet(USER_ID='" + oUser + "')", {
				success: function (data) {
					var data = {
						"DEPARTMENT": data.DEPARTMENT,
						"EMAIL": data.EMAIL,
						"EMPTYPE": data.EMPTYPE,
						"FIRST_NAME": data.FIRST_NAME,
						"IDENTIFIER": data.IDENTIFIER,
						"LAST_NAME": data.LAST_NAME,
						"PHONE": data.PHONE,
						"USER_ACTION": data.USER_ACTION,
						"USER_ID": data.USER_ID,
						"ZEMPID": data.ZEMPID,
						"ZRMID": data.ZRMID
					};
					var oUserInfoModel = new sap.ui.model.json.JSONModel(data);
					that.getView().setModel(oUserInfoModel, "userInfo");
					that.getView().byId("idNameMod").setText(data.FIRST_NAME + " " + data.LAST_NAME);
				},
				error: function (event) {
					sap.m.MessageBox.error('Error Occurs.');
					return;
				}
			});
		},

		onSubmitMod: function (Oevent) {

			var textFlag = Oevent.getSource().getText();
			if (textFlag === "Submit") {
				this._onSubmitOrSaveMod("SUBMIT");
			} else if (textFlag === "Save") {
				this._onSubmitOrSaveMod("SAVE");
			}
		},
		_onSubmitOrSaveMod: function (saveOrSubmit) {
			sap.ui.core.BusyIndicator.show(300);
			var oFlagSavSub = saveOrSubmit;
			var text = this.getView().byId("idModifyText").getValue();
			var oModel = this.getView().getModel("grac");
			var that = this;
			that.flagM = oFlagSavSub;
			var oUserInfoModel = this.getView().getModel("userInfo").getData();
			oUserInfoModel.EMPTYPE = this.getView().byId("idemptypeMod").getSelectedKey();
			var oSeleSysLandInfo = this.getOwnerComponent().getModel("SeleSysLandInfoMod").getData().sleSysLaData;
			var SysLandInfo = [];
			if (oSeleSysLandInfo.length !== 0) {
				oSeleSysLandInfo.forEach((item, index) => {
					var tdata = {
						"USER_ID": oUserInfoModel.USER_ID,
						"CONNECTOR": oSeleSysLandInfo[index].CONNECTOR,
						"ENVIRONMENT": oSeleSysLandInfo[index].ENVIRONMENT,
						"RFCDOC1": oSeleSysLandInfo[index].RFCDOC1
					};
					SysLandInfo.push(tdata);
				});
			}
			//end of comments by varun
			//add Tcode and Org values in the description
			var tcode = "   TCODE: ";
			tcode = tcode.concat(this.getView().byId("idTcodesListMod").getText());
			text = text.concat(tcode);
			var oOrgDataInfo = this.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData;
			var OrgData = [];
			if (oOrgDataInfo.length !== 0) {
				oOrgDataInfo.forEach((item, index) => {
					if (oOrgDataInfo[index].FromOrg !== '') {
						var org = ", ORG_LEVEL : ";
						text = text.concat(org);
						text = text.concat(oOrgDataInfo[index].OrgLevel);
						var val = ", FROM_VALUE: ";
						text = text.concat(val);
						text = text.concat(oOrgDataInfo[index].FromOrg)
					}
				});
			}
			var oRoleDateFromTable = this.getOwnerComponent().getModel("RoleInfoModelMod").getData().RolInfoData;
			var RoleData = [];
			if (oRoleDateFromTable.length !== 0) {
				oRoleDateFromTable.forEach((item, index) => {
					var Roldata = {
						"CONNECTOR": oRoleDateFromTable[index].System,
						"ROLE_NAME": oRoleDateFromTable[index].role,
						"RFCDOC1": oRoleDateFromTable[index].sysDesc,
						"ROLE_TYPE": oRoleDateFromTable[index].roleType,
						"ROLE_DESCN": oRoleDateFromTable[index].sysDesc,
						"PROV_ACTION": "006"
					};
					RoleData.push(Roldata);
				});
			}
			var oPayload = {
				"USER_ACTION": oFlagSavSub,
				"IDENTIFIER": "NA",
				"USER_ID": oUserInfoModel.USER_ID,
				"FIRST_NAME": oUserInfoModel.FIRST_NAME,
				"LAST_NAME": oUserInfoModel.LAST_NAME,
				"EMPTYPE": oUserInfoModel.EMPTYPE,
				"ZRMID": oUserInfoModel.ZRMID,
				"ZEMPID": oUserInfoModel.ZEMPID,
				"DEPARTMENT": oUserInfoModel.DEPARTMENT,
				"PHONE": oUserInfoModel.PHONE,
				"EMAIL": oUserInfoModel.EMAIL,
				"NARSystemInformationSet": SysLandInfo,
				"NARRoleInformationSet": RoleData,
				"DESCRIPTION": text,
				"BPROC": this.byId("cbBusinessProcessMod").getSelectedKey(),
				"requester": oUserID
			};
			var params = [];
			params["X-CSRF-Token"] = oModel.getSecurityToken();
			params["X-CSRF-Token"] = csrf;
			params["Content-Type"] = "application/json";
			var slug = this.file.name;
			var filetype = this.file.type;
			var oCSRFToken = oModel.getSecurityToken();
			oModel.create('/NARUserInformationSet', oPayload, {
				headers: params,
				success: function (data) {
					sap.ui.core.BusyIndicator.hide();
					var mesg = "Your Request has been submitted successfully with request '" + data.STATUS + "'";
					var mesg2 = "Your Request has been saved successfully."
					var finalMesg = (that.flagM === "SAVE" ? mesg2 : mesg);
					sap.ui.core.BusyIndicator.show();
					sap.m.MessageBox.success(finalMesg);
					var oFileUploader = sap.ui.getCore().byId("idfileUploader1");
					if (oFileUploader.getValue() === "") {
						MessageToast.show("Please Choose any File");
					}
					oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						name: "SLUG",
						value: slug
					}));
					oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						name: "Content-Type",
						value: filetype
					}));

					oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						name: "x-csrf-token",
						value: oModel.getSecurityToken()
					}));
					var sUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/NARUserInformationSet(USER_ID='" + data.STATUS + "')/AttachementsSet";
					oFileUploader.setUploadUrl(sUrl);
					oFileUploader.setSendXHR(true);
					oFileUploader.upload();
					var AttDataRem = {
						"AttInfoData": []
					};
					that.getOwnerComponent().getModel("AttInfoModelMod").setData(AttDataRem);
					that.handleUploadCompleteMod(that.flagM);
				},
				error: function (data) {
					sap.ui.core.BusyIndicator.hide();
					if (JSON.parse(data.responseText)) {
						sap.m.MessageBox.error("Modify request unsuccessful'" + JSON.parse(data.responseText).error.message.value + "'");
					} else {
						sap.m.MessageBox.error("Modify request unsuccessful");
					}
				}
			});
		},

		onCancel: function (saveOrSubmit) {
			var oFlagSavSub = saveOrSubmit;
			var oModel = this.getView().getModel("grac");
			var that = this;
			that.flagM = oFlagSavSub;
			var oUserInfoModel = this.getView().getModel("userInfo").getData();
			var oTcodeModel = this.getOwnerComponent().getModel("TcodeModelMod").getData().TcodeData;
			var Tcode = [];
			if (oTcodeModel.length !== 0) {
				oTcodeModel.forEach((item, index) => {
					var tdata = {
						"USER_ID": oUserInfoModel.USER_ID,
						"ACTION": oTcodeModel[index].Tcode,
						"ACTION_ID": oTcodeModel[index].ACTION_ID,
						"CONNECTOR": oTcodeModel[index].Connector,
						"DESCN": oTcodeModel[index].TcodeDesc
					};
					Tcode.push(tdata);
				});
			}
			var oSeleSysLandInfo = this.getOwnerComponent().getModel("SeleSysLandInfoMod").getData().sleSysLaData;
			var SysLandInfo = [];
			if (oSeleSysLandInfo.length !== 0) {
				oSeleSysLandInfo.forEach((item, index) => {
					var tdata = {
						"USER_ID": oUserInfoModel.USER_ID,
						"CONNECTOR": oSeleSysLandInfo[index].CONNECTOR,
						"ENVIRONMENT": oSeleSysLandInfo[index].ENVIRONMENT,
						"RFCDOC1": oSeleSysLandInfo[index].RFCDOC1
					};
					SysLandInfo.push(tdata);
				});
			}
			var oOrgDataInfo = this.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData;
			var OrgData = [];
			if (oOrgDataInfo.length !== 0) {
				oOrgDataInfo.forEach((item, index) => {
					var tdata = {
						"USER_ID": oUserInfoModel.USER_ID,
						"CONNECTOR": oOrgDataInfo[index].Conn,
						"ACTION": oOrgDataInfo[index].Tcode,
						"FIELDNAME": oOrgDataInfo[index].OrgLevel,
						"VTEXT": oOrgDataInfo[index].OrgVal,
						"VALUE_FROM": oOrgDataInfo[index].FromOrg
					};
					OrgData.push(tdata);
				});
			}
			var RoleData = [];
			var Roledata = {
				"USER_ID": oUserInfoModel.USER_ID,
				"TCODE": " ",
				"ORG_LEVEL": " ",
				"FROM_VALUE": " ",
				"TO_VAUE": " ",
				"CONNECTOR": "TGDCLNT210",
				"ROLE_ID": "FFID_B",
				"ROLE_NAME": " ",
				"RFCDOC1": " ",
				"ROLE_TYPE": " ",
				"ROLE_DESCN": " ",
				"RT_DESCN": " "
			};
			RoleData.push(Roledata);
			var oPayload = {
				"USER_ACTION": oFlagSavSub,
				"IDENTIFIER": "UC",
				"USER_ID": oUserInfoModel.USER_ID,
				"FIRST_NAME": oUserInfoModel.FIRST_NAME,
				"LAST_NAME": oUserInfoModel.LAST_NAME,
				"EMPTYPE": oUserInfoModel.EMPTYPE,
				"ZRMID": oUserInfoModel.ZRMID,
				"ZEMPID": oUserInfoModel.ZEMPID,
				"DEPARTMENT": oUserInfoModel.ZDEPTD,
				"PHONE": oUserInfoModel.PHONE,
				"EMAIL": oUserInfoModel.EMAIL,
				"NARSystemInformationSet": SysLandInfo,
				"TCodeInfoSet": Tcode,
				"NARRoleInformationSet": RoleData,
				"NAROrgValueInformationSet": OrgData
			};
			oModel.create('/NARUserInformationSet', oPayload, {
				success: function (data) {
					var mesg = "Your Request has been submitted successfully.";
					var mesg2 = "Your Request has been saved successfully."
					var finalMesg = (that.flagM === "SAVE" ? mesg2 : mesg);
					sap.m.MessageBox.success(finalMesg);
				},
				error: function (data) {
					sap.m.MessageBox.error("User Unlock is unsuccessful");
				}
			});
		},

		onValHelpUSER: function (oEvent) {
			var that = this;
			var oModelG = this.getView().getModel("grac");
			var oUserInfoModel = this.getView().getModel("userInfo");
			oModelG.read("/NARUserInformationSet", {
				success: function (data) {
					var DData = {
						User: []
					};
					data.results.forEach((item, index) => {
						var data1 = {
							"DEPARTMENT": data.results[index].DEPARTMENT,
							"EMAIL": data.results[index].EMAIL,
							"EMPTYPE": data.results[index].EMPTYPE,
							"FIRST_NAME": data.results[index].FIRST_NAME,
							"IDENTIFIER": data.results[index].IDENTIFIER,
							"LAST_NAME": data.results[index].LAST_NAME,
							"PHONE": data.results[index].PHONE,
							"USER_ACTION": data.results[index].USER_ACTION,
							"USER_ID": data.results[index].USER_ID,
							"ZEMPID": data.results[index].ZEMPID,
							"ZRMID": data.results[index].ZRMID
						};
						DData.User.push(data1);
					});
					oUserInfoModel.setData(DData);
					oUserInfoModel.refresh(true);
				},
				error: function (event) {
					sap.m.MessageBox.error('Error Occurs.');
					return;
				}
			});
		},
		onDropAvailableSysLandFF: function (oEvent) {
			var pathTable1 = oEvent.mParameters.draggedControl.oBindingContexts.SysLandInfoFF.sPath;
			var oModelTable1 = this.getOwnerComponent().getModel("SysLandInfoFF");
			var oModelTable2 = this.getOwnerComponent().getModel("SeleSysLandInfoFF");
			var oData1 = [];
			oData1.push(oModelTable1.getProperty(pathTable1));
			if (oData1.length !== 0) {
				oModelTable2.getData().sleSysLaData.push(oModelTable1.getProperty(pathTable1));
				oModelTable2.refresh(true);
				var index = parseInt(pathTable1.match(/\d/g).join('',));
				oModelTable1.getData().SysLaData.splice(index, 1);
				oModelTable1.refresh(true);
			}
		},
		onDropAvailableSysLandSFF: function (oEvent) {
			var pathTable1 = oEvent.mParameters.draggedControl.oBindingContexts.SeleSysLandInfoFF.sPath;
			var oModelTable2 = this.getOwnerComponent().getModel("SysLandInfoFF");
			var oModelTable1 = this.getOwnerComponent().getModel("SeleSysLandInfoFF");
			var oData1 = [];
			oData1.push(oModelTable1.getProperty(pathTable1));
			if (oData1.length !== 0) {
				oModelTable2.getData().SysLaData.push(oModelTable1.getProperty(pathTable1));
				oModelTable2.refresh(true);
				var index = parseInt(pathTable1.match(/\d/g).join('',));
				oModelTable1.getData().sleSysLaData.splice(index, 1);
				oModelTable1.refresh(true);
			}
		},
		FFselectedId: function (oEvent) {
			var oDragSession = oEvent.getParameter("draggedControl");
			var pathTable1 = oDragSession.oBindingContexts.FireFiIds.sPath;
			var oModelTable1 = this.getOwnerComponent().getModel("FireFiIds");
			var oModelTable2 = this.getOwnerComponent().getModel("FireFiIdsel");
			var oData1 = [];
			oData1.push(oModelTable1.getProperty(pathTable1));
			if (oData1.length !== 0) {
				oModelTable2.getData().FireFiId.push(oModelTable1.getProperty(pathTable1));
				oModelTable2.refresh(true);
				var index = parseInt(pathTable1.match(/\d/g).join('',));
				oModelTable1.getData().FireFiId.splice(index, 1);
				oModelTable1.refresh(true);
			}
		},

		onSubmitRem: function (Oevent) {
			var textFlag = Oevent.getSource().getText();
			if (textFlag === "Submit") {
				this._onSubmitRem("SUBMIT");
			} else if (textFlag === "Save") {
				this._onSubmitRem("SAVE");
			}
		},
		_onSubmitRem: function (saveOrSubmit) {
			var text = this.getView().byId("idRemText").getValue();
			var oFlagSavSub = saveOrSubmit;
			var oModel = this.getView().getModel("grac");
			var that = this;
			that.flagM = oFlagSavSub;
			var oUserInfoModel = this.getOwnerComponent().getModel("userInfoRem").getData();
			var finalTab = this.getView().byId("idRemAccSelTable");
			var aData = (finalTab.getItems() || []).map(function (oItem) {
				// assuming that you are using the default model  
				return oItem.getBindingContext().getObject();
			});
			var RemData = [];
			if (aData.length !== 0) {
				aData.forEach((item, index) => {
					var getRemdata = {
						"USER_ID": aData[index].USER_ID,
						"CONNECTOR": aData[index].CONNECTOR,
						"RFCDOC1": aData[index].RFCDOC1,
					};
					RemData.push(getRemdata);
				});
			}
			var EMPTYPE = this.getView().byId("idRemEmpType").getSelectedKey();
			var oPayload = {
				"USER_ACTION": oFlagSavSub,
				"IDENTIFIER": "RA",
				"USER_ID": oUserInfoModel.USER_ID,
				"FIRST_NAME": oUserInfoModel.FIRST_NAME,
				"LAST_NAME": oUserInfoModel.LAST_NAME,
				"EMPTYPE": EMPTYPE,
				"ZRMID": oUserInfoModel.ZRMID,
				"ZEMPID": oUserInfoModel.ZEMPID,
				"DEPARTMENT": oUserInfoModel.DEPARTMENT,
				"PHONE": oUserInfoModel.PHONE,
				"EMAIL": oUserInfoModel.EMAIL,
				"DESCRIPTION": text,
				"AccessInformationSet": RemData,
				"requester": oUserID
			};
			var params = [];
			params["X-CSRF-Token"] = oModel.getSecurityToken();
			params["X-CSRF-Token"] = csrf;
			params["Content-Type"] = "application/json";
			var slug = this.file.name;
			var filetype = this.file.type;
			var oCSRFToken = oModel.getSecurityToken();
			oModel.create('/NARUserInformationSet', oPayload, {
				headers: params,
				success: function (data) {
					var mesg = "Your Request has been submitted successfully with request '" + data.STATUS + "'";
					var mesg2 = "Your Request has been saved successfully."
					var finalMesg = (that.flagM === "SAVE" ? mesg2 : mesg);
					sap.ui.core.BusyIndicator.show();
					sap.m.MessageBox.success(finalMesg);
					var oFileUploader = sap.ui.getCore().byId("idRemfileUploader");
					if (oFileUploader.getValue() === "") {
						MessageToast.show("Please Choose any File");
					}
					oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						name: "SLUG",
						value: slug
					}));
					oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						name: "Content-Type",
						value: filetype
					}));
					oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						name: "x-csrf-token",
						value: oModel.getSecurityToken()
					}));
					var sUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/NARUserInformationSet(USER_ID='" + data.STATUS + "')/AttachementsSet";
					oFileUploader.setUploadUrl(sUrl);
					oFileUploader.setSendXHR(true);
					oFileUploader.upload();
					var AttDataRem = {
						"AttInfoData": []
					};
					that.getOwnerComponent().getModel("RemAttInfoModel").setData(AttDataRem);
					that.handleUploadComplete(that.flagM);
				},
				error: function (data) {
					if (JSON.parse(data.responseText)) {
						sap.m.MessageBox.error("Request is unsuccessful" + JSON.parse(data.responseText).error.message.value + "'");
					} else {
						sap.m.MessageBox.error("Request is unsuccessful");
					}
				}
			});
		},

		handleUploadCompleteMod: function (flagM) {
			sap.ui.core.BusyIndicator.hide();
			var oFileUploader = sap.ui.getCore().byId("idfileUploader1");
			oFileUploader.setValue("");
			sap.m.MessageToast.show("File Uploaded");
			if (flagM !== "SAVE") {
				this.navToMyAccess();
			}
		},
		handleUploadComplete: function (flagM) {
			sap.ui.core.BusyIndicator.hide();
			var oFileUploader = sap.ui.getCore().byId("idRemfileUploader");
			oFileUploader.setValue("");
			sap.m.MessageToast.show("File Uploaded");
			if (flagM !== "SAVE") {
				this.navToMyAccess();
			}
		},

		handleChange: function (e) {
			var oTab = this.getView().byId("idFFValidTable");
			if (oTab.getSelectedContexts().length === 0) {
				sap.m.MessageBox.error("Please Select a Item and change the Date");
				return;
			} else {
				var i = e.getParameters("items").id.split("-")[6];
				dateFrom = e.getParameters().value;
				this.getView().byId("idFFFinalDateFrom").setText(e.getParameters().value);
				oTab.getSelectedContexts()[i].getObject().VALID_FROM = dateFrom;
			}
		},
		handleChange1: function (e) {
			var oTab = this.getView().byId("idFFValidTable");
			if (oTab.getSelectedContexts().length === 0) {
				sap.m.MessageBox.error("Please Select a Item and change the Date");
				return;
			} else {
				var i = e.getParameters("items").id.split("-")[6];
				dateTo = e.getParameters().value;
				this.getView().byId("idFFFinalDateTo").setText(e.getParameters().value);
				oTab.getSelectedContexts()[i].getObject().VALID_TO = dateTo;
			}
		},
		onFfidUpdateSeleTable: function (e) {
			var oFfidTable = this.byId("idFfidSelTable");
			var oFfidSelectdata = [];
			var oTab = this.getView().byId("idFFValidTable");
			for (var i = 0; i < oTab.getSelectedContexts().length; i++) {
				oFfidSelectdata[i] = oTab.getSelectedContexts()[i].getObject();
			};
			var oFfidModel = new JSONModel(oFfidSelectdata);
			oFfidModel.setData({
				FfidSelData: oFfidSelectdata
			});
			oFfidTable.setModel(oFfidModel);
		},
		onFFRefresh: function (eve) {
			var that = this;
			var FireFiIdsel = that.getOwnerComponent().getModel("SeleSysLandInfoFF").getData().sleSysLaData;
			that.getView().byId("DropTableFireFighterID").getModel("FireFiIdsel").setProperty("/FireFiId", []);
			that.getView().byId("DragTableFireFighterID").getModel("FireFiIds").setProperty("/FireFiId", []);
			var oModelCom = that.getView().getModel('grac');
			var FFVlid = that.getOwnerComponent().getModel("FireFiIds");
			if (FireFiIdsel.length !== 0) {
				FireFiIdsel.forEach((item, index) => {
					var oFilter = [];
					var oFilterConnector = FireFiIdsel[index].CONNECTOR;
					if (oFilterConnector) {
						oFilter.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, oFilterConnector));
					}
					sap.ui.core.BusyIndicator.show(300);
					oModelCom.read("/GetFirefighterObjSet", {
						async: true,
						filters: oFilter,
						success: function (data) {
							if (data.results.length === 0) {
								sap.ui.core.BusyIndicator.hide();
								sap.m.MessageBox.error('The Fire Fighter Vality data not Avilable.');
								return;
							} else {
								for (var i = 0; i < data.results.length; i++) {
									var oSystemModelData = {
										"APP_TYPE": data.results[i].APP_TYPE,
										"CONNECTOR": data.results[i].CONNECTOR,
										"FFOBJECT": data.results[i].FFOBJECT,
										"USER_ID": data.results[i].USER_ID,
										"VALID_FROM": data.results[i].VALID_FROM,
										"VALID_TO": data.results[i].VALID_TO
									};
									FFVlid.getData().FireFiId.push(oSystemModelData);
								}
								FFVlid.refresh(true);
								sap.ui.core.BusyIndicator.hide();
							}
						},
						error: function (event) {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageBox.error('Error Occured.');
							return;
						}
					});
				});
			}
		},

		// onGetAuthPage: function(oEvent) {
		// 	this.byId("pageContainer").to(this.getView().createId("GetAuth"));
		// 	authData = oEvent.getSource().getBindingContext().getObject();
		// 	this.getView().byId("idAuthtableRole").getModel("AuthRoleInfoModel").setProperty("/RolInfoData", []);
		// 	var oFilterRole = [];
		// 	oFilterRole.push(new sap.ui.model.Filter("TCODE", sap.ui.model.FilterOperator.EQ, authData.OBJCT));
		// 	oFilterRole.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, authData.RFCDEST));
		// 	oFilterRole.push(new sap.ui.model.Filter("time", sap.ui.model.FilterOperator.EQ, authData.time));
		// 	oFilterRole.push(new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, authData.BNAME));
		// 	var RoleTableModel = this.getOwnerComponent().getModel("AuthRoleInfoModel");
		// 	var oModel = this.getView().getModel('grac');
		// 	oModel.read("/SU53RoleInformationSet", {
		// 		async: true,
		// 		filters: oFilterRole,
		// 		success: function(data) {
		// 			if (data.results.length === 0) {
		// 				sap.m.MessageBox.error('The Role Information is not avilable');
		// 				return;
		// 			} else {
		// 				for (var i = 0; i < data.results.length; i++) {
		// 					var RolData = {
		// 						System: data.results[i].CONNECTOR,
		// 						sysDesc: data.results[i].RFCDOC1,
		// 						tCode: data.results[i].TCODE,
		// 						role: data.results[i].ROLE_NAME,
		// 						Desc: data.results[i].ROLE_DESCN,
		// 						roleType: data.results[i].ROLE_TYPE,
		// 						key: i + 1
		// 					};
		// 					RoleTableModel.getData().RolInfoData.push(RolData);
		// 					RoleTableModel.refresh(true);
		// 				}
		// 			}
		// 		},
		// 		error: function(event) {
		// 			sap.m.MessageBox.error('Role Information is not found');
		// 			return;
		// 		}
		// 	});
		// },
		onBack: function (evt) {
			this.byId("pageContainer").to(this.getView().createId("Auth"));
			var oWizard = this.byId("idAuth");
			var oFirstStep = oWizard.getSteps()[0];
			oWizard.discardProgress(oFirstStep);
			// scroll to top
			oWizard.goToStep(oFirstStep);
			// invalidate first step
			oFirstStep.setValidated(false);
			this.getView().byId("idButAuthOrg").setVisible(true);
			this.getView().byId("idButtonSU53Review").setVisible(true);
		},

		onHome: function () {
			this.byId("pageContainer").to(this.getView().createId("Auth"));
			var authOrgTable = this.byId("pageContainer").getPages()[9].getContent()[2].getItems()[0].getSteps()[0].getContent()[0];
			authOrgTable.removeAllItems();
		},
		okUser: function (oEvent) {
			if (!this._newDiaAuth) {
				this._newDiaAuth = sap.ui.xmlfragment("com.new.prjt.znew_arm_prjt.fragment.DialogF4User", this);
				this.getView().addDependent(this._newDiaAuth)
			}
			this._newDiaAuth.close();
		},
		cancelUser: function (oEvent) {
			if (!this._newDiaAuth) {
				this._newDiaAuth = sap.ui.xmlfragment("com.new.prjt.znew_arm_prjt.fragment.DialogF4User", this);
				this.getView().addDependent(this._newDiaAuth)
			}
			this._newDiaAuth.close();
		},
		SU53onNextStep: function (oEvent) {
			this.byId("IDnewCreateProductWizard").nextStep();
			oEvent.getSource().setVisible(false);
		},
		onAppInboxClick: function (e) {
			var item = e.getSource().getBindingContext().getObject();
			var oHostname = window.location.hostname;
			var oPort = window.location.port;
			var oUrl = "http://" + oHostname + ":" + oPort +
				"/sap/bc/webdynpro/SAP/GRAC_OIF_REQUEST_APPROVAL?APPLID=GRFN_INBOX&ENTITY_ID=ACCREQ&MODE=E&OBJECT_ID=ACCREQ/00E04A0B3ED61EDB8C925C072C5E214F&WI_GROUP_OWNE=RAGHU&WORKITEM_ID=000000082827#";
			window.open(oUrl, "_blank");
		},
		onValueHelpUsers: function (oEvent) {
			var oView = this.getView();
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setSizeLimit(100000);
			oView.setModel(oModel, "UsersList");
			this._oUserInput = oEvent.getSource();
			if (!this._pUserValueHelpDialog) {
				this._pUserValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "com.new.prjt.znew_arm_prjt.fragment.UserValueHelpDialog",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.setModel(oView.getModel("UsersList"));
					return oDialog;
				});
			}
			this._pUserValueHelpDialog.then(function (oDialog) {
				oDialog.setModel(oView.getModel("UsersList"));
				oDialog.open();
				this.getView().byId("idConnector").setValue("");
				this.getView().byId("idUser").setValue("");
				this.getView().byId("idFname").setValue("");
				this.getView().byId("idLname").setValue("");
			}.bind(this));
		},
		handleSearchUserValueHelp: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var aFilters = [];
			aFilters.push(new Filter("USER_ID", FilterOperator.Contains, sValue));
			aFilters.push(new Filter("FIRST_NAME", FilterOperator.Contains, sValue));
			aFilters.push(new Filter("LAST_NAME", FilterOperator.Contains, sValue));
			var oFilter = new Filter({
				filters: aFilters,
				and: false
			});
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		onUserSubmit: function (oEvent) {
			this.handleCloseUserValueHelp(oEvent);
		},
		handleCloseUserValueHelp: function (oEvent) {
			if (oEvent.getParameter('listItem') == undefined) {
				var sUserID = oEvent.getParameter("value");
				sUserID = sUserID.toUpperCase();
				this._oUserInput = oEvent.getSource();
			} else {
				var path = oEvent.getParameter('listItem').getBindingContextPath();
				var sUserID = this.byId('idProductsTable').getModel().getProperty(path).BNAME;
				oRFCDEST = this.byId('idProductsTable').getModel().getProperty(path).RFCDEST;
			}
			if (sUserID) {
				if (this.getView().byId("idUserHelpDialog")) {
					this.getView().byId("idUserHelpDialog").close();
				}
				this._oUserInput.setValue(sUserID);
				if (this._oUserInput.getId().indexOf("idComboUserMod") > -1) {
					this.onUserChangeMod(sUserID, "");
				} else if (this._oUserInput.getId().indexOf("idComboUser2FF") > -1) {
					this.FFuser("", sUserID);
				} else if (this._oUserInput.getId().indexOf("idComboUser1") > -1) {
					this.onUserSelectRem(sUserID);
				} else {
					this.onUserChange(sUserID, "");
					if (this._selectedReqKey == "3rdparty") {
						this.getView().byId("idAlias").setVisible(true);
					} else {
						this.getView().byId("idAlias").setVisible(false);
					}
				}
			}
		},

		onDownloadTemplate: function () {
			var aCols, aTcodes, oSettings, oSheet;
			aCols = [{
				label: 'Connector',
				property: 'Connector',
				width: '15'
			}, {
				label: 'Transaction Code',
				property: 'TransactionCode',
				width: '10'
			}];
			aTcodes = [{
				"Connector": "",
				"TransactionCode": "",
				"TransactionDescr": ""
			}];
			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: aTcodes,
				fileName: 'TransactionInformation_Template'
			};
			oSheet = new s(oSettings);
			oSheet.build()
				.then(function () { })
				.finally(oSheet.destroy);
		},
		onSelectionChangeSystem: function (oEvent) {
			var aDeletedConnector = [];
			if (!oEvent.mParameters.selected) {
				var aListItems = oEvent.mParameters.listItems;
				aListItems.forEach(function (oItem) {
					aDeletedConnector.push(oItem.getCells()[0].getText());
				});
			}
			if (this._bIsNavigatedToStep3) {
				this._loadTcodeTable(aDeletedConnector);
			}
		},
		_loadTcodeTable: function (aDeletedConnector) {
			var aTcodeData = [];
			var aSelectedContexts = this.getView().byId("table1").getSelectedContexts();
			var aTransactionTableData = this.getOwnerComponent().getModel("TcodeModel").getProperty("/TcodeData");
			var deletedIndices = [];
			aDeletedConnector.forEach(function (connector) {
				for (var i = 0; i < aTransactionTableData.length; i++) {
					if (aTransactionTableData[i].Connector === connector) {
						deletedIndices.push(i);
					}
				}
			});
			if (deletedIndices.length > 0) {
				for (var k = deletedIndices.length - 1; k >= 0; k--) {
					aTransactionTableData.splice(deletedIndices[k], 1);
				}
			}
			var aSelectedRecords = [];
			if (aSelectedContexts.length > 0) {
				aSelectedContexts.forEach(function (oContext) {
					aSelectedRecords.push(oContext.getObject());
					var tmpArray = aTransactionTableData.filter(function (oRecord) {
						return (oRecord.Connector === oContext.getObject().CONNECTOR);
					});
					if (tmpArray.length === 0) {
						aTcodeData.push({
							"ACTION_ID": "",
							"Connector": oContext.getObject().CONNECTOR,
							"Tcode": "",
							"TcodeDesc": ""
						});
					} else { }
				});
				this.getView().byId("idTcode").getModel("TcodeModel").setProperty("/TcodeData", aTransactionTableData.concat(aTcodeData));
				this.getView().byId("idTcode").getModel("TcodeModel").refresh(true);
				this.getOwnerComponent().getModel("SeleSysLandInfo").setProperty("/sleSysLaData", aSelectedRecords);
				this.getOwnerComponent().getModel("SeleSysLandInfo").refresh(true);
			} else {
				sap.m.MessageBox.error('Please select at least one System.');
			}
		},

		onSelectionChangeSystemMod: function (oEvent) {
			var aDeletedConnector = [];
			if (!oEvent.mParameters.selected) {
				var aListItems = oEvent.mParameters.listItems;
				aListItems.forEach(function (oItem) {
					aDeletedConnector.push(oItem.getCells()[0].getText());
				});
			}
			if (this._bIsNavigatedToStep3Mod) {
				this._loadTcodeTableMod(aDeletedConnector);
			}
		},
		onSelectionChangeSystemFfid: function () {
			var aSlectedContexts = this.getView().byId("table1FF").getSelectedContexts();
			if (aSlectedContexts.length === 0) {
				MessageBox.error("Please select atleast one system.");
				return false;
			}
			this.getView().byId("DragTableFireFighterID").getModel("FireFiIds").setProperty("/FireFiId", []);
			this.getView().byId("DropTableFireFighterID").getModel("FireFiIdsel").setProperty("/FireFiId", []);
			this._FlageOrgCheck = true;
			var that = this;
			var aSelectedSysLandInfo = [];
			aSlectedContexts.forEach(function (oContext) {
				aSelectedSysLandInfo.push(oContext.getObject());
			});
			that.getOwnerComponent().getModel("SeleSysLandInfoFF").setProperty("/sleSysLaData", aSelectedSysLandInfo);
			var FireFiIdsel = aSelectedSysLandInfo;
			var oModelCom = that.getView().getModel('grac');
			var FFVlid = that.getOwnerComponent().getModel("FireFiIds");
			if (FireFiIdsel.length !== 0) {
				FireFiIdsel.forEach((item, index) => {
					var oFilter = [];
					var oFilterConnector = FireFiIdsel[index].CONNECTOR;
					if (oFilterConnector) {
						oFilter.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, oFilterConnector));
					}
					sap.ui.core.BusyIndicator.show(300);
					oModelCom.read("/GetFirefighterObjSet", {
						async: true,
						filters: oFilter,
						success: function (data) {
							if (data.results.length === 0) {
								sap.ui.core.BusyIndicator.hide();
								return;
							} else {
								for (var i = 0; i < data.results.length; i++) {
									var oSystemModelData = {
										"APP_TYPE": data.results[i].APP_TYPE,
										"CONNECTOR": data.results[i].CONNECTOR,
										"FFOBJECT": data.results[i].FFOBJECT,
										"USER_ID": data.results[i].USER_ID,
										"VALID_FROM": data.results[i].VALID_FROM,
										"VALID_TO": data.results[i].VALID_TO
									};
									FFVlid.getData().FireFiId.push(oSystemModelData);
								}
								FFVlid.refresh(true);
								sap.ui.core.BusyIndicator.hide();
							}
						},
						error: function (event) {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageBox.error('Error Occured.');
							return;
						}
					});
				});
			}
		},
		_loadTcodeTableMod: function (aDeletedConnector) {
			var aTcodeData = [];
			var aSelectedContexts = this.getView().byId("tableMod1").getSelectedContexts();
			var aTransactionTableData = this.getOwnerComponent().getModel("TcodeModelMod").getProperty("/TcodeData");
			var deletedIndices = [];
			aDeletedConnector.forEach(function (connector) {
				for (var i = 0; i < aTransactionTableData.length; i++) {
					if (aTransactionTableData[i].Connector === connector) {
						deletedIndices.push(i);
					}
				}
			});
			if (deletedIndices.length > 0) {
				for (var k = deletedIndices.length - 1; k >= 0; k--) {
					aTransactionTableData.splice(deletedIndices[k], 1);
				}
			}
			var aSelectedRecords = [];
			if (aSelectedContexts.length > 0) {
				aSelectedContexts.forEach(function (oContext) {
					aSelectedRecords.push(oContext.getObject());
					var tmpArray = aTransactionTableData.filter(function (oRecord) {
						return (oRecord.Connector === oContext.getObject().CONNECTOR);
					});
					if (tmpArray.length === 0) {
						//building array to bind to Transaction Code Information Table
						aTcodeData.push({
							"ACTION_ID": "",
							"Connector": oContext.getObject().CONNECTOR,
							"Tcode": "",
							"TcodeDesc": ""
						});
					} else { }
				});
				this.getOwnerComponent().getModel("TcodeModelMod").setProperty("/TcodeData", aTransactionTableData.concat(aTcodeData));
				this.getOwnerComponent().getModel("TcodeModelMod").refresh(true);
				this.getOwnerComponent().getModel("SeleSysLandInfoMod").setProperty("/sleSysLaData", aSelectedRecords);
				this.getOwnerComponent().getModel("SeleSysLandInfoMod").refresh(true);
			} else {
				sap.m.MessageBox.error('Please select at least one System.');
			}
		},

		_validateTcodes: function (data, modelName) {
			var oModelCom = this.getView().getModel('grac');
			var aPromises = [];
			sap.ui.core.BusyIndicator.show();
			for (var i = 0; i < data.length; i++) {
				var oPromise = new Promise((resolve, reject) => {
					var oFilter = [];
					if (data[i].Tcode) {
						oFilter.push(new sap.ui.model.Filter("ACTION", sap.ui.model.FilterOperator.EQ, data[i].Tcode));
					}
					if (data[i].Connector) {
						oFilter.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, data[i].Connector));
					}
					oModelCom.read("/TCodeInfoSet", {
						filters: oFilter,
						success: function (data) {
							resolve(data);
						},
						error: function (error) {
							reject(error);
						}
					});
				});
				aPromises.push(oPromise);
			}
			var that = this;
			var aTcodesFromExcel = [];
			Promise.allSettled(aPromises).then(function (results) {
				sap.ui.core.BusyIndicator.hide();
				var aTcodeData = that.getOwnerComponent().getModel(modelName).getData().TcodeData;
				for (var j = 0; j < results.length; j++) {
					if (results[j].status === "fulfilled") {
						data[j].TcodeDesc = results[j].value.results[0].DESCN;
						data[j].Connector = results[j].value.results[0].CONNECTOR;
						data[j].ACTION_ID = results[j].value.results[0].ACTION_ID;
						var aTmp = aTcodeData.filter(function (oRecord) {
							return (oRecord.Connector === data[j].Connector && oRecord.Tcode.toUpperCase() === data[j].Tcode.toUpperCase());
						});
						if (aTmp.length === 0) {
							that.getOwnerComponent().getModel(modelName).getData().TcodeData.push(data[j]);
						}
					}
				}
				that.getOwnerComponent().getModel(modelName).refresh();
			});
		},
		myAccessTileCount: function (value) {
			if (value === null || value === "") {
				return 0;
			} else {
				return value;
			}
		},
		handleSearchRMValueHelp: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var aFilters = [];
			aFilters.push(new Filter("BNAME", FilterOperator.Contains, sValue));
			aFilters.push(new Filter("NAME_FIRST", FilterOperator.Contains, sValue));
			aFilters.push(new Filter("NAME_LAST", FilterOperator.Contains, sValue));
			var oFilter = new Filter({
				filters: aFilters,
				and: false
			});
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleCloseRMValueHelp: function (oEvent) {
			// reset the filter
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([]);
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				this.byId("idempid").setValue(aContexts[0].getObject("BNAME"));
				this.byId("managerID").setValue(aContexts[0].getObject("BNAME"));
			}
		},

		navToMyAccess: function () {
			var oItem = this.getView().byId("toolPage").getSideContent().mAggregations.item.getItems()[0];
			this.getView().byId("toolPage").getSideContent().setSelectedItem(oItem);
			this._selectedReqKey = "myAccess";
			this.onItemSelect(oItem);
		},

		onUserSearch: function (oEvent) {
			var connector = this.getView().byId("idConnector").getValue();
			var user = this.getView().byId("idUser").getValue();
			var fname = this.getView().byId("idFname").getValue();
			var lname = this.getView().byId("idLname").getValue();
			this.getView().byId("idConnector").setValueState("None");
			var oModel1 = this.getView().getModel("grac");
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("RFCDEST", sap.ui.model.FilterOperator.EQ, connector));
			aFilters.push(new sap.ui.model.Filter("BNAME", sap.ui.model.FilterOperator.EQ, user));
			aFilters.push(new sap.ui.model.Filter("FNAME", sap.ui.model.FilterOperator.EQ, fname));
			aFilters.push(new sap.ui.model.Filter("LNAME", sap.ui.model.FilterOperator.EQ, lname));
			sap.ui.core.BusyIndicator.show();
			var that = this;
			oModel1.read("/F4_Exit_UserSet", {
				filters: aFilters,
				success: function (data) {
					sap.ui.core.BusyIndicator.hide();
					this.getView().getModel("UsersList").setData(data.results);
					this.getView().getModel("UsersList").refresh();
				}.bind(this),
				error: function (evt) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		_onMyAccessPress: function (oModel1) {
			var oUserID = this.getOwnerComponent().getModel("navModel").getData().oResult.user_id;
			this.showBusyIndicator();
			var oViewTable = this.byId("myAccesSysTable");
			var oViewTablefirefighter = this.byId("idTablefireFighter");
			var oViewnewUserSet = this.byId("newUSERTableReqSet");
			var oViewRemoveUserSet = this.byId("newRemoveReqSet");
			var oViewFirefighterSet = this.byId("newFireReqSet");
			var sUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/";
			var oModel1 = this.getOwnerComponent().getModel("grac");
			var that = this;
			var oNewUserReqSet = this.byId("newUSERReqSet");
			var oRemoveReqSet = this.byId("newRemoveCReqSet");
			var oFireReqSet = this.byId("newFireCReqSet");
			var filterme = [];
			filterme.push(new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, oUserID));
			var oValue = this.getView().byId("idAgeDays").getSelectedKey();
			var filterage = [];
			filterage.push(new sap.ui.model.Filter("age", sap.ui.model.FilterOperator.LT, oValue));
			var oTable = this.getView().byId("newUSERTableReqSet");
			oModel1.read("/PersonnelSet", {
				filters: filterme,
				urlParameters: {
					"$expand": "SystemSet,RemoveAccessRequestSet,NewUserRequestSet,FirefighterRequestSet,FirefighterSet"
				},
				success: function (data, textStatus, jqXHR) {
					var oDataResults = {
						"userDatails": data.results[0]
					};
					var oDashModel = new sap.ui.model.json.JSONModel(oDataResults);
					this.getView().setModel(oDashModel, "UserDatilsModel");
					var oModel = new sap.ui.model.json.JSONModel({
						//myItems: data.SystemSet.results 
						myItems: data.results[0].SystemSet.results
					});
					oViewTable.setModel(oModel);
					var oModelFire = new sap.ui.model.json.JSONModel({
						myItems: data.results[0].FirefighterSet.results
					});
					oViewTablefirefighter.setModel(oModelFire);
					var oNewUser = new sap.ui.model.json.JSONModel({
						myItems: data.results[0].NewUserRequestSet.results
					});
					oViewnewUserSet.setModel(oNewUser);
					var oRemoveAccess = new sap.ui.model.json.JSONModel({
						myItems: data.results[0].RemoveAccessRequestSet.results
					});
					var newCount = data.results[0].RemoveAccessRequestSet.results.length;
					var count_newuser = 0;
					var previous;
					for (var newuser = 0; newuser < newCount; newuser++) {
						if (data.results[0].RemoveAccessRequestSet.results[newuser].EXTERNAL_KEY_DIS != previous) {
							count_newuser++;
						}
						previous = data.results[0].RemoveAccessRequestSet.results[newuser].EXTERNAL_KEY_DIS;
					}
					oRemoveReqSet.setCount(count_newuser);
					oViewRemoveUserSet.setModel(oRemoveAccess);
					var oFirefighterAccess = new sap.ui.model.json.JSONModel({
						myItems: data.results[0].FirefighterRequestSet.results
					});
					var newCount = data.results[0].FirefighterRequestSet.results.length;
					var count_newuser = 0;
					var previous;
					for (var newuser = 0; newuser < newCount; newuser++) {
						if (data.results[0].FirefighterRequestSet.results[newuser].EXTERNAL_KEY_DIS != previous) {
							count_newuser++;
						}
						previous = data.results[0].FirefighterRequestSet.results[newuser].EXTERNAL_KEY_DIS;
					}
					oFireReqSet.setCount(count_newuser);
					oViewFirefighterSet.setModel(oFirefighterAccess);
					that.hideBusyIndicator();
					that.byId("pageContainer").to(this.getView().createId("myAccess"));
					var oBinding = oTable.getBinding("rows");
					oBinding.filter(filterage);
				}.bind(this),
				error: function (evt) {
					that.hideBusyIndicator();
				}
			});
			var oModel2 = this.getOwnerComponent().getModel("userLogin");
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("BNAME", sap.ui.model.FilterOperator.EQ, oUserID));
			oModel2.read("/USER_DETAILSSet", {
				filters: aFilters,
				success: function (oData) {
					if (oData && oData.results && oData.results.length === 1) {
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(oData.results[0]);
						that.getView().setModel(oModel, "TilesData");
					}
					that.hideBusyIndicator();
				}.bind(this),
				error: function (evt) {
					that.hideBusyIndicator();
				}
			});
		},

		FilterNewUser: function (event) {
			var oNewUserReqSet = this.byId("newUSERReqSet");
			const newCount = event.getSource().getLength();
			var count_newuser = 0;
			var previous;
			for (var newuser = 0; newuser < newCount; newuser++) {
				var test = event.getSource().aIndices[newuser];
				if (event.getSource().getModel().getData().myItems[test].EXTERNAL_KEY_DIS != previous) {
					count_newuser++;
				}
				previous = event.getSource().getModel().getData().myItems[test].EXTERNAL_KEY_DIS;
			}
			oNewUserReqSet.setCount(count_newuser);
		},
		FilterRemoveAccess: function (event) {
			var oNewUserReqSet = this.byId("newRemoveCReqSet");
			const newCount = event.getSource().getLength();
			var count_newuser = 0;
			var previous;
			for (var newuser = 0; newuser < newCount; newuser++) {
				var test = event.getSource().aIndices[newuser];
				if (event.getSource().getModel().getData().myItems[test].EXTERNAL_KEY_DIS != previous) {
					count_newuser++;
				}
				previous = event.getSource().getModel().getData().myItems[test].EXTERNAL_KEY_DIS;
			}
			oNewUserReqSet.setCount(count_newuser);
		},
		tsFireFightFilter: function (event) {
			var oNewUserReqSet = this.byId("newFireCReqSet");
			const newCount = event.getSource().getLength();
			var count_newuser = 0;
			var previous;
			for (var newuser = 0; newuser < newCount; newuser++) {
				var test = event.getSource().aIndices[newuser];
				if (event.getSource().getModel().getData().myItems[test].EXTERNAL_KEY_DIS != previous) {
					count_newuser++;
				}
				previous = event.getSource().getModel().getData().myItems[test].EXTERNAL_KEY_DIS;
			}
			oNewUserReqSet.setCount(count_newuser);
		},
		onValueHelpConnectors: function (oEvent) {
			var oView = this.getView();
			if (!this._connectorValueHelpDialog) {
				this._connectorValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "com.new.prjt.znew_arm_prjt.fragment.ConnectorF4Help",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._connectorValueHelpDialog.then(function (oDialog) {
				oDialog.open();
			}.bind(this));
		},
		onConnectorClose: function (oEvent) {
			if (oEvent.getParameter("selectedItem")) {
				var oSelValue = oEvent.getParameter("selectedItem").mProperties.title;
				this.getView().byId("idConnector").setValue(oSelValue);
			}
		},
		onSearchConnector: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("RFCDEST", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter([oFilter]);
		},
		onCloseUserPopup: function (oEvent) {
			if (this.getView().byId("idUserHelpDialog").close()) {
				this.getView().byId("idUserHelpDialog").close();
			}
		},
		onExit:function(){
			this.onAutoLogOut();
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
					//this.loginBusyDialogClose();
				}.bind(this),
			});
		},
		onPressApprovalInboxP:function(oEvent){                   //Added by Prasanth on 07-06-2024
			var env=window.location.host;
            if(env==="42601grcad01.adani.com:8000"){
				var sUrl="http://42601grcad01.adani.com:8000/sap/bc/webdynpro/sap/grfn_powl_inbox"
			}
			else if(env==="42601grcaq01.adani.com:8000"){
				var sUrl="http://42601grcaq01.adani.com:8000/sap/bc/webdynpro/sap/grfn_powl_inbox"
			}
			else if(env==="www.adaniportal.com:8452"){
				var sUrl="https://www.adaniportal.com:8452/sap/bc/webdynpro/sap/grfn_powl_inbox"
			}
			// else if(env==="localhost:8080"){
			// 	var sUrl="https://www.adaniportal.com:8452/sap/bc/webdynpro/sap/grfn_powl_inbox"
			// }
			//  sUrl += "?sap-theme=sap_corbu"; //Added by Prasanth on 26-06-2024
			
            sap.m.URLHelper.redirect(sUrl, true);
			//Production url added
		}
	})
});