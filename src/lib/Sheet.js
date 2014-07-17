define(function(require, exports, module) {
	var sheet = (function() {
		var style = document.createElement("style");
		style.appendChild(document.createTextNode(""));
		document.head.appendChild(style);
		return style.sheet;
	})();

	function addRule(sheet, selector, rules, index) {
		if(sheet.insertRule) {
			sheet.insertRule(selector + "{" + rules + "}", index);
		}
		else {
			sheet.addRule(selector, rules, index);
		}
	}

	function deleteRule(sheet, index) {
		sheet.deleteRule(index);
	}

	module.exports = {
		addRule: addRule,
		deleteRule: deleteRule
	};
});