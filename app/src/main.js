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
    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface')
    var TextNodeSurface = require('./TextNodeSurface');

    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    var logo = new TextNodeSurface({
        // size: [200, 200],
        content: '/content/images/famous_logo.png',
        classes: ['absoluteFit']
    });
    window.surface = logo;

    var initialTime = Date.now();
    var centerSpinModifier = new Modifier({
        origin: [0.25, 0.25],

        // transform : function() {
        //     return Transform.rotateY(.002 * (Date.now() - initialTime));
        // }
    });
window.csm = centerSpinModifier;
window.t = function() {
            return Transform.rotateY(.002 * (Date.now() - initialTime));
        }
    mainContext.add(centerSpinModifier).add(logo);
});
