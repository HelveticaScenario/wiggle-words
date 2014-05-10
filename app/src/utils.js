define(function(require, exports, module) {
	var Utils = {
		transparentApply: function transparentApply(fun, that, args) {
	        return fun.apply(that,Array.prototype.slice.apply(args));
	    }
	}
	module.exports = Utils;
})