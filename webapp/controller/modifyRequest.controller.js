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
	var oFiles = [];
	var form_data = new DataTransfer();
	var SortOrder = library.SortOrder;
	var that = this;
	return e.extend("com.new.prjt.znew_arm_prjt.controller.modifyRequest", {
		formatter: formatter,
		_data: {
			"date": new Date()
		},

		someFunctionOfTheFirstController: function (sChannelId, sEventId, sData) {
			form_data.items['clear'];
			form_data.clearData();
			this.byId("SlUserRef").setSelectedKey("");
			this._clearModifyRequest();
			this.getOwnerComponent().getModel("OrgTableModelMod").setProperty("/OrgData", []);
			this.getOwnerComponent().getModel("TcodeModelMod").setProperty("/TcodeData", []);
			this.onSelectModifierA("Self");
		},
		onInit: function () {
			sap.ui.getCore().getEventBus().subscribe(
				"modifyRequest",
				"SomeEvent",
				this.someFunctionOfTheFirstController,
				this
			);
			this.getView().setModel(new sap.ui.model.json.JSONModel({ hasCICO: false }), "CICOModel");
			var oProfileModel = new sap.ui.model.json.JSONModel({
				items: []
			});
			this.getView().setModel(oProfileModel, "ProfileModel");


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
			//var oUserID = that.getOwnerComponent().getModel("navModel").getData().oResult.user_id;
			var IDLE_TIMEOUT = 3600; //seconds
			var _idleSecondsTimer = null;
			var _idleSecondsCounter = 0;
			document.onclick = function () {
				_idleSecondsCounter = 0;
			};
			window.onbeforeunload = function () { };
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
					Visible: false
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
			}, {
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
		onExit: function () {
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

		onNextStepModify: function (e) {
			var onNext = e.getSource().getText();
			if (onNext === "Next:System/Landscape Information") {
				var aElementID = ["idModifyText", "fanemMod", "lnameMod", "managerIDMod", "idemailMod"];
				// IDMObMod  Removed As Requested  19/01/2023 
				var oElementID_SelectDrop = ["cbBusinessProcessMod", "idemptypeMod"];
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
				var that = this;
				that.getView().byId("tableMod1").removeSelections();
				var oModelCom = that.getView().getModel('grac');
				this.getView().byId("tableMod1").getModel("SysLandInfoMod").setProperty("/SysLaData", []);
				this.getView().byId("table2Mod").getModel("SeleSysLandInfoMod").setProperty("/sleSysLaData", []);
				sap.ui.core.BusyIndicator.show(300);
				var oModUser = this.byId("idComboUserMod").getValue("");
				var aFilter = [];
				var oSelectedRFCDESTKey;
				aFilter.push(new sap.ui.model.Filter("ACTION", sap.ui.model.FilterOperator.EQ, "UU"));
				aFilter.push(new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.EQ, oModUser));
				oModelCom.read("/NARSystemInformationSet", {
					filters: aFilter,
					success: function (data) {
						if (data.results.length === 0) {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageBox.error('System/Landscape  Information is Avilable.');
							return;
						} else {
							for (var i = 0; i < data.results.length; i++) {
								var oSystemModelData = {
									CONNECTOR: data.results[i].CONNECTOR,
									ENVIRONMENT: data.results[i].ENVIRONMENT,
									RFCDOC1: data.results[i].RFCDOC1,
									key: i + 1
								};
								if (data.results[i].CONNECTOR == oRFCDEST) {
									oSelectedRFCDESTKey = i;
								}
								that.getOwnerComponent().getModel("SysLandInfoMod").getData().SysLaData.push(oSystemModelData);
							}
							that.getOwnerComponent().getModel("SysLandInfoMod").refresh(true);
							if (data.results.length === 1) {
								that.getView().byId("tableMod1").selectAll();
							}
							// if (oRFCDEST != undefined) {
							// 	var oID = that.getView().byId("tableMod1").getItems()[oSelectedRFCDESTKey].sId;
							// }
							sap.ui.core.BusyIndicator.hide();
							that.byId("CreateProductWizard11").nextStep();
							that.byId("idNewButTcodeInfoMod").setVisible(true);
							e.getSource().setVisible(false)
							return;
						}
					},
					error: function (event) {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageBox.error('No Systems Available');
						return;
					}
				});
			}
			if (onNext === "Next:Transaction code Information") {
				this.getOwnerComponent().getModel("TcodeModelMod").setProperty("/TcodeData", []);
				var aTcodeData = [];
				var aSelectedContexts = this.getView().byId("tableMod1").getSelectedContexts();
				var aSelectedRecords = [];
				if (aSelectedContexts.length > 0) {
					aSelectedContexts.forEach(function (oContext) {
						aSelectedRecords.push(oContext.getObject());
						//building array to bind to Transaction Code Information Table
						aTcodeData.push({
							"ACTION_ID": "",
							"Connector": oContext.getObject().CONNECTOR,
							"Tcode": "",
							"TcodeDesc": ""
						});
					});
					this.getOwnerComponent().getModel("SeleSysLandInfoMod").setProperty("/sleSysLaData", aSelectedRecords);
					this.getOwnerComponent().getModel("SeleSysLandInfoMod").refresh(true);
					this.getOwnerComponent().getModel("TcodeModelMod").setProperty("/TcodeData", aTcodeData);
					this.getOwnerComponent().getModel("TcodeModelMod").refresh(true);
					this.byId("CreateProductWizard11").nextStep();
					this.byId("idNewOrgNextMod").setVisible(true);
					e.getSource().setVisible(false);
					this._bIsNavigatedToStep3Mod = true;
					return;
				} else {
					sap.m.MessageBox.error('Please select at least one System.');
					return;
				}
			}
			if (onNext === "Next:Organization value Information") {
				debugger
				var TcodeInfo = [];
				var that = this;
				var TcodeModel = that.getOwnerComponent().getModel("TcodeModelMod").getData().TcodeData;
				var aSelTCodeData = that.getOwnerComponent().getModel("SeleSysLandInfoMod").getProperty("/sleSysLaData");
				var bNavToNextStep = true;
				aSelTCodeData.forEach(function (item, index) {
					var tmpArray = TcodeModel.filter(function (oRecord) {
						return (oRecord.Connector === item.CONNECTOR);
					});
					bNavToNextStep = tmpArray.length === 0 ? false : true;
				});
				// TcodeModel.forEach((item, index) => {
				// 	if (item.Tcode === "") {
				// 		bNavToNextStep = false;
				// 	}
				// });
				if (!bNavToNextStep) {
					sap.m.MessageBox.error("Please maintain Transaction Code for all the Systems.");
					return false;
				}
				if (!this.validateTcodeData()) {
					sap.m.MessageBox.error("Please maintain Transaction Code for all the Systems.");
					return false;
				}

				// Start changes by RIYA
				// var hasCICO = TcodeModel.some(function (item) {
				// 	return item.CICO_IND && item.CICO_IND.toUpperCase() === "X";
				// });
				// this.getView().getModel("CICOModel").setProperty("/hasCICO", hasCICO);
				// End changes by RIYA
				this.byId("CreateProductWizard11").nextStep();
				this.byId("idNewRoleNextMod").setVisible(true);
				e.getSource().setVisible(false);
				this._FlageOrgCheck = true;
				this.getView().byId("tblExcelDatfa134tg").getModel("OrgTableModelMod").setProperty("/OrgData", []);
				if (TcodeModel.length !== 0) {
					tcode = "";
					TcodeModel.forEach((item, index) => {
						var tdata = {
							"TCODE": TcodeModel[index].Tcode,
							"CONNECTOR": TcodeModel[index].Connector
						};
						TcodeInfo.push(tdata);
						if (tcode.indexOf(TcodeModel[index].Tcode) < 0) {
							if (tcode.length !== 0) {
								tcode = tcode + "," + TcodeModel[index].Tcode;
							} else {
								tcode = TcodeModel[index].Tcode;
							}
						}
					});
					this.getView().byId("idTcodesListMod").setText(tcode);
					var oPayload = {
						"USER_ACTION": "ROLE",
						"NARRoleInformationSet": TcodeInfo
					};
					sap.ui.core.BusyIndicator.show(300);
					var OrgTableModel = that.getOwnerComponent().getModel("OrgTableModelMod");
					//var oModel = that.getView().getModel('grac');
					var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/?saml2=disabled", true);
					//sap.ui.model.odata.v2.ODataModel
					var params = [];
					var GUID;
					// params["X-CSRF-Token"] = oModel.getSecurityToken();
					// params["X-CSRF-Token"] =this._getSecurityTokenAjax();
					params["X-CSRF-Token"] = that.getOwnerComponent().getModel("userLogin").getSecurityToken();


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
											sap.ui.core.BusyIndicator.hide();
											sap.m.MessageBox.error('The Org Value is not Available for these Tcodes.');
											return;
										} else {
											var orgValue = OrgTableModel.getData().OrgData;
											data1.results.forEach(element => {
												if (element.VTEXT !== "") {

													var existingOrg = orgValue.find(item => item.OrgVal === element.VTEXT && item.Tcode === element.ACTION && item.FromOrg !== "*");
													var existingCon = orgValue.find(item => item.Conn.indexOf(element.CONNECTOR) >= 0 && item.OrgVal === element.VTEXT && item.FromOrg !== "*")
													//var CementSyatems = ["TSDCLNT100","TGDCLNT100"]
													if (element.IND == "X") {
														var newOrgData = {
															OrgLevel: element.FIELDNAME,
															OrgVal: element.VTEXT,
															Tcode: element.ACTION,
															FromOrg: "*", //neData.VALUE_FROM,
															ToOrg: "",
															Conn: element.CONNECTOR,
															priority: element.PRIORITY,
															FromOrgValueHelp: false,
															FromOrgValueAdd: false,
															Profile: "",
															SubProfile: "",
															SubProfiles: []
														};
														orgValue.push(newOrgData);
													}
													else if (existingOrg) {
														if (existingOrg.Conn.indexOf(element.CONNECTOR) < 0) {
															existingOrg.Conn = existingOrg.Conn + "," + element.CONNECTOR
														}
													}
													else if (existingCon) {
														if (existingCon.Tcode.indexOf(element.ACTION) < 0) {
															existingCon.Tcode = existingCon.Tcode + "," + element.ACTION
														}
													}
													else {
														var newOrgData = {
															OrgLevel: element.FIELDNAME,
															OrgVal: element.VTEXT,
															Tcode: element.ACTION,
															FromOrg: "", //neData.VALUE_FROM,
															ToOrg: "",
															Conn: element.CONNECTOR,
															priority: element.PRIORITY,
															Profile: "",
															SubProfile: "",
															SubProfiles: []
														};
														orgValue.push(newOrgData);
													}
												}

											});
											OrgTableModel.getData().OrgData = orgValue;
											OrgTableModel.refresh(true);
											sap.ui.core.BusyIndicator.hide();
											that._BackendTableDataBackUp();
										}
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
				}
			}
			if (onNext === "Next:Role Information") {
				//Clear the table data
				this.getView().byId("idRoleTableMod").getModel("RoleInfoModelMod").setProperty("/RolInfoData", []);
				var OrgTableModel = this.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgDataNormal;
				if (OrgTableModel.length !== 0) {
					OrgTableModel.forEach((item, index) => {
						var orgdata = {
							"TCODE": OrgTableModel[index].Tcode,
							"PRIORITY": "" + OrgTableModel[index].priority + "",
							"ORG_LEVEL": "$" + OrgTableModel[index].OrgLevel + "(" + OrgTableModel[index].Tcode + ")" + "",
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
					sap.ui.core.BusyIndicator.show(300);
					var RoleTableModel = this.getOwnerComponent().getModel("RoleInfoModelMod");
					var oModel = this.getView().getModel('grac');
					var params = [];
					var GUID;
					// params["X-CSRF-Token"] = oModel.getSecurityToken();
					// params["X-CSRF-Token"] = this._getSecurityTokenAjax();
					params["X-CSRF-Token"] = that.getOwnerComponent().getModel("userLogin").getSecurityToken();
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
											sap.ui.core.BusyIndicator.hide();
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
												sap.ui.core.BusyIndicator.hide();
											}
										}
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
				this.byId("CreateProductWizard11").nextStep();
				this.byId("idNewRoleSubNextMod").setVisible(true);
				e.getSource().setVisible(false)
				return;
			}
			if (onNext === "Next:Risk Analysis") {
				this.byId("CreateProductWizard11").nextStep();
				e.getSource().setVisible(false);
				return;
			}
			if (onNext === "Next:Attachments") {
				if (!this.validateTcodeData()) {
					this.hideBusyIndicator()
					sap.m.MessageBox.error("Please maintain Transaction Code for all the Systems.");
					return false

				}
				var errors = [];
				var orgData = this.getOwnerComponent().getModel("OrgTableModelMod").getProperty("/OrgData");
				var orgItems = this.getView().byId("tblExcelDatfa134tg").getItems();
				for (var j = 0; j < orgData.length; j++) {
					if (
						orgData[j].FromOrg == ""
					) {
						//orgItems[j].getCells()[3].getItems()[0].setEditable(true).setValueState("Error");
						errors.push([j])
					}
				}
				if (errors.length > 0) {
					return false;
				} else {
					var AttDataRem = {
						"AttInfoData": []
					};
					this.getOwnerComponent().getModel("AttInfoModelMod").setData(AttDataRem);
					this.byId("CreateProductWizard11").nextStep();
					this.byId("idNextReqSubMod").setVisible(true);
					e.getSource().setVisible(false);
					return;
				}
			}
			if (onNext === "Next:Request Submission") {
				this.byId("CreateProductWizard11").nextStep();
				e.getSource().setVisible(false);
				this._onRefreshRequestSubmission();
				return;
			}
			if (onNext === "Refresh Request Submission") {
				this._onRefreshRequestSubmission();
			}
		},
		_onRefreshRequestSubmission: function () {
			this.byId("txtFnameReviewRequestMod").setText(this.byId("fanemMod").getValue());
			this.byId("txtLnameReviewRequestMod").setText(this.byId("lnameMod").getValue());
			//this.byId("idComboUserMod").setText(this.byId("SlUserRef").getSelectedItem().getText());
			var that = this;
			var TcodeInfo = [];
			var TcodeModel = that.getOwnerComponent().getModel("TcodeModelMod").getData().TcodeData;
			// var hasCICO = TcodeModel.some(function (item) {
			// 	return item.CICO_IND && item.CICO_IND.toUpperCase() === "X";
			// });
			// this.getView().getModel("CICOModel").setProperty("/hasCICO", hasCICO);

			if (TcodeModel.length !== 0) {
				tcode = "";
				TcodeModel.forEach((item, index) => {
					if (tcode.indexOf(TcodeModel[index].Tcode) <= 0) {
						var tdata = {
							"TCODE": TcodeModel[index].Tcode,
							"CONNECTOR": TcodeModel[index].Connector
						};
						TcodeInfo.push(tdata);
						//Get the Tcode List
						if (tcode.length !== 0) {
							tcode = tcode + "," + TcodeModel[index].Tcode;
						} else {
							tcode = TcodeModel[index].Tcode;
						}
					}
				});
				this.getView().byId("idTcodesListMod").setText(tcode);
			}
			return;
		},

		onProfileF4Help: function (oEvent) {
			var oInput = oEvent.getSource();
			var oContext = oInput.getBindingContext("OrgTableModelMod");
			if (!oContext) return;

			this._oProfileRowContext = oContext;

			var sConnector = oContext.getProperty("Conn");
			var sTcode = oContext.getProperty("Tcode");

			console.log("Selected Row Data:", {
				System: sConnector,
				Tcode: sTcode
			});


			var sServiceUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/";
			var oODataModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, { json: true });


			var sUrl = "/get_profileSet?$format=json&$filter=" +
				"CONNECTOR eq '" + sConnector + "' and TCODE eq '" + sTcode + "'";


			oODataModel.read(sUrl, {
				success: function (oData) {
					var aProfiles = oData.results || oData.d?.results || [];
					console.log("OData Profiles:", aProfiles);


					var oProfileModel = this.getView().getModel("ProfileModel");
					oProfileModel.setProperty("/items", aProfiles);


					if (!this._oProfileVH) {
						this._oProfileVH = sap.ui.xmlfragment(
							"com.new.prjt.znew_arm_prjt.fragment.ProfileValueHelp",
							this
						);
						this.getView().addDependent(this._oProfileVH);
					}


					var oBinding = this._oProfileVH.getBinding("items");
					if (oBinding) oBinding.filter([]);


					this._oProfileVH.open();

				}.bind(this),
				error: function (oError) {
					console.error("OData error response:", oError);
				}
			});
		},

		onProfileVHSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oBinding = oEvent.getSource().getBinding("items");
			if (!oBinding) return;

			var oFilter = new Filter({
				path: "PROFILE",
				operator: FilterOperator.Contains,
				value1: sValue
			});

			oBinding.filter([oFilter]);
		},

		onProfileVHLiveChange: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oBinding = oEvent.getSource().getBinding("items");
			if (!oBinding) return;

			var oFilter = new Filter({
				path: "PROFILE",
				operator: FilterOperator.Contains,
				value1: sValue
			});

			oBinding.filter([oFilter]);
		},

		onProfileVHConfirm: function (oEvent) {
			var aSelectedItems = oEvent.getParameter("selectedItems") || [];
			if (!aSelectedItems.length || !this._oProfileRowContext) return;

			var oModel = this._oProfileRowContext.getModel();
			var aOldData = oModel.getProperty("/OrgDataCICO") || oModel.getProperty("/OrgData") || [];

			var sPath = this._oProfileRowContext.getPath();
			var iIndex = parseInt(sPath.split("/").pop(), 10);

			var aProfiles = aSelectedItems.map(function (oItem) {
				return oItem.getTitle();
			});

			var oOriginalRow = Object.assign({}, aOldData[iIndex]);


			var bWasNew = (oOriginalRow.isNew === true);

			var aNewData = [];


			for (var i = 0; i < iIndex; i++) {
				aNewData.push(aOldData[i]);
			}


			aNewData.push(Object.assign({}, oOriginalRow, {
				Profile: aProfiles[0],
				Editable: true,
				SubProfileEditable: true,
				isNew: bWasNew
			}));


			for (var j = 1; j < aProfiles.length; j++) {
				aNewData.push(Object.assign({}, oOriginalRow, {
					Profile: aProfiles[j],
					SubProfile: "",
					DESIGNTION: "",
					Editable: true,
					SubProfileEditable: true,
					isNew: true
				}));
			}


			for (var k = iIndex + 1; k < aOldData.length; k++) {
				aNewData.push(aOldData[k]);
			}


			if (sPath.indexOf("/OrgDataCICO") === 0) {
				oModel.setProperty("/OrgDataCICO", aNewData);
			} else {
				oModel.setProperty("/OrgData", aNewData);
			}
			oModel.refresh(true);
		},



		onSubProfileVH: function (oEvent) {
			var oInput = oEvent.getSource();
			var oContext = oInput.getBindingContext("OrgTableModelMod");
			if (!oContext) return;

			this._oProfileRowContext = oContext;

			var sConnector = oContext.getProperty("Conn");
			var sTcode = oContext.getProperty("Tcode");
			var sProfile = oContext.getObject().Profile;

			sConnector = (sConnector || "").trim();
			sTcode = (sTcode || "").trim();
			sProfile = (sProfile || "").trim();


			var oProfileModel = this.getView().getModel("ProfileModel");
			if (oProfileModel) {
				oProfileModel.setProperty("/oSubProfiles", []);
			}

			if (this._oSubProfileVH) {

				if (this._oSubProfileVH.removeSelections) {
					this._oSubProfileVH.removeSelections(true);
				}
				if (this._oSubProfileVH.setSelectedItem) {
					this._oSubProfileVH.setSelectedItem(null);
				}


				if (this._oSubProfileVH.getSubHeader && this._oSubProfileVH.getSubHeader()) {
					var aContent = this._oSubProfileVH.getSubHeader().getContent();
					aContent && aContent.forEach(function (c) {
						if (c.setValue) c.setValue("");
					});
				}
			}


			var sServiceUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/";
			var oODataModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, { json: true });

			var aFilters = [
				new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, sConnector),
				new sap.ui.model.Filter("TCODE", sap.ui.model.FilterOperator.EQ, sTcode),
				new sap.ui.model.Filter("PROFILE", sap.ui.model.FilterOperator.EQ, sProfile)
			];

			var that = this;

			oODataModel.read("/GET_SUB_PROFILESet", {
				filters: aFilters,
				urlParameters: { "$format": "json" },

				success: function (oData) {

					var aResults = (oData && oData.results) ? oData.results
						: (oData && oData.d && oData.d.results) ? oData.d.results
							: [];


					var aSubProfiles = aResults
						.map(function (oItem) {
							return (oItem && oItem.SUB_PROFILE) ? String(oItem.SUB_PROFILE).trim() : "";
						})
						.filter(function (s) { return s !== ""; })
						.map(function (s) { return { SUB_PROFILE: s }; });


					if (aSubProfiles.length === 0) {

						var oPM = that.getView().getModel("ProfileModel");
						if (oPM) {
							oPM.setProperty("/oSubProfiles", []);
						}
						sap.m.MessageToast.show("No Sub-Profile available for this Profile.");
						return;
					}

					var oProfileModel2 = that.getView().getModel("ProfileModel");
					if (!oProfileModel2) {
						oProfileModel2 = new sap.ui.model.json.JSONModel({ oSubProfiles: [] });
						that.getView().setModel(oProfileModel2, "ProfileModel");
					}

					oProfileModel2.setProperty("/oSubProfiles", aSubProfiles);


					if (!that._oSubProfileVH) {
						that._oSubProfileVH = sap.ui.xmlfragment(
							"com.new.prjt.znew_arm_prjt.fragment.SubProfileVH",
							that
						);
						that.getView().addDependent(that._oSubProfileVH);
					}


					if (that._oSubProfileVH.removeSelections) {
						that._oSubProfileVH.removeSelections(true);
					}
					if (that._oSubProfileVH.setSelectedItem) {
						that._oSubProfileVH.setSelectedItem(null);
					}


					var oBinding = that._oSubProfileVH.getBinding("items");
					if (oBinding) oBinding.filter([]);

					that._oSubProfileVH.open();
				},

				error: function (oError) {
					console.error("=== OData Error ===", oError);
					sap.m.MessageToast.show("Error loading sub-profiles: No data found");
				}
			});
		},

		onDesignationVH: function (oEvent) {
			var oInput = oEvent.getSource();
			var oContext = oInput.getBindingContext("OrgTableModelMod");
			if (!oContext) return;

			this._oDesignationRowContext = oContext;


			var oDesModel = this.getView().getModel("DesignationModel");
			if (!oDesModel) {
				oDesModel = new sap.ui.model.json.JSONModel({ designations: [] });
				this.getView().setModel(oDesModel, "DesignationModel");
			}
			oDesModel.setProperty("/designations", []);


			if (!this._oDesignationVH) {
				this._oDesignationVH = sap.ui.xmlfragment(
					"com.new.prjt.znew_arm_prjt.fragment.DesignationVH",
					this
				);
				this.getView().addDependent(this._oDesignationVH);
			}


			if (this._oDesignationVH.removeSelections) {
				this._oDesignationVH.removeSelections(true);
			}

			var sServiceUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/";
			var oODataModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, { json: true });

			var that = this;
			oODataModel.read("/Get_DesignationSet", {
				urlParameters: { "$format": "json" },
				success: function (oData) {
					var aResults = (oData && oData.results) ? oData.results
						: (oData && oData.d && oData.d.results) ? oData.d.results
							: [];

					if (!aResults.length) {
						sap.m.MessageToast.show("No Designations found");
						return;
					}

					oDesModel.setProperty("/designations", aResults);
					that._oDesignationVH.open();
				},
				error: function () {
					sap.m.MessageToast.show("Error loading Designations");
				}
			});
		},

		onAddCICORow: function () {
			var oModel = this.getOwnerComponent().getModel("OrgTableModelMod");
			var aCICO = oModel.getProperty("/OrgDataCICO") || [];

			var sConn = aCICO.length ? aCICO[0].Conn : "";
			var sTcode = aCICO.length ? aCICO[0].Tcode : "CICO";

			aCICO.push({
				Conn: sConn,
				Tcode: sTcode,
				Profile: "",
				SubProfile: "",
				DESIGNTION: "",
				Editable: true,
				CICO_IND: "X",
				isNew: true
			});

			oModel.setProperty("/OrgDataCICO", aCICO);

			var aNormal = oModel.getProperty("/OrgDataNormal") || [];
			oModel.setProperty("/OrgData", aNormal.concat(aCICO));

			oModel.refresh(true);
		},


		onDeleteCICORow: function (oEvent) {
			var oItem = oEvent.getSource().getParent();
			var oCtx = oItem.getBindingContext("OrgTableModelMod");
			if (!oCtx) return;
			var sPath = oCtx.getPath();
			var iIndex = parseInt(sPath.split("/").pop(), 10);
			var oModel = this.getOwnerComponent().getModel("OrgTableModelMod");
			var aCICO = oModel.getProperty("/OrgDataCICO") || [];
			if (isNaN(iIndex) || iIndex < 0 || iIndex >= aCICO.length) return;
			aCICO.splice(iIndex, 1);
			oModel.setProperty("/OrgDataCICO", aCICO);
			var aNormal = oModel.getProperty("/OrgDataNormal") || [];
			oModel.setProperty("/OrgData", aNormal.concat(aCICO));

			oModel.refresh(true);
		},






		// onUploadMROrgCICO: function (oEvent) {
		// 	var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
		// 	if (!file || !window.FileReader) return;

		// 	var that = this;
		// 	var reader = new FileReader();

		// 	reader.onload = function (e) {
		// 		var data = e.target.result;
		// 		var workbook = XLSX.read(data, { type: "binary" });

		// 		var excelData = [];
		// 		workbook.SheetNames.forEach(function (sheetName) {
		// 			excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		// 		});

		// 		var oOrgModel = that.getOwnerComponent().getModel("OrgTableModelMod");
		// 		var aExistingCICO = oOrgModel.getProperty("/OrgDataCICO") || [];


		// 		var aTcodes = that.getOwnerComponent().getModel("TcodeModelMod").getProperty("/TcodeData") || [];
		// 		var mCicoAllowed = {};
		// 		aTcodes.forEach(function (t) {
		// 			var conn = (t.Connector || "").trim().toUpperCase();
		// 			var tc = (t.Tcode || "").trim().toUpperCase();
		// 			var isC = (t.CICO_IND || "").trim().toUpperCase() === "X";
		// 			if (conn && tc && isC) mCicoAllowed[conn + "|" + tc] = true;
		// 		});


		// 		var aNewRows = [];

		// 		excelData.forEach(function (row) {
		// 			var sConn = ((row["System"] || "") + "").trim().toUpperCase();
		// 			var sTcod = ((row["Tcode"] || "") + "").trim().toUpperCase();


		// 			var sProf = ((row["Profile"] || "") + "").trim();
		// 			var sSub = ((row["Sub-Profile"] || row["SubProfile"] || "") + "").trim();
		// 			var sDes = ((row["Designation"] || row["DESIGNTION"] || "") + "").trim();

		// 			if (!sConn || !sTcod) return;


		// 			if (!mCicoAllowed[sConn + "|" + sTcod]) return;

		// 			aNewRows.push({
		// 				Conn: sConn,
		// 				Tcode: sTcod,
		// 				Profile: sProf,
		// 				SubProfile: sSub,
		// 				DESIGNTION: sDes,
		// 				Editable: true,
		// 				CICO_IND: "X",
		// 				isNew: true
		// 			});
		// 		});

		// 		if (!aNewRows.length) {
		// 			sap.m.MessageToast.show("No valid CICO rows found in upload file.");
		// 			return;
		// 		}


		// 		var aMerged = aExistingCICO.slice();

		// 		aNewRows.forEach(function (r) {
		// 			var sConn = (r.Conn || "").trim().toUpperCase();
		// 			var sTcod = (r.Tcode || "").trim().toUpperCase();
		// 			var sProf = (r.Profile || "").trim();


		// 			var idxExact = aMerged.findIndex(function (x) {
		// 				return ((x.Conn || "").trim().toUpperCase() === sConn) &&
		// 					((x.Tcode || "").trim().toUpperCase() === sTcod) &&
		// 					((x.Profile || "").trim() === sProf);
		// 			});

		// 			if (idxExact >= 0) {
		// 				aMerged[idxExact] = Object.assign({}, aMerged[idxExact], {
		// 					Profile: r.Profile,
		// 					SubProfile: r.SubProfile,
		// 					DESIGNTION: r.DESIGNTION,
		// 					Editable: true,
		// 					isNew: true
		// 				});
		// 				return;
		// 			}


		// 			var idxEmpty = aMerged.findIndex(function (x) {
		// 				return ((x.Conn || "").trim().toUpperCase() === sConn) &&
		// 					((x.Tcode || "").trim().toUpperCase() === sTcod) &&
		// 					((x.Profile || "").trim() === "");
		// 			});

		// 			if (idxEmpty >= 0) {
		// 				aMerged[idxEmpty] = Object.assign({}, aMerged[idxEmpty], {
		// 					Profile: r.Profile,
		// 					SubProfile: r.SubProfile,
		// 					DESIGNTION: r.DESIGNTION,
		// 					Editable: true,
		// 					CICO_IND: "X",
		// 					isNew: true
		// 				});
		// 				return;
		// 			}
		// 			aMerged.push(Object.assign({}, r, {
		// 				Editable: true,
		// 				CICO_IND: "X",
		// 				isNew: true
		// 			}));
		// 		});


		// 		oOrgModel.setProperty("/OrgDataCICO", aMerged);


		// 		var aNormal = oOrgModel.getProperty("/OrgDataNormal") || [];
		// 		oOrgModel.setProperty("/OrgData", aNormal.concat(aMerged));

		// 		oOrgModel.refresh(true);


		// 		that._validateCICOUploadedRows(aMerged);

		// 	};

		// 	reader.onerror = function (ex) { console.log(ex); };
		// 	reader.readAsBinaryString(file);
		// },

		// _validateCICOUploadedRows: function (aRows) {
		// 	var that = this;
		// 	var oOrgModel = this.getOwnerComponent().getModel("OrgTableModelMod");
		// 	var oOData = this.getView().getModel("grac");
		// 	aRows.forEach(function (r, idx) {
		// 		if (!r || !r.Profile || !r.SubProfile) return;

		// 		var aFilters = [
		// 			new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, r.Conn),
		// 			new sap.ui.model.Filter("TCODE", sap.ui.model.FilterOperator.EQ, r.Tcode),
		// 			new sap.ui.model.Filter("PROFILE", sap.ui.model.FilterOperator.EQ, r.Profile)
		// 		];

		// 		oOData.read("/GET_SUB_PROFILESet", {
		// 			filters: aFilters,
		// 			async: true,
		// 			success: function (oData) {
		// 				var aResults = (oData && oData.results) ? oData.results : [];
		// 				var aAllowed = aResults
		// 					.map(function (x) { return (x.SUB_PROFILE || "").trim(); })
		// 					.filter(Boolean);

		// 				if (aAllowed.length && aAllowed.indexOf((r.SubProfile || "").trim()) < 0) {
		// 					var aCico = oOrgModel.getProperty("/OrgDataCICO") || [];
		// 					if (aCico[idx]) {
		// 						aCico[idx].SubProfile = "";
		// 						oOrgModel.setProperty("/OrgDataCICO", aCico);
		// 						oOrgModel.refresh(true);
		// 					}
		// 					sap.m.MessageToast.show("Invalid Sub-Profile removed for Profile: " + r.Profile);
		// 				}
		// 			}
		// 		});
		// 	});
		// },








		onDesignationSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value") || "";
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("DESIGNATION", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("DESIGNATION_DESC", sap.ui.model.FilterOperator.Contains, sValue)
				],
				and: false
			});

			var oBinding = oEvent.getSource().getBinding("items");
			if (oBinding) oBinding.filter(sValue ? [oFilter] : []);
		},

		onDesignationConfirm: function (oEvent) {
			var aSelectedItems = oEvent.getParameter("selectedItems");
			if (!aSelectedItems) {
				aSelectedItems = oEvent.getSource().getSelectedItems();
			}

			aSelectedItems = aSelectedItems || [];

			var aValues = aSelectedItems.map(function (oItem) {
				var oCtx = oItem.getBindingContext("DesignationModel");
				return oCtx ? String(oCtx.getProperty("DESIGNTION") || "").trim() : "";
			}).filter(Boolean);

			var sCommaSeparated = aValues.join(", ");
			console.log("Selected Designations:", aValues, "=>", sCommaSeparated);

			if (this._oDesignationRowContext) {
				this._oDesignationRowContext.getModel().setProperty(
					this._oDesignationRowContext.getPath() + "/DESIGNTION",
					sCommaSeparated
				);
			}
		},





		onSubProfileConfirm: function (oEvent) {
			var aSelectedItems = oEvent.getParameter("selectedItems") || [];
			if (!aSelectedItems.length) return;


			var aSubProfiles = aSelectedItems.map(function (oItem) {
				return oItem.getTitle();
			});


			var sSubProfiles = aSubProfiles.join(", ");


			this._oProfileRowContext.getModel().setProperty(
				this._oProfileRowContext.getPath() + "/SubProfile",
				sSubProfiles
			);

			this._oProfileRowContext.getModel().refresh(true);


			this._oInput.setValue(sSubProfiles);
		}
		,

		onSubProfileSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("SUB_PROFILE", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
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
				this.getView().byId("idemptypeMod").setValueState("None");
				this.getView().byId("idempidMod").setVisible(true);
				this.getView().byId("idvendorMod").setVisible(true);
				this.getView().byId("idModify3rdPary").setText("3rd Party User Details");
			}
			if (e.getParameter("selectedItem").getText() === "Adani") {
				this.getView().byId("idemptypeMod").setValueState("None");
				this.getView().byId("idempidMod").setVisible(false);
				this.getView().byId("idvendorMod").setVisible(false);
				this.getView().byId("idModify3rdPary").setText("");
				//commented by Prasanth on 29-05-2024
				// this.getView().byId("idModify3rdPary").setText("Adani");
				// this.getView().byId("idModify3rdPary").setVisible(false);
			}


		},
		onValidatationCheck: function (e) {
			if (e.getParameter("value") === "") {
				e.getSource().setValueState(sap.ui.core.ValueState.Error)
			} else {
				e.getSource().setValueState(sap.ui.core.ValueState.Success)
			}
			if (e.getParameter("selectedItem") && e.getParameter("selectedItem").getText() === "3rd Party User") {
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
			if (e.getParameter("selectedItem") && e.getParameter("selectedItem").getText() === "Adani") {
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
			// params["X-CSRF-Token"] = oModel.getSecurityToken();
			// params["X-CSRF-Token"] = this._getSecurityTokenAjax();
			params["X-CSRF-Token"] = that.getOwnerComponent().getModel("userLogin").getSecurityToken();
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
					e.getSource().setValueState("None")

				}
			}
			if (oValueFound == 0) {
				e.getSource().setValue("");
				e.getSource().setValueState("Error")
			}
		},
		TCodeChange: function (e) {
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


		OnTcodeUpdateFinished: function (Oevent) {
			var oTableItems = this.getView().byId("idTcodeMod").getItems();
			oTableItems.forEach(
				function (oItem) {
					if (oItem.getCells()[1].getValue()) {
						oItem.getCells()[1].fireChange()
					}

				}
			)

		},
		onFileSelect: function (oEvent) {

			this.file = oEvent.getParameter("files");
			// for (var uploadFiles = 0; uploadFiles <= this.file.length - 1; uploadFiles++) {
			// }
			sap.ui.getCore().byId("idfileUploader1").setPlaceholder("Please Choose");
		},
		onAttachUpload: function (e) {
			this._oAttachDialog.close();
			var AttTableModel = this.getOwnerComponent().getModel("AttInfoModelMod");
			for (var oFiles = 0; oFiles <= this.file.length - 1; oFiles++) {
				this.file[oFiles].key = oFiles + 1
				this.file[oFiles].addedOn = new Date();
				if (this.file[oFiles].type == "" && (this.file[oFiles].name.indexOf(".oft") >= 0 || this.file[oFiles].name.indexOf(".msg") >= 0)) {
					var filetype = "application/octet-stream";
				}
				else {
					var filetype = this.file[oFiles].type
				}
				// else if (this.file[oFiles].type == "") {
				// 	sap.m.MessageToast.show("this type of file are not allowed ");
				// } else {
				form_data.items.add(this.file[oFiles]);
				var AttData = {
					tile: this.file[oFiles].name,
					type: filetype,
					addedOn: new Date(),
					addedBy: oUserID,
					key: oFiles + 1,
					lastModified: this.file[oFiles].lastModified,
				};
				AttTableModel.getData().AttInfoData.push(AttData);
			}
			// }
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
		deleteNewOrg: function (e) {
			var oDeleteOrg = e.oSource.getParent().getBindingContextPath().split("/")[2]
			var OrgModel = this.getOwnerComponent().getModel("OrgTableModelMod");
			OrgModel.getData().OrgData.splice(parseInt(oDeleteOrg), 1)
			OrgModel.refresh(true);
		},
		deleteNewOrgNew: function (e) {
			var that = this;
			var t = e.getSource().getBindingContext("OrgTableModelMod").getObject();
			var OrgModel = that.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData;
			var aTmpTcodes = OrgModel.filter(function (oElement) {
				return (oElement.Tcode === t.Tcode);
			});
			var aTmpSystems = OrgModel.filter(function (oElement) {
				return (oElement.Conn === t.Conn || oElement.Conn.indexOf(t.Conn) > -1);
			});
			if (aTmpTcodes.length === 1 || aTmpSystems === 1) {
				sap.m.MessageBox.error("Please maintain atleast one Transaction Code and Org value per System.");
				return false;
			} else {
				var oDeleteOrg = e.oSource.getParent().getBindingContextPath().split("/")[2]
				var OrgModel = this.getOwnerComponent().getModel("OrgTableModelMod");
				OrgModel.getData().OrgData.splice(parseInt(oDeleteOrg), 1)
				OrgModel.refresh(true);
			}
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
				"priority": oCopyOrg.priority,
				"isNew": true
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
						this.getView().byId("idNameRem").setText(data.FIRST_NAME + " " + data.LAST_NAME);
					}
				}.bind(this),
				error: function (evt) { }
			});
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
			var AttDataRem = {
				"AttInfoData": []
			};
			this.getOwnerComponent().getModel("AttInfoModelMod").setData(AttDataRem);
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
		onChangeContractCompany: function () {
			this.myOthers();
			this.updateVendorName();
		},
		myOthers: function () {
			this.showBusyIndicator();
			var oModel1 = this.getView().getModel("grac");
			var comboUserMod = this.byId("idComboUserMod");
			var oModel2 = new sap.ui.model.json.JSONModel();
			var data = [];
			oModel2.setData(data);
			comboUserMod.setModel(oModel2);
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
					comboUserMod.setModel(oModel1);
					this.hideBusyIndicator();
				}.bind(this),
				error: function (evt) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		onDeleteTocdeMod: function (e) {
			var that = this;
			//e.getSource().getParent().getCells()[1].setValueState("None");
			var t = e.getSource().getBindingContext("TcodeModelMod").getObject();
			var TcodeModel = that.getOwnerComponent().getModel("TcodeModelMod").getData().TcodeData;
			if (t.Connector !== "") {
				var aTmpTcodes = TcodeModel.filter(function (oElement) {
					return (oElement.Connector === t.Connector);
				});
				if (aTmpTcodes.length === 1) {
					sap.m.MessageBox.error("Please maintain atleast one Transaction Code per System.");
					return false;
				}
			}
			for (var o = 0; o < TcodeModel.length; o++) {
				if (TcodeModel[o].Tcode === t.Tcode && TcodeModel[o].Connector === t.Connector) {
					TcodeModel.splice(o, 1);
					this.getView().getModel("TcodeModelMod").refresh(true);
					break
				}
			}

			if (that.getOwnerComponent().getModel("OrgTableModelMod") && that.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData.length >= 0) {
				that.onORgRefreshMod();
				that._onRefreshRequestSubmission();
			}
		},

		onChnageConnectorMod: function (oEvent) {
			var that = this;
			var path = parseInt(oEvent.getSource().getParent().getBindingContextPath().match(/\d/g).join('',));
			that.TcodeModel = that.getOwnerComponent().getModel("TcodeModelMod");
			var oItemdBusiness = oEvent.getSource().getItems();
			var oValueFound = 0;
			//that.TcodeModel.getData().TcodeData[path].Connector = oEvent.getSource().getSelectedItem().getText();

			for (var oBusiness = 0; oBusiness <= oItemdBusiness.length - 1; oBusiness++) {
				if (oEvent.getSource().getItems()[oBusiness].getBindingInfo("text").binding.oValue == oEvent.getParameter("value")) {
					that.TcodeModel.getData().TcodeData[path].Connector = oEvent.getParameter("value");
					oValueFound += 1;
				}
			}
			if (oValueFound == 0) {
				oEvent.getSource().setValue(oEvent.oSource.mBindingInfos.selectedKey.binding.oValue);
				that.TcodeModel.getData().TcodeData[path].Connector = oEvent.oSource.mBindingInfos.selectedKey.binding.oValue;
			}

			that.TcodeModel.refresh(true);
			//that.onORgRefreshMod();
		},
		onChnageConnector: function (oEvent) {
			var that = this;
			var path = parseInt(oEvent.getSource().getParent().getBindingContextPath().match(/\d/g).join('',));
			that.TcodeModel = that.getOwnerComponent().getModel("TcodeModel");
			that.TcodeModel.getData().TcodeData[path].Connector = oEvent.getSource().getSelectedItem().getText();
			that.TcodeModel.refresh(true);
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
				if (oFilterTcode.trim() !== "" && oFilterConnector.trim() !== "") {
					if (oFilterTcode) {
						oFilter.push(new sap.ui.model.Filter("ACTION", sap.ui.model.FilterOperator.EQ, oFilterTcode));
					}
					if (oFilterConnector) {
						oFilter.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, oFilterConnector));
					}
				} else {
					sap.m.MessageBox.error('Please Enter Valid Data');
					return false
				}
			} else {
				if (onUploadTcode.trim() !== "" && onUploadConn.trim() !== "") {
					var oFilterTcode = onUploadTcode.toUpperCase();
					if (oFilterTcode) {
						oFilter.push(new sap.ui.model.Filter("ACTION", sap.ui.model.FilterOperator.EQ, onUploadTcode));
					}
					if (onUploadConn) {
						oFilter.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, onUploadConn));
					}
				} else {
					sap.m.MessageBox.error('Please Enter Valid Data');
					return false
				}
				var path = uploadIndex;
			}
			if (oFilter.length) {
				oModelCom.read("/TCodeInfoSet", {
					async: false,
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
							that.TcodeModel.getData().TcodeData[path].CICO_IND = newData.CICO_IND;
							that.TcodeModel.refresh(true);
							if (that.getOwnerComponent().getModel("OrgTableModelMod")
								//&& that.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData.length > 0
								&& !that.TcodeUplaoded) {
								that.onORgRefreshMod();
								that._onRefreshRequestSubmission();
							} else if (that.TcodeUplaoded && path == aTcodeData.length - 1) {
								that.TcodeUplaoded = false;
								that.onORgRefreshMod();
								that._onRefreshRequestSubmission();
							}
						}
					},
					error: function (event) {
						that.TcodeModel.getData().TcodeData[path].TcodeDesc = '';
						that.TcodeModel.refresh(true);
						oEvent.getSource().setValue(oFilterTcode);
						oEvent.getSource().setValueState("Error")
						sap.m.MessageBox.error('Please Enter Correct Tcode');

					}
				});
			}
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
						"ORG_LEVEL": "$" + OrgTableModel[index].OrgLevel + "(" + OrgTableModel[index].Tcode + ")" + "",
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
				// params["X-CSRF-Token"] = oModel.getSecurityToken();
				// params["X-CSRF-Token"] = this._getSecurityTokenAjax();
				params["X-CSRF-Token"] = that.getOwnerComponent().getModel("userLogin").getSecurityToken();
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

		onORgRefreshMod: function (oEvent) {
			var that = this;
			var OrgTableModel = that.getOwnerComponent().getModel("OrgTableModelMod");
			OrgTableModel.setProperty("/OrgData", []);
			OrgTableModel.setProperty("/OrgDataNormal", []);
			OrgTableModel.setProperty("/OrgDataCICO", []);
			OrgTableModel.refresh(true);

			var hasCICO = false;
			var TcodeModel = that.getOwnerComponent().getModel("TcodeModelMod").getData().TcodeData;

			
			var oModel = that.getView().getModel('grac');
			//Clear the table data
			var TcodeInfo = [];
			if (TcodeModel.length !== 0) {
				tcode = "";
				TcodeModel.forEach((item, index) => {
					// if (index !== 0) {
					// 	tcode = tcode.concat(', ');
					// }
					var tdata = {
						"TCODE": TcodeModel[index].Tcode,
						"CONNECTOR": TcodeModel[index].Connector
					};
					if (tdata.TCODE.trim() !== "" && tdata.CONNECTOR.trim() !== "") {
						TcodeInfo.push(tdata);
					}

					//Get the Tcode List
					if (tcode.indexOf(TcodeModel[index].Tcode) < 0) {
						if (tcode.length !== 0) {
							tcode = tcode + "," + TcodeModel[index].Tcode;
						} else {
							tcode = TcodeModel[index].Tcode;
						}
					}
				});
				if (TcodeInfo.length == 0) {
					sap.ui.core.BusyIndicator.hide();
					return false;
				}
				//Set Text of Tcode list in Review tab
				this.getView().byId("idTcodesListMod").setText(tcode);
				var oPayload = {
					"USER_ACTION": "ROLE",
					"NARRoleInformationSet": TcodeInfo
				};
				sap.ui.core.BusyIndicator.show(300);
				var OrgTableModel = that.getOwnerComponent().getModel("OrgTableModelMod");
				var oModel = that.getView().getModel('grac');
				var params = [];
				var GUID;
				var mIsCICO = {};
				TcodeModel.forEach(function (o) {
					var k = (o.Tcode || "").trim().toUpperCase() + "|" +
						(o.Connector || "").trim().toUpperCase();
					//mIsCICO[k] = ((o.CICO_IND || "").trim().toUpperCase() === "X");
					mIsCICO[k]=false;
				});


				// params["X-CSRF-Token"] = oModel.getSecurityToken();
				// params["X-CSRF-Token"] = this._getSecurityTokenAjax();
				params["X-CSRF-Token"] = that.getOwnerComponent().getModel("userLogin").getSecurityToken();
				params["X-CSRF-Token"] = csrf;
				params["Content-Type"] = "application/json";
				oModel.create('/NARUserInformationSet', oPayload, {
					async: false,
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
									console.log("all data : ", data1);
									if (data1.results.length === 0) {
										sap.ui.core.BusyIndicator.hide();
										sap.m.MessageBox.error('The Org Value is not Available for these Tcodes.');
										return;
									} else {

										var orgValue = [];
										// var AllTCODES = TcodeModel.map(function (o) {
										// 	return o.Tcode;
										// })
										// var AllCONS = TcodeModel.map(function (o) {
										// 	return o.Connector;
										// })

										// for (var i = 0; i < orgValue.length; i++) {
										// 	if (AllTCODES.indexOf(orgValue[i].Tcode) < 0) {
										// 		orgValue.splice(i, 1);
										// 		i--
										// 	}
										// }
										// for (var i = 0; i < orgValue.length; i++) {
										// 	if (AllCONS.indexOf(orgValue[i].Conn) < 0) {
										// 		orgValue.splice(i, 1);
										// 		i--
										// 	}
										// }

										// var mIsCICO = {};
										// for (var x = 0; x < TcodeModel.length; x++) {
										// 	var k = (TcodeModel[x].Tcode || "").trim().toUpperCase() + "|" +
										// 		(TcodeModel[x].Connector || "").trim().toUpperCase();
										// 	mIsCICO[k] = ((TcodeModel[x].CICO_IND || "").trim().toUpperCase() === "X");
										// }

										data1.results.forEach(element => {
											if (element.VTEXT !== "") {
												var sActionUC = (element.ACTION || "").trim().toUpperCase();
												var sConnUC = (element.CONNECTOR || "").trim().toUpperCase();
												var bActionIsCICO = !!mIsCICO[sActionUC + "|" + sConnUC];
												console.log("bActionIsCICO  : ", bActionIsCICO);
												if (bActionIsCICO) {
													return;
												}
												var existingOrg = orgValue.find(function (item) {
													return (item.Conn || "").trim().toUpperCase() === (element.CONNECTOR || "").trim().toUpperCase() &&
														(item.OrgLevel || "") === element.FIELDNAME &&
														(item.OrgVal || "") === element.VTEXT &&
														(item.FromOrg || "") !== "*";
												});
												var existingCon = orgValue.find(function (item) {
													var bItemIsCICO = ((item.CICO_IND || "").trim().toUpperCase() === "X");

													return (item.Conn || "").trim().toUpperCase() === sConnUC &&
														(item.OrgLevel || "") === element.FIELDNAME &&
														(item.OrgVal || "") === element.VTEXT &&
														(item.FromOrg || "") !== "*" &&
														(bItemIsCICO === bActionIsCICO);
												});

												console.log("existingCon : ", existingCon);

												if (element.IND == "X") {
													var newOrgData = {
														OrgLevel: element.FIELDNAME,
														OrgVal: element.VTEXT,
														Tcode: element.ACTION,
														FromOrg: "*", //neData.VALUE_FROM,
														ToOrg: "",
														Conn: element.CONNECTOR,
														priority: element.PRIORITY,
														FromOrgValueHelp: false,
														FromOrgValueAdd: false,
														CICO_IND: bActionIsCICO ? "X" : ""

													};
													orgValue.push(newOrgData);
												}

												// else if (existingOrg) {
												// 	if (existingOrg.Conn.indexOf(element.CONNECTOR) < 0) {
												// 		existingOrg.Conn = existingOrg.Conn + "," + element.CONNECTOR
												// 	}
												// }
												else if (existingCon) {
													// does existing row already contain any CICO tcode?
													var aExistingTcodes = (existingCon.Tcode || "")
														.split(",")
														.map(function (t) { return t.trim().toUpperCase(); })
														.filter(Boolean);
													console.log(" aExistingTcodes ::=> ", aExistingTcodes);
													var bExistingHasCICO = aExistingTcodes.some(function (t) {
														return !!mIsCICO[t + "|" + sConnUC];
													});

													if (!bActionIsCICO && !bExistingHasCICO) {

														var sActionRaw = (element.ACTION || "").trim();
														var sActionUC = sActionRaw.toUpperCase();

														var aExisting = (existingCon.Tcode || "")
															.split(",")
															.map(function (t) { return t.trim().toUpperCase(); })
															.filter(Boolean);
														console.log("aExisting :: ", aExisting);

														if (aExisting.indexOf(sActionUC) < 0) {
															existingCon.Tcode = existingCon.Tcode ? (existingCon.Tcode + "," + sActionRaw) : sActionRaw;
														}
													} else {

														var newOrgData3 = {
															OrgLevel: element.FIELDNAME,
															OrgVal: element.VTEXT,
															Tcode: element.ACTION,
															FromOrg: "",
															ToOrg: "",
															Conn: element.CONNECTOR,
															priority: element.PRIORITY,
															CICO_IND: "X"
														};
														orgValue.push(newOrgData3);
													}
													// if (existingCon.Tcode.indexOf(element.ACTION) < 0) {
													// 	existingCon.Tcode = existingCon.Tcode + "," + element.ACTION
													// }
												} else {
													var newOrgData = {
														OrgLevel: element.FIELDNAME,
														OrgVal: element.VTEXT,
														Tcode: element.ACTION,
														FromOrg: "", //neData.VALUE_FROM,
														ToOrg: "",
														Conn: element.CONNECTOR,
														priority: element.PRIORITY,
														CICO_IND: bActionIsCICO ? "X" : ""
													};
													orgValue.push(newOrgData);
												}
											}


											// OrgTableModel.getData().OrgData = orgValue;
											// OrgTableModel.refresh(true);
											// sap.ui.core.BusyIndicator.hide();
											// that._BackendTableDataBackUp();
										});

										var mCico = {};
										for (var i = 0; i < TcodeModel.length; i++) {
											var key = (TcodeModel[i].Tcode || "").trim().toUpperCase() + "|" +
												(TcodeModel[i].Connector || "").trim().toUpperCase();
											mCico[key] = (TcodeModel[i].CICO_IND || "").trim().toUpperCase();
										}



										// 2) Add CICO_IND to each Org row based on its tcode+connector
										// for (var j = 0; j < orgValue.length; j++) {
										// 	var sConn = (orgValue[j].Conn || "").trim().toUpperCase();

										// 	var aTcodesRow = (orgValue[j].Tcode || "")
										// 		.split(",")
										// 		.map(function (s) { return s.trim().toUpperCase(); })
										// 		.filter(Boolean);

										// 	var bRowCico = aTcodesRow.some(function (t) {
										// 		return !!mIsCICO[t + "|" + sConn];
										// 	});

										// 	orgValue[j].CICO_IND = bRowCico ? "X" : "";
										// }

										// // 3) Split into two arrays
										// var aOrgNormal = orgValue.filter(function (r) { return r.CICO_IND !== "X"; });
										var aOrgCICO = orgValue.filter(function (r) { return r.CICO_IND === "X"; });

										// console.log("org CICO :",aOrgCICO);

										var aOrgCICO = [];
										var mCicoRowKey = {};

										var aTcodes = TcodeModel.map(function (item) {
											return item.Tcode;
										});

										OrgTableModel.setProperty("/aTcodes", aTcodes)
										console.log("All Tcodes:", aTcodes);


										console.log("tocode data : ",TcodeModel);
										TcodeModel.forEach(function (t) {
											var tcode = (t.Tcode || "").trim();
											var conn = (t.Connector || "").trim();
											var isCico = (t.CICO_IND || "").trim().toUpperCase() === "X";

											if (!tcode || !conn || !isCico) return;

											var key = tcode.toUpperCase() + "|" + conn.toUpperCase();
											if (mCicoRowKey[key]) return;
											mCicoRowKey[key] = true;

											aOrgCICO.push({
												Conn: conn,
												Tcode: tcode,
												OrgVal: "",
												Profile: "",
												SubProfile: "",
												DESIGNTION: "",
												Editable: true,
												CICO_IND: "X",
												isNew: false
											});
										});

										var aOrgNormal = orgValue;
										// 4) Update model once
										OrgTableModel.setProperty("/OrgData", orgValue);
										OrgTableModel.setProperty("/OrgDataNormal", aOrgNormal);
										OrgTableModel.setProperty("/OrgDataCICO", aOrgCICO);
										OrgTableModel.refresh(true);

										sap.ui.core.BusyIndicator.hide();
										that._BackendTableDataBackUp();


									}
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
		},

		showIfCICO: function (aTcodes) {
           
            if (!Array.isArray(aTcodes) || aTcodes.length === 0) {
                return false;
            }
            var hasCICO = aTcodes.includes("CICO");
            if (hasCICO && aTcodes.length === 1) {
                return false;
            }

			var allCICO = aTcodes.every(function (tcode) {
				return tcode === "CICO";
			});

			if (allCICO) {
				return false;
			}

            return true;
        }
		,
		hasItems: function (a) {
			return Array.isArray(a) && a.length > 0;
		},
		_BackendTableDataBackUp: function () {
			var that = this
			var OrgTableModel = this.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData;
			this.OrgBackUpData = [];
			OrgTableModel.forEach(function (oTableItem) {
				that.OrgBackUpData.push(oTableItem.Conn + oTableItem.OrgVal + oTableItem.Tcode)

			})



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
						"ORG_LEVEL": "$" + OrgTableModel[index].OrgLevel + "(" + OrgTableModel[index].Tcode + ")" + "",
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
				// params["X-CSRF-Token"] = oModel.getSecurityToken();
				// params["X-CSRF-Token"] = this._getSecurityTokenAjax();
				params["X-CSRF-Token"] = that.getOwnerComponent().getModel("userLogin").getSecurityToken();
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
			if (oValue.indexOf("*") > -1) {
				var oValueArray = oValue.split("*");
				var filter1 = [];
				oValueArray.forEach(function (oItem) {
					if (oItem !== "") {
						filter1.push(new sap.ui.model.Filter("CUR_VALUE", sap.ui.model.FilterOperator.StartsWith, oItem));
					}
				});
				oBinding.filter(filter1);
			} else {
				var filter1 = new sap.ui.model.Filter("CUR_VALUE", sap.ui.model.FilterOperator.Contains, oValue);
				oBinding.filter([filter1]);
			}
		},
		onValueHelpDialogClose: function (e) {
			var that = this;
			var aSelectedItems = e.getParameter("selectedContexts");
			if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
					oObject.FromOrg = oObject.FromOrg.length > 0 ? oObject.FromOrg + "," + oItem.getObject().CUR_VALUE : oItem.getObject().CUR_VALUE;
				});
			}
			this.getOwnerComponent().getModel(oModelName).refresh(true);
			this.multiInput.setValueState("None");
			this.multiInput.setEditable(false);

		},
		onRuleValueHelpDialogClose: function (e) {
			if (e.getParameter("selectedItem")) {
				var oSelValue = e.getParameter("selectedItem").mProperties.title;
				this.getView().byId("idRuleSet").setValue(oSelValue);
				this.getView().byId("idRuleSet").setValueState("None");
			}
		},
		onOrgFromAuth: function (eve) {
			var that = this;
			this.multiInput = eve.getSource();
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
			if (!this._oValueHelpDialogNewMod) {
				this._oValueHelpDialogNewMod = sap.ui.xmlfragment(this.getView().getId(), "com.new.prjt.znew_arm_prjt.fragment.F4FromOrgVal", this);
				this.getView().addDependent(this._oValueHelpDialogNewMod);
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
					this._oValueHelpDialogNewMod.setModel(oAccessModel);
				}.bind(this),
				error: function (error) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
			this._oValueHelpDialogNewMod.getBinding("items");
			var oBinding = this._oValueHelpDialogNewMod.getBinding("items");
			this._oValueHelpDialogNewMod.open();
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
			eve = eve.getSource().getParent().getItems()[0];
			this.onF4Click(oTable, inum, oObject, eve);
			oModelName = "OrgTableModelMod";
		},
		onF4Click: function (oTable, inum, oObject, eve) {
			this.multiInput = eve
			this.multiInput.setValue("");
			var oModel = this.getView().getModel("grac");
			//var oF4Table = this.getView().byId("idF4");
			var aFilters = [];
			if (!this._oValueHelpDialogNewMod) {
				this._oValueHelpDialogNewMod = sap.ui.xmlfragment("idOrgValF4", "com.new.prjt.znew_arm_prjt.fragment.F4FromOrgVal", this);
				this.getView().addDependent(this._oValueHelpDialogNewMod);
			}
			//var oOrgValueFound = oTable.some(e => e.OrgLevel === oObject.OrgLevel);
			//var oIndex = oTable.map(oObject => oObject.OrgLevel).indexOf(oObject.OrgLevel);
			//var inum = oIndex;
			aFilters.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, oObject.Conn));
			aFilters.push(new sap.ui.model.Filter("CUR_ORG", sap.ui.model.FilterOperator.EQ, oObject.OrgLevel));
			if (this.multiInput.getParent().getParent().getBindingContext("OrgTableModelMod").getObject().OrgVal == "Plant"
				|| this.multiInput.getParent().getParent().getBindingContext("OrgTableModelMod").getObject().OrgVal == "Plant Code"
				|| this.multiInput.getParent().getParent().getBindingContext("OrgTableModelMod").getObject().OrgVal == "Plant code") {
				// var oCompany = oTable.filter(function (oRecord) {
				// 	return (oObject.Conn === oRecord.Conn && oRecord.OrgVal === "Company code" || oRecord.OrgVal === "Company Code");
				// });

				for (var md = inum; md >= 0; md--) {
					if (oObject.Conn === oTable[md].Conn && oTable[md].OrgVal === "Company code" || oTable[md].OrgVal === "Company Code") {
						var oCompany = oTable[md];
						break
					}
				}

				if (oCompany && oCompany.FromOrg) {
					aFilters.push(new sap.ui.model.Filter("COM_VALUE", sap.ui.model.FilterOperator.EQ, oCompany.FromOrg || ""));

				}
			}
			oModel.read("/NARORGVALUEFROMSet", {
				filters: aFilters,
				success: function (data) {
					sap.ui.core.BusyIndicator.hide();
					var oOrgModel = new sap.ui.model.json.JSONModel();
					oOrgModel.setData(data.results);
					this._oValueHelpDialogNewMod.setModel(oOrgModel, "OrgModel");
					this._oValueHelpDialogNewMod.open();
				}.bind(this),
				error: function (error) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("No Plant Codes found for the selected Company Code.");
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
					if (data.PHONE == "" || data.PHONE.length < 0) {
						that.getView().byId("IDMObMod").setEditable(true);
					} else {
						that.getView().byId("IDMObMod").setEditable(false);
					}
				},
				error: function (event) {
					sap.m.MessageBox.error('Error Occurs.');
					return;
				}
			});
		},

		onSubmitMod: function (Oevent) {
			var TcodeLength = this.getOwnerComponent().getModel("TcodeModelMod").getData().TcodeData.length
			var OrgLength = this.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData.length

			if (!this.validateOrgData() || !this.validateTcodeData() || TcodeLength == 0 || OrgLength == 0) {
				this.hideBusyIndicator()
				sap.m.MessageBox.error("Please Enter Valid Data to Proceed");
				return false

			}
			var textFlag = Oevent.getSource().getText();
			if (textFlag === "Submit") {
				this._onSubmitOrSaveMod("SUBMIT");
			} else if (textFlag === "Save") {
				this._onSubmitOrSaveMod("SAVE");
			}
		},
		_onSubmitOrSaveMod: function (saveOrSubmit) {
			this.showBusyIndicator();
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
			var tcode = "\n" + "   TCODES: ";
			tcode = tcode.concat(this.getView().byId("idTcodesListMod").getText());
			text = text.concat(tcode);
			var oOrgDataInfo = this.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData;
			if (!this.validateOrgData()) {
				that.hideBusyIndicator()
				sap.m.MessageBox.error("Enter Valid Org Value");
				return false

			}
			var OrgData = [];
			if (oOrgDataInfo && oOrgDataInfo.length) {
				oOrgDataInfo.forEach(function (r) {
					var sTcode = (r.Tcode || "").trim();
					var bIsCICO = ((r.CICO_IND || "").trim().toUpperCase() === "X") || (sTcode.toUpperCase() === "CICO");
					if (bIsCICO) {
						var sProfile = (r.Profile || "").trim();
						var sSub = (r.SubProfile || "").trim();
						var sDes = (r.DESIGNTION || "").trim();

						if (sProfile) {
							text += "\nCICO(Profile " + sProfile + ")";
						}
						if (sSub) {
							text += "\nCICO(Sub-profile " + sSub + ")";
						}
						if (sDes) {
							text += "\nCICO(Description " + sDes + ")";
						}


					} else {
						if ((r.FromOrg || "").trim() !== "") {
							text += "\n" + sTcode + "(" + (r.OrgVal || "") + " " + (r.FromOrg || "") + ")";
						}
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
			// params["X-CSRF-Token"] = oModel.getSecurityToken();
			// params["X-CSRF-Token"] = this._getSecurityTokenAjax();
			params["X-CSRF-Token"] = that.getOwnerComponent().getModel("userLogin").getSecurityToken();
			params["X-CSRF-Token"] = csrf;
			params["Content-Type"] = "application/json";
			// var slug = this.file.name;
			// var filetype = this.file.type;
			// var oCSRFToken = oModel.getSecurityToken();
			// var oCSRFToken = this._getSecurityTokenAjax();
			var oCSRFToken = that.getOwnerComponent().getModel("userLogin").getSecurityToken();
			var AttTableModel = this.getOwnerComponent().getModel("AttInfoModelMod");
			var uploadata = AttTableModel.getData().AttInfoData
			oModel.create('/NARUserInformationSet', oPayload, {
				headers: params,
				success: function (data) {
					sap.ui.core.BusyIndicator.hide();
					var mesg = "Your Request has been submitted successfully with request '" + data.STATUS + "'";
					var mesg2 = "Your Request has been saved successfully."
					var finalMesg = (that.flagM === "SAVE" ? mesg2 : mesg);
					sap.ui.core.BusyIndicator.show();
					sap.m.MessageBox.success(finalMesg);
					var oFilesUpload = that.file;
					var oFileUploader = sap.ui.getCore().byId("idfileUploader1");

					for (var md = 0; md < uploadata.length; md++) {
						for (var fd = 0; fd < form_data.items.length; fd++) {
							if (form_data.files[fd].name + form_data.files[fd].lastModified + form_data.files[fd].addedOn === uploadata[md].tile + uploadata[md].lastModified + uploadata[md].addedOn) {
								var sUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/NARUserInformationSet(USER_ID='" + data.STATUS + "||" + form_data.files[fd].name + "')/AttachementsSet";
								// let token=that._getSecurityTokenAjax()
								let token = that.getOwnerComponent().getModel("userLogin").getSecurityToken();
								$.ajax({

									url: sUrl, // <-- point to server-side PHP script 
									beforeSend: function (request) {
										// request.setRequestHeader("x-csrf-token", oModel.getSecurityToken());
										request.setRequestHeader("x-csrf-token", token);
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
					that.getOwnerComponent().getModel("AttInfoModelMod").setData(AttDataRem);
					that.handleUploadCompleteMod(that.flagM);
					that.hideBusyIndicator()
				},
				error: function (data) {
					sap.ui.core.BusyIndicator.hide();
					if (JSON.parse(data.responseText)) {
						sap.m.MessageBox.error("Modify request unsuccessful'" + JSON.parse(data.responseText).error.message.value + "'");
					} else {
						sap.m.MessageBox.error("Modify request unsuccessful");
					}
					that.hideBusyIndicator()
				}
			});
		},

		handleUploadCompleteMod: function (flagM) {
			sap.ui.core.BusyIndicator.hide();
			var oFileUploader = sap.ui.getCore().byId("idfileUploader1");
			if (oFileUploader !== undefined) {
				oFileUploader.setValue("");
				sap.m.MessageToast.show("File Uploaded");
			}

			if (flagM !== "SAVE") {
				this.navToMyAccess();
			}
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
				property: 'Tcode',
				width: '10'
			}];
			aTcodes = this.getOwnerComponent().getModel("TcodeModelMod").getProperty("/TcodeData");
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
		onDownloadTemplateOrg: function () {
			var aCols, aData, oSettings, oSheet;
			aCols = [{
				label: 'System',
				property: 'Conn',
			}, {
				label: 'Org value Description',
				property: 'OrgVal',
			},
			{
				label: 'Tcode',
				property: 'Tcode',
			}, {
				label: 'Value',
				property: 'FromOrg',
			},
			{
				label: 'Org Level',
				property: 'OrgLevel',
			}
			];
			aData = this.getOwnerComponent().getModel("OrgTableModelMod").getProperty("/OrgDataNormal");
			var filaDatateredArray = aData.filter(item => item.FromOrg !== '*');
			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: filaDatateredArray,
				fileName: 'OrgValues'
			};
			oSheet = new s(oSettings);
			oSheet.build().then(function () { }).finally(oSheet.destroy);
		},

		// onDownloadTemplateCICO: function () {
		// 	var aCols, aData, oSettings, oSheet;
		// 	aCols = [
		// 		{ label: "System", property: "Conn" },
		// 		{ label: "Tcode", property: "Tcode" },
		// 		{ label: "Profile", property: "Profile" },
		// 		{ label: "Sub-Profile", property: "SubProfile" },
		// 		{ label: "Designation", property: "DESIGNTION" }
		// 	];
		// 	var oOrgModel = this.getOwnerComponent().getModel("OrgTableModelMod");
		// 	aData = oOrgModel.getProperty("/OrgDataCICO") || [];
		// 	if (!aData.length) {
		// 		aData = [{
		// 			Conn: "",
		// 			Tcode: "",
		// 			Profile: "",
		// 			SubProfile: "",
		// 			DESIGNTION: ""
		// 		}];
		// 	}

		// 	oSettings = {
		// 		workbook: { columns: aCols },
		// 		dataSource: aData,
		// 		fileName: "OrgValues_CICO"
		// 	};

		// 	oSheet = new s(oSettings);
		// 	oSheet.build().then(function () { }).finally(oSheet.destroy);
		// },


		// onSelectionChangeSystem: function (oEvent) {
		// 	var aDeletedConnector = [];
		// 	if (!oEvent.mParameters.selected) {
		// 		var aListItems = oEvent.mParameters.listItems;
		// 		aListItems.forEach(function (oItem) {
		// 			aDeletedConnector.push(oItem.getCells()[0].getText());
		// 		});
		// 	}
		// 	if (this._bIsNavigatedToStep3) {
		// 		this._loadTcodeTable(aDeletedConnector);
		// 	}
		// },
		// _loadTcodeTable: function (aDeletedConnector) {
		// 	var aTcodeData = [];
		// 	var aSelectedContexts = this.getView().byId("table1").getSelectedContexts();
		// 	var aTransactionTableData = this.getOwnerComponent().getModel("TcodeModel").getProperty("/TcodeData");
		// 	var deletedIndices = [];
		// 	aDeletedConnector.forEach(function (connector) {
		// 		for (var i = 0; i < aTransactionTableData.length; i++) {
		// 			if (aTransactionTableData[i].Connector === connector) {
		// 				deletedIndices.push(i);
		// 			}
		// 		}
		// 	});
		// 	if (deletedIndices.length > 0) {
		// 		for (var k = deletedIndices.length - 1; k >= 0; k--) {
		// 			aTransactionTableData.splice(deletedIndices[k], 1);
		// 		}
		// 	}
		// 	var aSelectedRecords = [];
		// 	if (aSelectedContexts.length > 0) {
		// 		aSelectedContexts.forEach(function (oContext) {
		// 			aSelectedRecords.push(oContext.getObject());
		// 			var tmpArray = aTransactionTableData.filter(function (oRecord) {
		// 				return (oRecord.Connector === oContext.getObject().CONNECTOR);
		// 			});
		// 			if (tmpArray.length === 0) {
		// 				aTcodeData.push({
		// 					"ACTION_ID": "",
		// 					"Connector": oContext.getObject().CONNECTOR,
		// 					"Tcode": "",
		// 					"TcodeDesc": ""
		// 				});
		// 			} else { }
		// 		});
		// 		this.getView().byId("idTcode").getModel("TcodeModel").setProperty("/TcodeData", aTransactionTableData.concat(aTcodeData));
		// 		this.getView().byId("idTcode").getModel("TcodeModel").refresh(true);
		// 		this.getOwnerComponent().getModel("SeleSysLandInfo").setProperty("/sleSysLaData", aSelectedRecords);
		// 		this.getOwnerComponent().getModel("SeleSysLandInfo").refresh(true);
		// 	} else {
		// 		this.getOwnerComponent().getModel("TcodeModel").setProperty("/TcodeData", []);
		// 		this.getOwnerComponent().getModel("OrgTableModel").setProperty("/OrgData", [])
		// 		sap.m.MessageBox.error('Please select at least one System.');
		// 		this.getView().byId("idTcodesListMod").setText("");
		// 	}
		// },

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
			var that = this;
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
				this.getOwnerComponent().getModel("TcodeModelMod").setProperty("/TcodeData", []);
				this.getOwnerComponent().getModel("OrgTableModelMod").setProperty("/OrgData", []);
				this.getOwnerComponent().getModel("SeleSysLandInfoMod").setProperty("/sleSysLaData", []);
				sap.m.MessageBox.error('Please select at least one System.');
				this.getView().byId("idTcodesListMod").setText("");
			}

			var Orginfo = this.getOwnerComponent().getModel("OrgTableModelMod").getProperty("/OrgData")
			for (var i = 0; i < Orginfo.length; i++) {
				if (Orginfo[i].Conn === aDeletedConnector[0]) {
					Orginfo.splice(i, 1);
					i--
				}
			}
			if (that.getOwnerComponent().getModel("OrgTableModelMod") && that.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgData.length >= 0) {
				that.onORgRefreshMod();
				that._onRefreshRequestSubmission();
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

		},

		onUserSearch: function (oEvent) {
			var that = this;
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
				and: true,   //and:true - changed by Prasanth on 20-06-2024(previously and:false)
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
					var data = { results: [] };
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
		handleLiveChange: function (e) {
			if (e.getSource().getName() && e.getSource().getValue()) {
				var regEx, erroeTxt;
				if (e.getSource().getName() == "AlphaNum") {
					e.getSource().setValueState("None");
				} else if (e.getSource().getName() === "Email") {
					regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
					erroeTxt = 'Special characters not allowed'
				} else if (e.getSource().getName() === "CharOnly") {
					regEx = /^[A-Za-z]+$/
					erroeTxt = 'Only characters allowed'
				}
				else if (e.getSource().getName() === "Tcode") {
					erroeTxt = 'Please Enter Valid Tcode'
					e.getSource().setValueState('Error');
					e.getSource().setValueStateText(erroeTxt);
					return false;
				}
				var sValue = e.getSource().getValue();
				if (!regEx.test(sValue)) {
					e.getSource().setValueState('Error');
					e.getSource().setValueStateText(erroeTxt);
					e.getSource().setValue("");
					return
				} else {
					e.getSource().setValueState(sap.ui.core.ValueState.Success)
				}
			} else if (e.getSource().getValue().trim()) {
				e.getSource().setValueState('None');
			} else {
				e.getSource().setValueState('Error');
			}
		},

		validateOrgData: function () {
			var errors = [];
			var orgData = this.getOwnerComponent().getModel("OrgTableModelMod").getProperty("/OrgData");
			var orgItems = this.getView().byId("tblExcelDatfa134tg").getItems();
			for (var j = 0; j < orgData.length; j++) {
				if (orgData[j].FromOrg == ""

				) {
					orgItems[j].getCells()[3].getItems()[0].setEditable(true).setValueState("Error");
					errors.push([j])
				}
			}
			if (errors.length > 0) {
				return false;
			} else {
				return true
			}
		},
		validateTcodeData: function () {
			var errors = [];
			var orgItems = this.getView().byId("idTcodeMod").getItems();
			for (var j = 0; j < orgItems.length; j++) {
				if (orgItems[j].getCells()[1].getValue() == "" || orgItems[j].getCells()[1].getValueState() == "Error"
					|| orgItems[j].getCells()[0].getValue() == "" || orgItems[j].getCells()[0].getValueState() == "Error"
				) {
					orgItems[j].getCells()[1].setValueState("Error");
					errors.push([j])
				}
			}
			if (errors.length > 0) {
				return false;
			} else {
				return true
			}
		},
		onUploadMRTcode: function (oEvent) {
			var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
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
						excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
					});
					var copyExcelData = [...excelData];
					var oSelectedTcodes = that.getOwnerComponent().getModel("SeleSysLandInfoMod").getProperty("/sleSysLaData");
					oSelectedTcodes = oSelectedTcodes.filter(x => x !== undefined);
					var oFullTcodes = that.getOwnerComponent().getModel("SysLandInfoMod").getProperty("/SysLaData");
					var existingData = that.getOwnerComponent().getModel("TcodeModelMod").getProperty("/TcodeData");
					var uploadIndex = existingData.length;
					excelData = excelData.filter(function (oItem) {
						if (oItem['Transaction Code'] !== "") {
							oItem.Connector = oItem.Connector.toUpperCase()
							return oItem
						}
					})
					for (var i = 0; i <= excelData.length - 1; i++) {
						var oCon = excelData[i].Connector.toUpperCase();
						var oTCode = excelData[i]['Transaction Code'].toUpperCase();
						oTCode = oTCode.toUpperCase();
						if (oFullTcodes.map(function (o) { return o.CONNECTOR; }).indexOf(oCon) >= 0) {

							var indexTcode = oFullTcodes.map(function (o) { return o.CONNECTOR; }).indexOf(oCon);

							if (!oSelectedTcodes.some(person => person.CONNECTOR === oCon)) {
								oSelectedTcodes.push(oFullTcodes[indexTcode]);
								var oSlectedTcodeItems = that.getView().byId("tableMod1").getItems();
								for (var j = 0; j <= oSlectedTcodeItems.length - 1; j++) {
									if (that.getView().byId("tableMod1").getItems()[j].getCells()[0].getProperty("text") == oCon) {
										that.getView().byId("tableMod1").getItems()[j].setSelected(true);
									}
								}
							}
							if (!existingData.some(person => person.Connector === oCon && person.Tcode === oTCode)) {
								//that.onTcodeChangeMod(e, oTCode, oCon, uploadIndex);
								var oo = {
									Connector: oCon.toUpperCase(),
									Tcode: oTCode.toUpperCase(),
									newlyadded: true
								};
								existingData.push(oo);
								uploadIndex++;
							}
						}
						that.getOwnerComponent().getModel("SeleSysLandInfoMod").setProperty("/sleSysLaData", oSelectedTcodes);
					}
					var existingData = that.getOwnerComponent().getModel("TcodeModelMod").getProperty("/TcodeData");
					for (var j = 0; j < existingData.length; j++) {
						for (var k = 0; k < existingData.length; k++) {
							if ((existingData[j].newlyadded && existingData[j].newlyadded === true) &&
								existingData[j].Connector === existingData[k].Connector &&
								existingData[k].Tcode == "") {
								existingData.splice(k, 1);
								k--;
								j--;
							}
						}
					}
					const uniqueAuthors = existingData.reduce((accumulator, current) => {
						if (!accumulator.find(
							(item) => item.Connector === current.Connector
								&& item.Tcode === current.Tcode
						)
						) {
							accumulator.push(current);
						}
						return accumulator;
					}, []);
					that.getOwnerComponent().getModel("TcodeModelMod").setProperty("/TcodeData", uniqueAuthors)
					that.TcodeUplaoded = true;
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
					setTimeout(that.OnTcodeUpdateFinished(), 1000);
				};
				reader.onerror = function (ex) {
					console.log(ex);
				};
				reader.readAsBinaryString(oEvent.getParameter("files")[0]);
			}
			that.getOwnerComponent().getModel("TcodeModelMod").refresh(true);
		},
		// onUploadOrg: function (e) {
		// 	this._importOrg(e.getParameter("files") && e.getParameter("files")[0]);
		// },

		onUploadMROrg: function (oEvent) {
			var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
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
						excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
					});
					var copyExcelData = [...excelData];
					var newExcelData = []
					var existingData = that.getOwnerComponent().getModel("OrgTableModelMod").getProperty("/OrgDataNormal");
					var TcodeInfo = that.getOwnerComponent().getModel("TcodeModelMod").getProperty("/TcodeData");
					for (var i = 0; i < excelData.length; i++) {
						for (var j = 0; j < TcodeInfo.length; j++) {
							var oCon = excelData[i]['System'].toUpperCase();
							var oTCode = excelData[i]['Tcode'].toUpperCase();
							var oOrgVal = excelData[i]['Org value Description']
							var oFromOrg = excelData[i]['Value'].toUpperCase();
							var oOrgLevel = excelData[i]['Org Level'];
							if (oCon.indexOf(TcodeInfo[j].Connector) >= 0 && oTCode.indexOf(TcodeInfo[j].Tcode) >= 0) {
								var NewData = {
									Conn: oCon,
									Tcode: oTCode,
									OrgVal: oOrgVal,
									OrgLevel: oOrgLevel,
									FromOrg: oFromOrg

								};
								newExcelData.push(NewData);
							}
						}
					}

					var finalData = [];
					var XLD = newExcelData;
					// for validating org value
					var ED = that.getOwnerComponent().getModel("OrgTableModelMod").getProperty("/OrgDataNormal");
					for (var j = 0; j < ED.length; j++) {
						for (var k = 0; k < XLD.length; k++) {
							if (XLD[k].FromOrg && ED[j].Conn + "-" + ED[j].Tcode + "-" + ED[j].OrgLevel ===
								XLD[k].Conn + "-" + XLD[k].Tcode + "-" + XLD[k].OrgLevel) {
								finalData.push(XLD[k])
							}
						}
					}
					var oFinalData = [];
					var ExcelData = finalData;
					var ExistingData = that.getOwnerComponent().getModel("OrgTableModelMod").getProperty("/OrgDataNormal");

					for (var j = 0; j < ExistingData.length; j++) {
						if (ExistingData[j].FromOrg) {
							oFinalData.push(ExistingData[j])
						}
						else {
							var oAN = ExcelData.find(function (item) {
								return ExistingData[j].Conn + "-" + ExistingData[j].Tcode + "-" + ExistingData[j].OrgLevel ==
									item.Conn + "-" + item.Tcode + "-" + item.OrgLevel && item.FromOrg !== ""
							})
							if (!oAN) {
								oFinalData.push(ExistingData[j])
							}

						}
					}
					var oTableData = oFinalData.concat(ExcelData);
					var uniqueAuthors = oTableData.reduce((accumulator, current) => {
						if (!accumulator.find(
							(item) => item.Conn === current.Conn
								&& item.Tcode === current.Tcode
								&& item.OrgLevel === current.OrgLevel
								&& item.FromOrg === current.FromOrg
						)
						) {
							accumulator.push(current);
						}
						return accumulator;
					}, []);
					that._validateOrgValues(uniqueAuthors);
					that._AddRemoveBtnValidation();
				};
				reader.onerror = function (ex) {
					console.log(ex);
				};
				reader.readAsBinaryString(oEvent.getParameter("files")[0]);
			}
		},
		_AddRemoveBtnValidation: function (oEvent) {
			var that = this;
			setTimeout(function () {
				var oTBDV = that.getOwnerComponent().getModel("OrgTableModelMod").getData().OrgDataNormal
				oTBDV.forEach(function (each) {
					each.isNew = true;
				})
				for (var g = 0; g < that.OrgBackUpData.length; g++) {
					for (var i = 0; i < oTBDV.length; i++) {
						var oTBD = oTBDV[i]
						if (that.OrgBackUpData[g] === oTBD.Conn + oTBD.OrgVal + oTBD.Tcode) {
							oTBD.isNew = false;
							break
						}

					}
				}
				that.getOwnerComponent().getModel("OrgTableModelMod").refresh(true)
			}, 1000)


		},


		_validateOrgValues: function (uniqueAuthors) {
			var that = this;
			var oModel = this.getView().getModel("grac");
			var finalvalues = [];
			uniqueAuthors.forEach(function (item) {
				var aFilters = [];
				aFilters.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, item.Conn));
				aFilters.push(new sap.ui.model.Filter("CUR_ORG", sap.ui.model.FilterOperator.EQ, item.OrgLevel));
				oModel.read("/NARORGVALUEFROMSet", {
					filters: aFilters,
					async: false,
					success: function (data) {
						var orgValueData = [];
						data.results.forEach(function (data) {
							orgValueData.push(data.CUR_VALUE)
						}.bind(this));
						item.orgValueDataset = orgValueData
						var oFromOrg = [];
						item.FromOrg.split(",").forEach(function (eachOrg) {
							if (item.orgValueDataset.indexOf(eachOrg) > -1) {
								oFromOrg.push(eachOrg);
							}
						}.bind(this));
						item.FromOrg = oFromOrg.toString()
						finalvalues.push(item)
						that.getOwnerComponent().getModel("OrgTableModelMod").setProperty("/OrgDataNormal", finalvalues)
						that.getOwnerComponent().getModel("OrgTableModelMod").refresh(true);
					},
					error: function (error) {
					}
				});

			}.bind(this));

		},
		_validateOrgValuess: function (uniqueAuthors) {
			var oModel = this.getView().getModel("grac");
			for (var i = 0; i < uniqueAuthors.length; i++) {
				var aFilters = [];
				aFilters.push(new sap.ui.model.Filter("CONNECTOR", sap.ui.model.FilterOperator.EQ, uniqueAuthors[i].Conn));
				aFilters.push(new sap.ui.model.Filter("CUR_ORG", sap.ui.model.FilterOperator.EQ, uniqueAuthors[i].OrgLevel));
				oModel.read("/NARORGVALUEFROMSet", {
					filters: aFilters,
					async: false,
					success: function (data) {
						var orgValueData = [];
						data.results.forEach(function (data) {
							orgValueData.push(data.CUR_VALUE)
						}.bind(this));
						uniqueAuthors[i].orgValueDataset = orgValueData
						var oFromOrg = [];
						uniqueAuthors[i].FromOrg.split(",").forEach(function (eachOrg) {
							if (item.orgValueDataset.indexOf(eachOrg) > 0) {
								oFromOrg.push(eachOrg);
							}
						}.bind(this));
						item.FromOrg = oFromOrg.toString()

					},
					error: function (error) {
					}
				});
			}
		},
		_getSecurityTokenAjax: function () {
			let token;
			let requestUrl = "/sap/opu/odata/sap/ZGRAC_USER_ACCESS_MANAGE_SRV/?saml2=disabled";
			$.ajax({
				type: 'GET',
				url: requestUrl,
				async: false,
				beforeSend: function (requestGET) {
					requestGET.setRequestHeader('X-CSRF-Token', 'Fetch');
				},
				success: function (data, textStatus, requestGET) {
					token = requestGET.getResponseHeader("X-CSRF-Token");
				},
				error: function (requestGET) {
					token = requestGET.getResponseHeader("X-CSRF-Token");
				}
			});
			return token;

		}

	})
});
