
// define this module in Require.JS
define(function(require, exports, module) {

    // Import additional modules to be used in this view 
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var Utility = require('famous/utilities/Utility');
    var DateScrollView = require('views/DateScrollView');
    var DateUtils = require('../lib/DateUtils');

    /**
     * @desc Construtor for DateView class
     */
    function DateView() {

        // Applies View's constructor function to DateView class
        View.apply(this, arguments);

        // SequentialLayout vertical
        var sequentialLayout = new SequentialLayout({
            direction: Utility.Direction.Y,
            classes: ['dateLayout']
        });
        var elements = [];
        sequentialLayout.sequenceFrom(elements);

        // Month
        this.monthSurface = new Surface({
            size:[undefined, 85],
            classes: ['pad-left', 'month']
        });
        elements.push(this.monthSurface);

        // DateScrollView, container: hide pre-loaded weeks
        container = new ContainerSurface({
            size: [undefined, 63],
            properties: {
                overflow: 'hidden',
                classes: ['week-cal', 'pad-top']
            }
        });
        this.dateScrollview = new DateScrollView();
        container.add(this.dateScrollview);
        elements.push(container);

        // handle dateScrollview events
        this.dateScrollview.eventHandler.on('dateSelected', function(newDate) {
            updateDateTime.call(this);
        }.bind(this));

        // Exact date
        this.exactDateSurface = new Surface({
            size: [undefined, 104],
            classes: ['pad-2x', 'center-text', 'exactDate', 'month']
        });
        elements.push(this.exactDateSurface);

        this.add(sequentialLayout);

        // Gap with parent
        this.updateTime = function(time) {
            this.selectedTime = time;
            updateDateTime.call(this);
        };
        this.selectedTime = new Date();
        this.selectedTime = this.selectedTime.getHours() + ':00';

        // initial contents
        updateDateTime.call(this);
    }

    /**
     * @desc Update date and time captions
     */
    function updateDateTime() {
            var newDate = this.dateScrollview.selectedDate;
            var newTime =  this.selectedTime;

            // Update month
            var mth = newDate.getMonth();
            var year = newDate.getFullYear();
            var monthYear = DateUtils.month[mth] + ' ' + year;
            this.monthSurface.setContent(monthYear);

            // Update exact date
            var day = newDate.getDay();
            var date = newDate.getDate();
            this.exactDateSurface.setContent('<p>' + DateUtils.weekday[day] + ' ' + DateUtils.month[mth] + ' ' + date + DateUtils.getExt(date) + '</p><p>' + newTime + '</p>');
    }

    // Establishes prototype chain for EmptyView class to inherit from View
    DateView.prototype = Object.create(View.prototype);
    DateView.prototype.constructor = DateView;

    // Default options for EmptyView class
    DateView.DEFAULT_OPTIONS = {};

    // Define your helper functions and prototype methods here

    module.exports = DateView;
});
