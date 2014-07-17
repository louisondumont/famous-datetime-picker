
/*globals define*/
define('main', function(require, exports, module) {
    "use strict";

  // Dependencies
  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  var WhenView = require('views/WhenView');

  // Create context
  var mainContext = Engine.createContext();

  // Render the requested view
  var theView = new WhenView();
  mainContext.add(theView);  
});
