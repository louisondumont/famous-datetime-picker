
// define this module in Require.JS
define(function(require, exports, module) {

    // Import additional modules to be used in this view 
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var DateView = require('views/DateView');
    var TimeView = require('views/TimeView');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    
    // Constructor function for our WhenView class
    function WhenView() {

        // Applies View's constructor function to WhenView class
        View.apply(this, arguments);
        
        var layout = new HeaderFooterLayout();

        // Background | TOFIX: should find a better way. 
        var bgSurface = new Surface({
            size: [undefined, 252],
            classes: ['bg-jogabo']
        });
        layout.header.add(bgSurface);

        // Header
        var leftButton = '<a class="white cross-ico ico title-ico" icon="arrow-left" data-transition="slide-left"></a>';
        var title = '<h2 class="ellipsis title">Select date and time</h2>';
        var rightButton = '<a class="title-btn next" href="#">Next</a>';

        layout.header.add(new Surface({
            content: leftButton + title + rightButton,
            classes: ['title-header'],
            properties: {
                lineHeight: '44px'
            }
        }));

        // Content  
        var flex = new FlexibleLayout({
            ratios: [true, 1],
            direction: FlexibleLayout.DIRECTION_Y
        });

        var subViews = [];
        flex.sequenceFrom(subViews);
        
        var dateView = new DateView();
        var timeView = new TimeView();

        subViews.push(dateView);
        subViews.push(timeView);

        layout.content.add(flex);

        // Gap between the both views
        timeView.eventHandler.on('timeSelected', function(newTime) {
            dateView.updateTime(newTime);
        });
        
        this.add(layout);
    }

    // Establishes prototype chain for WhenView class to inherit from View
    WhenView.prototype = Object.create(View.prototype);
    WhenView.prototype.constructor = WhenView;

    // Default options for WhenView class
    WhenView.DEFAULT_OPTIONS = {};

    module.exports = WhenView;
});
