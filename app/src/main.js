/* globals define */
// function logSize(e){
//     var clients = ["clientHeight", "clientWidth", "clientTop", "clientLeft","offsetHeight", "offsetWidth", "offsetTop", "offsetLeft"];
//     function createClientDimensionsOnj (obj, key) {
//         obj[key] = e[key];
//         return obj;
//     }
//     console.log(e.childNodes[0],clients.reduce(createClientDimensionsOnj,{}));
// }

// var e = document.createElement("div");
// e.className = "absoluteFit"
// var text = e.appendChild(document.createTextNode(" asdas"));
// document.body.appendChild(e);
// logSize(e);
// e.remove()


define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = window.Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface')
    var TextNodeView = require('./TextNodeView');
    var TextNodeSurface = require('./TextNodeSurface');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var View  = require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Utility = require('famous/utilities/Utility');

    // create the main context
    var mainContext = Engine.createContext();
    var classes = ['absoluteFit', 'backfaceVisibility'];
    var strArr = "h e e e e".split('');

    var nodeArray = strArr.map(function(e) {
        return new TextNodeSurface({
            content: e,
            classes: classes
        });
    })
    window.arr = nodeArray;
    // your app here
    // var logo2 = new TextNodeView({
    //     content: '/content/images/famous_logo.png',
    //     classes: ['absoluteFit', 'backfaceVisibility']
    // });

    var sl = new SequentialLayout({
        direction: Utility.Direction.X
    });
    sl.sequenceFrom(nodeArray);
    // sl.sequenceFrom([logo]);

    var initialTime = Date.now();
    var centerSpinModifier = new Modifier({
        origin: [0.5, 0.5],

        transform : function() {
            return Transform.rotateY(.002 * (Date.now() - initialTime));
        }
    });
// window.csm = centerSpinModifier;
// window.t = function() {
//             return Transform.rotateY(.002 * (Date.now() - initialTime));
//         }
    mainContext.add(centerSpinModifier).add(sl);
});
