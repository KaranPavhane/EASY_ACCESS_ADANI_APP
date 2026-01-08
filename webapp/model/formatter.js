sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		ApproverDate: function (sValue) {
		},
		AccessRequestStatusText: function (sValue) {
			if (sValue === "FINISHED") {
				return "Finish";
			} else if (sValue === "RUNNING") {
				return "Running";
			} else {
				return "Aborted";
			}
		},
		AccessRequestStatusState: function (sValue) {
			if (sValue === "FINISHED") {
				return "Success";
			} else if (sValue === "RUNNING") {
				return "Information";
			} else if (sValue === "ABORTED") {
				return "Error";
			} else {
				return "Error";
			}
		},
		weightStateColoEnabledr: function (sValue) {
			if (sValue === "X") {
				return true;
			} else {
				return false;
			}
		},
		weightStatusText: function (sValue) {
			if (sValue === "X") {
				return "Expired";
			} else {
				return "Active";
			}
		},
		weightStateType: function (sValue) {
			if (sValue === "X") {
				return "Error";
			} else {
				return "Success";
			}
		},
		// weightStateVisible:function(sValue){
		// 	if (sValue === "X") {
		// 		return "false";
		// 	} else {
		// 		return "true";
		// 	}
		// },
		weightStateIcon: function (sValue) {
			if (sValue === "X") {
				return "sap-icon://status-negative";
			} else {
				return "sap-icon://status-positive";
			}
		},
		weightEnabled: function (sValue) {

			if (sValue === "X") {
				return true;
			} else {
				return false;
			}
		},
		weightState: function (sValue) {

			if (sValue === "X") {
				return "sap-icon://private";
			} else {
				return "sap-icon://unlocked";
			}
		},
		weightStateColor: function (sValue) {
			if (sValue === "X") {
				return "Error";
			} else if (sValue === "XP") {
				return "Warning";
			} 
			else {
				return "Success";
			}
		},
		statusText: function (sStatus) {

			if (sStatus === "X") {
				return true;
			} else {
				return false;
			}
		}

	};

});