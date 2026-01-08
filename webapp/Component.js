sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "com/new/prjt/znew_arm_prjt/model/models",
	"sap/ui/model/json/JSONModel"
], function (e, t, i, JSONModel) {
	"use strict";
	return e.extend("com.new.prjt.znew_arm_prjt.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			e.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.setModel(i.createDeviceModel(), "device");

			//defining model for navigation
			var oModel = new JSONModel();
			this.setModel(oModel, "navModel");
			this.setModel(i.createJSONModel(), "REVIEWmODEL");
			var datarr = {
				"REVIEWmODEL": []
			};
			this.getModel("REVIEWmODEL").setData(datarr);
			this.setModel(i.createJSONModel("","TwoWay"), "FFVlid");
			var ffvData = {
				"ffvData": []
			};
			this.getModel("FFVlid").setData(ffvData);
			this.setModel(i.createJSONModel(), "FireFiIds");
			var oFireFiIds = {
				"FireFiId": []
			};
			this.getModel("FireFiIds").setData(oFireFiIds);
			this.setModel(i.createJSONModel(), "FireFiIdsel");
			var oFireFiIdsel = {
				"FireFiId": []
			};
			this.getModel("FireFiIdsel").setData(oFireFiIdsel);
			this.setModel(i.createJSONModel(), "TcodeModel");
			var tCode = {
				"TcodeData": []
			};
			this.getModel("TcodeModel").setData(tCode);
			this.setModel(i.createJSONModel(), "PersonalInfoSet");
			var userData = {
				"user": []
			};
			this.getModel("PersonalInfoSet").setData(userData);
			this.setModel(i.createJSONModel(), "TcodeModelMod");
			var tCodeMod = {
				"TcodeData": []
			};
			this.getModel("TcodeModelMod").setData(tCodeMod);
			this.setModel(i.createJSONModel(), "OrgTableModel");
			var orgData = {
				"OrgData": []
			};
			this.getModel("OrgTableModel").setData(orgData);
			this.getModel("OrgTableModel").setDefaultBindingMode("TwoWay");
			
			//varun
			this.setModel(i.createJSONModel(), "TreeModel");
			var treeData = {
				"treeData": []
			};
			this.getModel("TreeModel").setData(treeData);

			this.setModel(i.createJSONModel(), "AuthOrgTableModel");
			var orgData = {
				"OrgData": []
			};
			this.getModel("AuthOrgTableModel").setData(orgData);

			this.setModel(i.createJSONModel(), "OrgTableModelMod");
			var orgDataMod = {
				"OrgData": []
			};
			this.getModel("OrgTableModelMod").setData(orgDataMod);
			this.getModel("OrgTableModelMod").setDefaultBindingMode("TwoWay");
			
			this.setModel(i.createJSONModel(), "AttInfoModel");
			var AttData = {
				"AttInfoData": []
			};
			this.getModel("AttInfoModel").setData(AttData);
			
			this.setModel(i.createJSONModel(), "AttInfoModelAdani");
			var AttData = {
				"AttInfoData": []
			};
			this.getModel("AttInfoModelAdani").setData(AttData);
			
			this.setModel(i.createJSONModel(), "AttInfoModelThird");
			var AttData = {
				"AttInfoData": []
			};
			this.getModel("AttInfoModelThird").setData(AttData);

			this.setModel(i.createJSONModel(), "RemAttInfoModel");
			var AttDataRem = {
				"AttInfoData": []
			};
			this.getModel("RemAttInfoModel").setData(AttDataRem);
			
			this.setModel(i.createJSONModel(), "AttInfoModelMod");
			var AttDataMod = {
				"AttInfoData": []
			};
			this.getModel("AttInfoModelMod").setData(AttDataMod);


			this.setModel(i.createJSONModel(), "FFInfoModelMod");
			var AttDataMod = {
				"AttInfoData": []
			};
			this.getModel("FFInfoModelMod").setData(AttDataMod);


			this.setModel(i.createJSONModel(), "RiskInfoModel");
			var RiskData = {
				"RiskInfoData": []
			};
			this.getModel("RiskInfoModel").setData(RiskData);

			this.setModel(i.createJSONModel(), "RiskInfoModelMod");
			var RiskData1 = {
				"RiskInfoData": []
			};
			this.getModel("RiskInfoModelMod").setData(RiskData1);

			this.setModel(i.createJSONModel(), "RoleInfoModel");
			var RoleData = {
				"RolInfoData": []
			};
			this.getModel("RoleInfoModel").setData(RoleData);

			this.setModel(i.createJSONModel(), "AuthRoleInfoModel");
			var AuthRoleData = {
				"RolInfoData": []
			};
			this.getModel("AuthRoleInfoModel").setData(AuthRoleData);

			this.setModel(i.createJSONModel(), "AuthSubRoleInfoModel");
			var RoleData2 = {
				"RolInfoData": []
			};
			this.getModel("AuthSubRoleInfoModel").setData(RoleData2);

			this.setModel(i.createJSONModel(), "RoleInfoModel1");
			var RoleData1 = {
				"RolInfoData1": []
			};
			this.getModel("RoleInfoModel1").setData(RoleData1);

			this.setModel(i.createJSONModel(), "RoleInfoModel2");
			var RoleData2 = {
				"RolInfoData2": []
			};
			this.getModel("RoleInfoModel2").setData(RoleData2);

			this.setModel(i.createJSONModel(), "ExistRoleModel");
			var RolData = {
				"RoleData": []
			};
			this.getModel("ExistRoleModel").setData(RolData);

			this.setModel(i.createJSONModel(), "RoleInfoModelMod");
			var RoleDataMod = {
				"RolInfoData": []
			};
			this.getModel("RoleInfoModelMod").setData(RoleDataMod);

			this.setModel(i.createJSONModel(), "SysLandInfo");
			var sysData = {
				"SysLaData": []
			};
			this.getModel("SysLandInfo").setData(sysData);
			this.setModel(i.createJSONModel(), "SeleSysLandInfo");
			var selsysData = {
				"sleSysLaData": []
			};
			this.getModel("SeleSysLandInfo").setData(selsysData);
			this.setModel(i.createJSONModel(), "SysLandInfoFF");
			var sysDataFF = {
				"SysLaData": []
			};
			this.getModel("SysLandInfoFF").setData(sysDataFF);
			this.setModel(i.createJSONModel(), "SeleSysLandInfoFF");
			var selsysDataFF = {
				"sleSysLaData": []
			};
			this.getModel("SeleSysLandInfoFF").setData(selsysDataFF);
			this.setModel(i.createJSONModel(), "userInfo");
			this.setModel(i.createJSONModel(), "userInfo1");
			this.setModel(i.createJSONModel(), "userInfoRem");
			this.setModel(i.createJSONModel(), "userInfoNew");
			this.setModel(i.createJSONModel(), "SysLandInfoMod");
			var osysData = {
				"SysLaData": []
			};
			this.getModel("userInfoRem").setDefaultBindingMode("TwoWay");
			this.getModel("SysLandInfoMod").setData(osysData);
			this.setModel(i.createJSONModel(), "SeleSysLandInfoMod");
			var selsysDataMod = {
				"sleSysLaData": []
			};
			this.getModel("SeleSysLandInfoMod").setData(selsysDataMod);

			var oModel1 = new JSONModel();
			this.setModel(oModel1, "oForceLogout");

			var oUserDetailsModel = new JSONModel();
			this.setModel(oUserDetailsModel, "UserDetailsModel");
			
		}
	});
});