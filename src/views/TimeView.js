
// define this module in Require.JS
define(function(require, exports, module) {

    // Import additional modules to be used in this view 
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var TimeScrollView = require('views/TimeScrollView');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var EventHandler = require('famous/core/EventHandler');

    /**
     * @desc Constructor for TimeView class
     */
     function TimeView() {

        // Applies View's constructor function to TimeView class
        View.apply(this, arguments);

        var timeScrollView = new TimeScrollView();

        // visible container
        timeSVContainer = new ContainerSurface({
            size: [undefined, undefined],
            classes: ['bg-play'],
            properties: {
                overflow: 'hidden'
            }
        });

        timeSVContainer.add(timeScrollView);
        console.log(timeSVContainer);

        this.add(timeSVContainer);
        
        // Reroute events: ommunicate with parent
        this.eventHandler = new EventHandler();
        this.eventHandler.subscribe(timeScrollView.eventHandler);
    }

    // Establishes prototype chain for EmptyView class to inherit from View
    TimeView.prototype = Object.create(View.prototype);
    TimeView.prototype.constructor = TimeView;

    // Default options for EmptyView class
    TimeView.DEFAULT_OPTIONS = {};

    // Define your helper functions and prototype methods here

    module.exports = TimeView;
});
