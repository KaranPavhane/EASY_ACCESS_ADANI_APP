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
	"sap/ui/model/Sorter"
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
	var form_data = new DataTransfer();
	var SortOrder = library.SortOrder;
	var that = this;
	return e.extend("com.new.prjt.znew_arm_prjt.controller.removeAccess", {
		formatter: formatter,
		_data: {
			"date": new Date()
		},

		someFunctionOfTheFirstController: function (sChannelId, sEventId, sData) {
			form_data.items['clear'];
			form_data.clearData();
			this.byId("idComboUserType").setSelectedKey("");
			this._clearRemoveRequest();
			this.onUserTypeChng("Self");
		},
		onInit: function () {
			sap.ui.getCore().getEventBus().subscribe(
				"removeAccess",
				"SomeEvent",
				this.someFunctionOfTheFirstController,
				this
			);
			this.localModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.localModel, "localModel");
			var oDateModel = new JSONModel(this._data);
			this.getView().getModel("localModel").setProperty("/Date", this._data);
			////////////////////////////////////////////////////////////////////////////////////////
			window.onhashchange = function () {
				if (window.innerDocClick) {} else {
					this.handelLogOff();
				}
			}.bind(this);
			//////////////////////////////////////////////////////////////////////////////////////
			var that = this;
			//var oUserID = that.getOwnerComponent().getModel("navModel").getData().oResult.user_id;
			var IDLE_TIMEOUT = 3600; //seconds
			var _idleSecondsTimer = null;
			var _idleSecondsCounter = 0;
			document.onclick = function () {
				_idleSecondsCounter = 0;
			};
			window.onbeforeunload = function () {};
			document.onmousemove = function () {
				_idleSecondsCounter = 0;
			};
			document.onkeypress = function () {
				_idleSecondsCounter = 0;
			};
			_idleSecondsTimer = window.setInterval(CheckIdleTime, 1000);
			jQuery.sap.require("sap.m.MessageBox");

			function CheckIdleTime() {
				_idleSecondsCounter++;
				if (_idleSecondsCounter >= IDLE_TIMEOUT) {
					window.clearInterval(_idleSecondsTimer);
					that.handelLogOff();
				}
			}

			// $(window).unload(function (evt) {
			// 	this.handelLogOff();
			// }.bind(this));
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
					Visible:false
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
						title: "User Id Creation - Adani",
						key: "newModifyReqstID",
						enabled: true
					}, {
						title: "User Id Creation - 3rd Party",
						key: "3rdparty",
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
				key: "",  //Added by Prasanth on 29-05-2024
				text: ""
			},{
				key: "001",
				text: "Adani"
			}, {
				key: "002",
				text: "3rd Party User"
			},]
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
		},

		_resetSortingState: function () {
			var oTable = this.getView().byId("newUSERTableReqSet");
			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				aColumns[i].setSorted(false);
			}
		},
		showBusyIndicator: function (iDuration, iDelay) {
			sap.ui.core.BusyIndicator.show(300);
		},
		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
		},
		onExit:function(){
			this.handelLogOff();
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
					sap.ui.core.BusyIndicator.show()
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
		onNextStepRemoveAccess: function (e) {
			
			if (e.getSource().getText() === 'Next:Access Information') {
				var aElementID = ["idRemText", "idRemFName", "idRemLName", "idRemRepMana",
					
					"idRemEmail",
				];
				var oElementID_SelectDrop = ["idRemEmpType"];
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
				oElementID_SelectDrop.forEach(function (id) {
					var oControl = this.getView().byId(id);
					if (oControl.getSelectedKey() === "") {
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
			if (e.getSource().getText() === 'Next:Attachments') {
				//this.onUpdateSeleTable();
				this.byId("CreateProductWizardId2").nextStep();
				this.getView().byId("idNextAttach").setVisible(true);
				var AttDataRem = {
					"AttInfoData": []
				};
				this.getOwnerComponent().getModel("RemAttInfoModel").setData(AttDataRem);

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
				this.getView().byId("idRemEmpId").setVisible(true);
				this.getView().byId("idRemVenNum").setVisible(true);
				this.getView().byId("idRemove3rdPary").setText("3rd Party User Details");
			}
			if (e.getParameter("selectedItem").getText() === "Adani") {

				this.getView().byId("idRemEmpId").setVisible(false);
				this.getView().byId("idRemVenNum").setVisible(false);
				this.getView().byId("idRemove3rdPary").setText("");
			}
		},
		onValidatationCheck: function (e) {
			if (e.getParameter("value") === "") {
				e.getSource().setValueState(sap.ui.core.ValueState.Error)
			} else {
				e.getSource().setValueState(sap.ui.core.ValueState.Success)
			}
			if (e.getParameter("selectedItem").getText() === "3rd Party User") {
				this.getView().byId("idRemEmpId").setVisible(true);
				this.getView().byId("idRemVenNum").setVisible(true);
				this.getView().byId("idRemove3rdPary").setText("3rd Party User Details");
			}
			if (e.getParameter("selectedItem").getText() === "Adani") {

				this.getView().byId("idRemEmpId").setVisible(false);
				this.getView().byId("idRemVenNum").setVisible(false);

				this.getView().byId("idRemove3rdPary").setText("");
			}
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
			this.file = oEvent.getParameter("files");
			sap.ui.getCore().byId("idfileUploaderR").setPlaceholder("Please Choose");
		},
		// onRemAttachUpload: function(e) {
		// 	this._getRemAttachDialog().close();
		// 	var AttTableModel = this.getOwnerComponent().getModel("RemAttInfoModel");
		// 	var AttData = {
		// 		tile: this.file.name,
		// 		type: this.file.type,
		// 		addedOn: this.getView().getModel("localModel").getProperty("/Date"),
		// 		addedBy: oUserID,
		// 		key: i + 1
		// 	};
		// 	AttTableModel.getData().AttInfoData.push(AttData);
		// 	AttTableModel.refresh(true);
		// },
		onAttachUpload: function (e) {
			this._oAttachDialog.close();
			var AttTableModel = this.getOwnerComponent().getModel("RemAttInfoModel");
			for (var oFiles = 0; oFiles <= this.file.length - 1; oFiles++) {
				
				if (this.file[oFiles].type == "" && (this.file[oFiles].name.indexOf(".oft") >= 0 || this.file[oFiles].name.indexOf(".msg") >= 0)) {
					var filetype = "application/octet-stream";
				}
				else{
					var filetype = this.file[oFiles].type
				}
				form_data.items.add(this.file[oFiles]);
				var AttData = {
					tile: this.file[oFiles].name,
					type: filetype,
					addedOn: new Date(),
					addedBy: oUserID,
					key: oFiles + 1,
					lastModified: this.file[oFiles].lastModified
				};
				AttTableModel.getData().AttInfoData.push(AttData);
			}
			AttTableModel.refresh(true);
			sap.ui.getCore().byId("idfileUploaderR").setPlaceholder();
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
			sap.ui.getCore().byId("idfileUploaderR").setButtonText("Please Choose");
			sap.ui.getCore().byId("idfileUploaderR").setPlaceholder();
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
				this._oAttachDialog = sap.ui.xmlfragment("com.new.prjt.znew_arm_prjt.fragment.AttachUploadRemove", this);
				this.getView().addDependent(this._oAttachDialog);
				sap.ui.getCore().byId("idfileUploaderR").setPlaceholder();
			}
			var oPlace = "Please Choose";
			sap.ui.getCore().byId("idfileUploaderR").setPlaceholder(oPlace);
			sap.ui.getCore().byId("idfileUploaderR").setValue("");
			this._oAttachDialog.open();
		},
		// _getRemAttachDialog: function() {
		// 	if (!this._oRemAttachDialog) {
		// 		this._oRemAttachDialog = sap.ui.xmlfragment("com.new.prjt.znew_arm_prjt.fragment.AttachUploadDialog", this);
		// 		this.getView().addDependent(this._oRemAttachDialog)
		// 	}
		// 	return this._oRemAttachDialog;
		// },
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
			var t = e.getSource().getBindingContext("RemAttInfoModel").getObject();
			var oRoleDateFromTable = this.getOwnerComponent().getModel("RemAttInfoModel").getData().AttInfoData;
			for (var o = 0; o < oRoleDateFromTable.length; o++) {
				if (oRoleDateFromTable[o] == t) {
					oRoleDateFromTable.splice(o, 1);
					var a = this.getView().getModel("RemAttInfoModel");
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
				this.byId("idRemEmpType").setValue('');
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
			var that = this;
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
				error: function (err) {}
			})
			//oModel1.read("/PersonnelSet(USER_ID='" + oUser + "',AD_ID='" + oUser + "')", {

			oModel1.read("/PersonnelSet(AD_ID='" + oUser + "')", {
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
						that.getView().byId("idNameRem").setText(data.FIRST_NAME + " " + data.LAST_NAME);
						if(data.PHONE == "" || data.PHONE.length<0){
							that.getView().byId("idRemMNumber").setEditable(true);
						}else{
							that.getView().byId("idRemMNumber").setEditable(false);
						}
					}
				}.bind(this),
				error: function (evt) {}
			});
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
			//oModel1.read("/PersonnelSet(USER_ID='" + oUser + "',AD_ID='" + oUser + "')", {
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
				error: function (evt) {}
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
				error: function (evt) {}
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
				error: function (evt) {}
			});
		},

		onBeforeRendering: function () {
			var oData = this.getOwnerComponent().getModel("navModel").getData();
			if (Object.keys(oData).length !== 0) {
				oUserID = oData.oResult.user_id;
			} else {
				this.handelLogOff();
			}
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
			var AttDataRem = {
				"AttInfoData": []
			};
			this.getOwnerComponent().getModel("RemAttInfoModel").setData(AttDataRem);
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
			//var comboUser = this.byId("idComboUser");
			var comboUser1 = this.byId("idComboUser1");
			//var comboUserMod = this.byId("idComboUserMod");
			//	var comboUserFF = this.byId("idComboUser2FF");
			var oModel2 = new sap.ui.model.json.JSONModel();
			var data = [];
			oModel2.setData(data);
			//	comboUser.setModel(oModel2);
			comboUser1.setModel(oModel2);
			//	comboUserMod.setModel(oModel2);
			//	comboUserFF.setModel(oModel2);
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
						//	comboUser.setModel(oModel1);
						comboUser1.setModel(oModel1);
						//	comboUserMod.setModel(oModel1);
						//	comboUserFF.setModel(oModel1);
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
			var path = parseInt(oEvent.getSource().getParent().getBindingContextPath().match(/\d/g).join('', ));
			that.TcodeModel = that.getOwnerComponent().getModel("TcodeModelMod");
			that.TcodeModel.getData().TcodeData[path].Connector = oEvent.getSource().getSelectedItem().getText();
			that.TcodeModel.refresh(true);
		},
		onChnageConnector: function (oEvent) {
			var that = this;
			var path = parseInt(oEvent.getSource().getParent().getBindingContextPath().match(/\d/g).join('', ));
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
				var path = parseInt(oEvent.getSource().getParent().getBindingContextPath().match(/\d/g).join('', ));
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
				var path = parseInt(oEvent.getSource().getParent().getBindingContextPath().match(/\d/g).join('', ));
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
		onSearchFromVal: function(oEvent){
			
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
			var  that = this;
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
			var oF4Table = this.getView().byId("idF4");
			//var aFilters = [];
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
			eve = eve.getSource().getParent().getItems()[0];
			this.onF4Click(oTable, inum, oObject);
			oModelName = "OrgTableModel";
		},
		onOrgFromMod: function (eve) {
			oObject = eve.getSource().getBindingContext("OrgTableModelMod").getObject();
			var oPath = eve.getSource().getBindingContext("OrgTableModelMod").getPath();
			var num = oPath.split("/");
			var inum = parseInt(num[2] + "<br>");
			var oTable = this.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData;
			eve = eve.getSource().getParent().getItems()[0];
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
			// for (var i = 0; i < oTable.length; i++) {
			// 	if (i > inum) {
			// 		break;
			// 	}
			// 	if (i === 0) {
			// 		aFilters.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, oTable[i].Conn));
			// 	}
			// 	if (i === inum) {
			// 		aFilters.push(new sap.ui.model.Filter("CUR_ORG", sap.ui.model.FilterOperator.EQ, "$" + oTable[i].OrgLevel + ""));
			// 	} else {
			// 		if (oObject.OrgLevel !== oTable[i].OrgLevel) {
			// 			aFilters.push(new sap.ui.model.Filter("PRE_ORG_VALUE", sap.ui.model.FilterOperator.EQ, "$" + oTable[i].OrgLevel + " = " +
			// 				oTable[i].FromOrg + ""));
			// 		}
			// 	}
			// };
			aFilters.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, oTable[inum].Conn));
					aFilters.push(new sap.ui.model.Filter("CUR_ORG", sap.ui.model.FilterOperator.EQ, "$" + oTable[inum].OrgLevel + ""));

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
				var index = parseInt(pathTable1.match(/\d/g).join('', ));
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
				var index = parseInt(pathTable1.match(/\d/g).join('', ));
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
				var index = parseInt(pathTable1.match(/\d/g).join('', ));
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
				var index = parseInt(pathTable1.match(/\d/g).join('', ));
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

		// onSubmitMod: function (Oevent) {
		// 	var textFlag = Oevent.getSource().getText();
		// 	if (textFlag === "Submit") {
		// 		this._onSubmitOrSaveMod("SUBMIT");
		// 	} else if (textFlag === "Save") {
		// 		this._onSubmitOrSaveMod("SAVE");
		// 	}
		// },
		// _onSubmitOrSaveMod: function (saveOrSubmit) {
		// 	this.showBusyIndicator();
		// 	var oFlagSavSub = saveOrSubmit;
		// 	var text = this.getView().byId("idModifyText").getValue();
		// 	var oModel = this.getView().getModel("grac");
		// 	var that = this;
		// 	that.flagM = oFlagSavSub;
		// 	var oUserInfoModel = this.getView().getModel("userInfo").getData();
		// 	oUserInfoModel.EMPTYPE = this.getView().byId("idemptypeMod").getSelectedKey();
		// 	var oSeleSysLandInfo = this.getOwnerComponent().getModel("SeleSysLandInfoMod").getData().sleSysLaData;
		// 	var SysLandInfo = [];
		// 	if (oSeleSysLandInfo.length !== 0) {
		// 		oSeleSysLandInfo.forEach((item, index) => {
		// 			var tdata = {
		// 				"USER_ID": oUserInfoModel.USER_ID,
		// 				"CONNECTOR": oSeleSysLandInfo[index].CONNECTOR,
		// 				"ENVIRONMENT": oSeleSysLandInfo[index].ENVIRONMENT,
		// 				"RFCDOC1": oSeleSysLandInfo[index].RFCDOC1
		// 			};
		// 			SysLandInfo.push(tdata);
		// 		});
		// 	}
		// 	//end of comments by varun
		// 	//add Tcode and Org values in the description
		// 	var tcode = "   TCODE: ";
		// 	tcode = tcode.concat(this.getView().byId("idTcodesListMod").getText());
		// 	text = text.concat(tcode);
		// 	var oOrgDataInfo = this.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData;
		// 	var OrgData = [];
		// 	if (oOrgDataInfo.length !== 0) {
		// 		oOrgDataInfo.forEach((item, index) => {
		// 			if (oOrgDataInfo[index].FromOrg !== '') {
		// 				var org = ", ORG_LEVEL : ";
		// 				text = text.concat(org);
		// 				text = text.concat(oOrgDataInfo[index].OrgLevel);
		// 				var val = ", FROM_VALUE: ";
		// 				text = text.concat(val);
		// 				text = text.concat(oOrgDataInfo[index].FromOrg)
		// 			}
		// 		});
		// 	}
		// 	var oRoleDateFromTable = this.getOwnerComponent().getModel("RoleInfoModelMod").getData().RolInfoData;
		// 	var RoleData = [];
		// 	if (oRoleDateFromTable.length !== 0) {
		// 		oRoleDateFromTable.forEach((item, index) => {
		// 			var Roldata = {
		// 				"CONNECTOR": oRoleDateFromTable[index].System,
		// 				"ROLE_NAME": oRoleDateFromTable[index].role,
		// 				"RFCDOC1": oRoleDateFromTable[index].sysDesc,
		// 				"ROLE_TYPE": oRoleDateFromTable[index].roleType,
		// 				"ROLE_DESCN": oRoleDateFromTable[index].sysDesc,
		// 				"PROV_ACTION": "006"
		// 			};
		// 			RoleData.push(Roldata);
		// 		});
		// 	}
		// 	var oPayload = {
		// 		"USER_ACTION": oFlagSavSub,
		// 		"IDENTIFIER": "NA",
		// 		"USER_ID": oUserInfoModel.USER_ID,
		// 		"FIRST_NAME": oUserInfoModel.FIRST_NAME,
		// 		"LAST_NAME": oUserInfoModel.LAST_NAME,
		// 		"EMPTYPE": oUserInfoModel.EMPTYPE,
		// 		"ZRMID": oUserInfoModel.ZRMID,
		// 		"ZEMPID": oUserInfoModel.ZEMPID,
		// 		"DEPARTMENT": oUserInfoModel.DEPARTMENT,
		// 		"PHONE": oUserInfoModel.PHONE,
		// 		"EMAIL": oUserInfoModel.EMAIL,
		// 		"NARSystemInformationSet": SysLandInfo,
		// 		"NARRoleInformationSet": RoleData,
		// 		"DESCRIPTION": text,
		// 		"BPROC": this.byId("cbBusinessProcessMod").getSelectedKey(),
		// 		"requester": oUserID
		// 	};
		// 	var params = [];
		// 	params["X-CSRF-Token"] = oModel.getSecurityToken();
		// 	params["X-CSRF-Token"] = csrf;
		// 	params["Content-Type"] = "application/json";
		// 	var slug = this.file.name;
		// 	var filetype = this.file.type;
		// 	var oCSRFToken = oModel.getSecurityToken();
		// 	var AttTableModel = this.getOwnerComponent().getModel("RemAttInfoModel");
		// 	var uploadata = AttTableModel.getData().AttInfoData
		// 	oModel.create('/NARUserInformationSet', oPayload, {
		// 		headers: params,
		// 		success: function (data) {
		// 			sap.ui.core.BusyIndicator.hide();
		// 			var mesg = "Your Request has been submitted successfully with request '" + data.STATUS + "'";
		// 			var mesg2 = "Your Request has been saved successfully."
		// 			var finalMesg = (that.flagM === "SAVE" ? mesg2 : mesg);
		// 			sap.ui.core.BusyIndicator.show();
		// 			sap.m.MessageBox.success(finalMesg);
		// 			//var sUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/NARUserInformationSet(USER_ID='" + data.STATUS + "')/AttachementsSet";
		// 			for (var md = 0; md < uploadata.length; md++) {
		// 				for (var fd = 0; fd < form_data.items.length; fd++) {
		// 					if (form_data.files[fd].name + form_data.files[fd].lastModified === uploadata[md].tile + uploadata[md].lastModified) {
		// 						var sUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/NARUserInformationSet(USER_ID='" + data.STATUS + "||"+ form_data.files[fd].name +"')/AttachementsSet";
		// 						$.ajax({
		// 							url: sUrl, // <-- point to server-side PHP script 
		// 							beforeSend: function (request) {
		// 								request.setRequestHeader("x-csrf-token", oModel.getSecurityToken());
		// 							},
		// 							cache: false,
		// 							contentType: false,
		// 							data: form_data.files[fd],
		// 							processData: false,
		// 							type: 'POST',
		// 							enctype: "multipart/form-data",
		// 							success: function () {
		// 								//alert(php_script_response); // <-- display response from the PHP script, if any
		// 							}
		// 						});
		// 					}
		// 				}
		// 			}
		// 			var AttDataRem = {
		// 				"AttInfoData": []
		// 			};
		// 			that.getOwnerComponent().getModel("RemAttInfoModel").setData(AttDataRem);
		// 			that.handleUploadCompleteMod(that.flagM);
		// 			that.hideBusyIndicator();
					
		// 		},
		// 		error: function (data) {
		// 			sap.ui.core.BusyIndicator.hide();
		// 			if (JSON.parse(data.responseText)) {
		// 				sap.m.MessageBox.error("Modify request unsuccessful'" + JSON.parse(data.responseText).error.message.value + "'");
		// 			} else {
		// 				sap.m.MessageBox.error("Modify request unsuccessful");
		// 			}
		// 			that.hideBusyIndicator()
		// 		}
		// 	});
		// },

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
				var index = parseInt(pathTable1.match(/\d/g).join('', ));
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
				var index = parseInt(pathTable1.match(/\d/g).join('', ));
				oModelTable1.getData().sleSysLaData.splice(index, 1);
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
			//var slug = this.file.name;
			//var filetype = this.file.type;
			var oCSRFToken = oModel.getSecurityToken();
			var AttTableModel = this.getOwnerComponent().getModel("RemAttInfoModel");
			var uploadata = AttTableModel.getData().AttInfoData
			oModel.create('/NARUserInformationSet', oPayload, {
				headers: params,
				success: function (data) {
					var mesg = "Your Request has been submitted successfully with request '" + data.STATUS + "'";
					var mesg2 = "Your Request has been saved successfully."
					var finalMesg = (that.flagM === "SAVE" ? mesg2 : mesg);
					sap.ui.core.BusyIndicator.show();
					sap.m.MessageBox.success(finalMesg);
					var oFileUploader = sap.ui.getCore().byId("idRemfileUploader1");
					// if(oFileUploader !== undefined){
					// 	oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
					// 		name: "x-csrf-token",
					// 		value: oModel.getSecurityToken()
					// 	}));
					// 	var sUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/NARUserInformationSet(USER_ID='" + data.STATUS + "')/AttachementsSet";
					// 	oFileUploader.setUploadUrl(sUrl);
					// 	oFileUploader.setSendXHR(true);
					// 	oFileUploader.upload();
					// }

					//var sUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/NARUserInformationSet(USER_ID='" + data.STATUS + "')/AttachementsSet";
					for (var md = 0; md < uploadata.length; md++) {
						for (var fd = 0; fd < form_data.items.length; fd++) {
							if (form_data.files[fd].name + form_data.files[fd].lastModified === uploadata[md].tile + uploadata[md].lastModified) {
								var sUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/NARUserInformationSet(USER_ID='" + data.STATUS + "||"+ form_data.files[fd].name +"')/AttachementsSet";
								$.ajax({
									url: sUrl, // <-- point to server-side PHP script 
									beforeSend: function (request) {
										request.setRequestHeader("x-csrf-token", oModel.getSecurityToken());
									},
									cache: false,
									contentType: false,
									data: form_data.files[fd],
									processData: false,
									type: 'POST',
									enctype: "multipart/form-data",
									success: function () {
										//alert(php_script_response); // <-- display response from the PHP script, if any
									}
								});
							}
						}
					}
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
		handleUploadComplete: function (flagM) {
			sap.ui.core.BusyIndicator.hide();
			var oFileUploader = sap.ui.getCore().byId("idRemfileUploader1");
			if (oFileUploader !== undefined) {
				oFileUploader.setValue("");
				sap.m.MessageToast.show("File Uploaded");
			}
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
				.then(function () {})
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
					} else {}
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
					} else {}
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
			sap.ui.getCore().getEventBus().publish(
				"Dashboard",
				"CallDashboard",
				"Move to myAccess Page"
			);
			// var oItem = this.getView().byId("toolPage").getSideContent().mAggregations.item.getItems()[0];
			// this.getView().byId("toolPage").getSideContent().setSelectedItem(oItem);
			// this._selectedReqKey = "myAccess";
			// this.onItemSelect(oItem);
		},

		onUserSearch: function (oEvent) {
			var aFilters = [];
			var user = this.getView().byId("idUser").getValue();
			var FilterOperator = ""
			if (user !== "") {
				if (user.includes('*')) {
					const iCountWildcard = [...user].filter(sChar => sChar === '*').length;
					if (iCountWildcard > 1) {
						FilterOperator = sap.ui.model.FilterOperator.Contains;
					}
					else {
						if (user.indexOf('*') === 0) {
							FilterOperator = sap.ui.model.FilterOperator.EndsWith
						};
						if (user.lastIndexOf('*') === user.length - 1) {
							FilterOperator = sap.ui.model.FilterOperator.StartsWith;
						}
					}
					user = user.replaceAll('*', '');
				}
				else {
					FilterOperator = sap.ui.model.FilterOperator.StartsWith
				}

				aFilters.push(new sap.ui.model.Filter("BNAME", FilterOperator, user));

			}
			var fname = this.getView().byId("idFname").getValue();
			if (fname !== "") {
				if (fname.includes('*')) {
					const iCountWildcard = [...fname].filter(sChar => sChar === '*').length;
					if (iCountWildcard > 1) {
						FilterOperator = sap.ui.model.FilterOperator.Contains;
					}
					else {
						if (fname.indexOf('*') === 0) {
							FilterOperator = sap.ui.model.FilterOperator.EndsWith
						};
						if (fname.lastIndexOf('*') === fname.length - 1) {
							FilterOperator = sap.ui.model.FilterOperator.StartsWith;
						}
					}
					fname = fname.replaceAll('*', '');
				}
				else {
					FilterOperator = sap.ui.model.FilterOperator.StartsWith
				}

				aFilters.push(new sap.ui.model.Filter("FNAME", FilterOperator, fname));
			}

			var lname = this.getView().byId("idLname").getValue();
			if (lname !== "") {
				if (lname.includes('*')) {
					const iCountWildcard = [...lname].filter(sChar => sChar === '*').length;
					if (iCountWildcard > 1) {
						FilterOperator = sap.ui.model.FilterOperator.Contains;
					}
					else {
						if (lname.indexOf('*') === 0) {
							FilterOperator = sap.ui.model.FilterOperator.EndsWith
						};
						if (lname.lastIndexOf('*') === lname.length - 1) {
							FilterOperator = sap.ui.model.FilterOperator.StartsWith;
						}
					}
					lname = lname.replaceAll('*', '');
				}
				else {
					FilterOperator = sap.ui.model.FilterOperator.StartsWith
				}

				aFilters.push(new sap.ui.model.Filter("LNAME", FilterOperator, lname));
			}
			var oModel1 = this.getView().getModel("grac");
			var finalFilter = new sap.ui.model.Filter({
				filters: aFilters,
				and: true, //and:true - changed by Prasanth on 20-06-2024(previously and:false)
			  });
			sap.ui.core.BusyIndicator.show();
			var that = this;
			oModel1.read("/F4_Exit_UserSet", {
				filters: [finalFilter],
				success: function (data) {
					sap.ui.core.BusyIndicator.hide();
					that.getView().getModel("UsersList").setData(data.results);
					that.getView().getModel("UsersList").refresh();
				}.bind(this),
				error: function (evt) {
					sap.ui.core.BusyIndicator.hide();
					var data= {results:[]};
					that.getView().getModel("UsersList").setData(data);
					that.getView().getModel("UsersList").refresh();
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
		handleLiveChange:function(e){
			var regEx,erroeTxt;
				if(e.getSource().getName() =="AlphaNum"){
					regEx = /^[0-9a-zA-Z]+$/;
					erroeTxt = 'Only Alpha Numeric Allowed'
				}else if(e.getSource().getName()==="Email"){
					 regEx= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
					 erroeTxt = 'Special characters not allowed'
				}else if(e.getSource().getName() ==="CharOnly"){
					regEx=/^[A-Za-z]+$/
					erroeTxt = 'Only characters allowed'
				}
				var sValue = e.getSource().getValue();
				e.getSource().setValueState('None');
					if(!regEx.test(sValue)){
						e.getSource().setValueState('Error');
						e.getSource().setValueStateText(erroeTxt);
						e.getSource().setValue("");
						return
					}else{
					e.getSource().setValueState(sap.ui.core.ValueState.Success)
					}
		}
	})
});