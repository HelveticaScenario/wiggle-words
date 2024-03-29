
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Utils = require('utils');
    var Context = require('famous/core/Context');
    var el = document.createElement("div");
    el.classList.add("hide");
    document.body.appendChild(el);
    var tmpContext = new Context(el);

	var usePrefix = document.body.style.webkitTransform !== undefined;
	var devicePixelRatio = window.devicePixelRatio || 1;


	function TextSurface() {
		Utils.transparentApply(Surface,this,arguments);
        tmpContext._node.set(this);
        this.commit(tmpContext._nodeContext);
		var i = 0;
        var target = this._currTarget;
        // this.eventHandler.emit('recall');
        this.recall(target);
        target.style.display = 'none';
        target.style.width = '';
        target.style.height = '';
        // this._size = null;
        _cleanupStyles.call(this, target);
        var classList = this.getClassList();
        _cleanupClasses.call(this, target);
        for (i = 0; i < classList.length; i++) target.classList.remove(classList[i]);
        if (this.elementClass) {
            if (this.elementClass instanceof Array) {
                for (i = 0; i < this.elementClass.length; i++) {
                    target.classList.remove(this.elementClass[i]);
                }
            }
            else {
                target.classList.remove(this.elementClass);
            }
        }
        _removeEventListeners.call(this, target);
        this._currTarget = null;
        tmpContext._allocator.deallocate(target);
        _setInvisible(target);
	}
	TextSurface.prototype = Object.create(Surface.prototype);
	TextSurface.prototype.constructor = TextSurface;
    //  Attach Famous event handling to document events emanating from target
    //    document element.  This occurs just after deployment to the document.
    //    Calling this enables methods like #on and #pipe.
    function _addEventListeners(target) {
        for (var i in this.eventHandler.listeners) {
            target.addEventListener(i, this.eventForwarder);
        }
    }

    //  Detach Famous event handling from document events emanating from target
    //  document element.  This occurs just before recall from the document.
    function _removeEventListeners(target) {
        for (var i in this.eventHandler.listeners) {
            target.removeEventListener(i, this.eventForwarder);
        }
    }

     //  Apply to document all changes from removeClass() since last setup().
    function _cleanupClasses(target) {
        for (var i = 0; i < this._dirtyClasses.length; i++) target.classList.remove(this._dirtyClasses[i]);
        this._dirtyClasses = [];
    }

    // Apply values of all Famous-managed styles to the document element.
    //  These will be deployed to the document on call to #setup().
    function _applyStyles(target) {
        for (var n in this.properties) {
            target.style[n] = this.properties[n];
        }
    }

    // Clear all Famous-managed styles from the document element.
    // These will be deployed to the document on call to #setup().
    function _cleanupStyles(target) {
        for (var n in this.properties) {
            target.style[n] = '';
        }
    }

    /**
     * Return a Matrix's webkit css representation to be used with the
     *    CSS3 -webkit-transform style.
     *    Example: -webkit-transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,716,243,0,1)
     *
     * @method _formatCSSTransform
     * @private
     * @param {FamousMatrix} m matrix
     * @return {string} matrix3d CSS style representation of the transform
     */
    function _formatCSSTransform(m) {
        m[12] = Math.round(m[12] * devicePixelRatio) / devicePixelRatio;
        m[13] = Math.round(m[13] * devicePixelRatio) / devicePixelRatio;

        var result = 'matrix3d(';
        for (var i = 0; i < 15; i++) {
            result += (m[i] < 0.000001 && m[i] > -0.000001) ? '0,' : m[i] + ',';
        }
        result += m[15] + ')';
        return result;
    }

    /**
     * Directly apply given FamousMatrix to the document element as the
     *   appropriate webkit CSS style.
     *
     * @method setMatrix
     *
     * @static
     * @private
     * @param {Element} element document element
     * @param {FamousMatrix} matrix
     */

    var _setMatrix;
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        _setMatrix = function(element, matrix) {
            element.style.zIndex = (matrix[14] * 1000000) | 0;    // fix for Firefox z-buffer issues
            element.style.transform = _formatCSSTransform(matrix);
        };
    }
    else if (usePrefix) {
        _setMatrix = function(element, matrix) {
            element.style.webkitTransform = _formatCSSTransform(matrix);
        };
    }
    else {
        _setMatrix = function(element, matrix) {
            element.style.transform = _formatCSSTransform(matrix);
        };
    }

    // format origin as CSS percentage string
    function _formatCSSOrigin(origin) {
        return (100 * origin[0]).toFixed(6) + '% ' + (100 * origin[1]).toFixed(6) + '%';
    }

     // Directly apply given origin coordinates to the document element as the
     // appropriate webkit CSS style.
    var _setOrigin = usePrefix ? function(element, origin) {
        element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
    } : function(element, origin) {
        element.style.transformOrigin = _formatCSSOrigin(origin);
    };

     // Shrink given document element until it is effectively invisible.
    var _setInvisible = usePrefix ? function(element) {
        element.style.webkitTransform = 'scale3d(0.0001,0.0001,1)';
        element.style.opacity = 0;
    } : function(element) {
        element.style.transform = 'scale3d(0.0001,0.0001,1)';
        element.style.opacity = 0;
    };

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }


    function _hideTarget (target) {
        var oldVisibility = target.style.visibility;
        target.style.visibility = 'hidden';
        return oldVisibility;
    }

    function _showTarget (target, visibilityVal) {
        target.style.visibility = visibilityVal;
    }

    TextSurface.prototype.getSize = function getSize (actual) {
        if(this._currTarget){
            // this._currTarget.style.width = '';
            // this._currTarget.style.height = '';
            return [this._currTarget.clientWidth, this._currTarget.clientHeight];
            
            
        }
        return actual ? this._size : (this.size || this._size || [0,0]);
    }

	TextSurface.prototype.setSize = function setSize () {
        if(this._currTarget){
            // this._currTarget.style.width = '';
            // this._currTarget.style.height = '';
			this.size = [this._currTarget.clientWidth, this._currTarget.clientHeight];
        	
        	// console.log(this.size)
		}
        this._sizeDirty = true;
	}

    TextSurface.prototype.commit = function commit(context) {
        if (!this._currTarget) this.setup(context.allocator);
        var target = this._currTarget;

        var matrix = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        var visibilityVal = _hideTarget(target);
        if (this._contentDirty) {
        	// logSize(target);
            this.deploy(target);
            this.eventHandler.emit('deploy');
            this._contentDirty = false;
            this.setSize();
            // logSize(target);
        }

        if (this.size) {
            var origSize = size;
            size = [this.size[0], this.size[1]];
            if (size[0] === undefined && origSize[0]) size[0] = origSize[0];
            if (size[1] === undefined && origSize[1]) size[1] = origSize[1];
        }

        if (_xyNotEquals(this._size, size)) {
            this._size = [size[0], size[1]];
            this._sizeDirty = true;
        }

        if (!matrix && this._matrix) {
            this._matrix = null;
            this._opacity = 0;
            _setInvisible(target);
            return;
        }

        if (this._opacity !== opacity) {
            this._opacity = opacity;
            target.style.opacity = (opacity >= 1) ? '0.999999' : opacity;
        }

        if (_xyNotEquals(this._origin, origin) || Transform.notEquals(this._matrix, matrix) || this._sizeDirty) { // 
            if (!matrix) matrix = Transform.identity;
            this._matrix = matrix;
            var aaMatrix = matrix;
            if (origin) {
                if (!this._origin) this._origin = [0, 0];
                this._origin[0] = origin[0];
                this._origin[1] = origin[1];
                aaMatrix = Transform.moveThen([-this._size[0] * origin[0], -this._size[1] * origin[1], 0], matrix);
            }
            _setMatrix(target, aaMatrix);
        }

        if ((this._classesDirty || this._stylesDirty || this._sizeDirty || this._contentDirty)){

	        if (this._classesDirty) {
	            _cleanupClasses.call(this, target);
	            var classList = this.getClassList();
	            for (var i = 0; i < classList.length; i++) target.classList.add(classList[i]);
	            this._classesDirty = false;
	        }
	        if (this._stylesDirty) {
	            _applyStyles.call(this, target);
	            this._stylesDirty = false;
	        }
	        
	        if (this._sizeDirty) {
	            if (this._size) {
	                // target.style.width = (this._size[0] !== true) ? this._size[0] + 'px' : '';
	                // target.style.height = (this._size[1] !== true) ? this._size[1] + 'px' : '';
	            }
	            this._sizeDirty = false;
	        }
	    }
        _showTarget(target, visibilityVal);
    };

    module.exports = TextSurface;
})
