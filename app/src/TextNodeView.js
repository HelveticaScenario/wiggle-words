define(function(require, exports, module) {
	var Utils = require('utils');
	var View = require('famous/core/View');
	var StateModifier = require('famous/core/Modifier');
	var TextNodeSurface = require('TextNodeSurface')

	function TextNodeView (textNodeOptions,stateModifierOptions,viewOptions) {
		View.call(this,viewOptions);
		this.stateModifier = new StateModifier(stateModifierOptions);
		this.textNode = new TextNodeSurface(textNodeOptions);
		this.add(this.stateModifier).add(this.textNode);
	}
	TextNodeView.prototype = Object.create(View.prototype);
	TextNodeView.prototype.constructor = TextNodeView;

	module.exports = TextNodeView;
});