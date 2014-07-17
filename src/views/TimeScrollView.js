/*** TimeScrollView ***/

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ScrollView = require('famous/views/Scrollview');
    var Utility = require('famous/utilities/Utility');
    var GenericSync = require('famous/inputs/GenericSync');
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var EventHandler = require('famous/core/EventHandler');
    var normalizeTime = require('../lib/normalizeTime');

    /** 
     * @desc TimeScrollView constructor 
     */    
    function TimeScrollView() {
        View.apply(this, arguments);
                
        // init vars
        var conf = {
            offset: 4    // number of weeks we want to preload
        };
        var currentIndex = 0;
        this.surfaces = [];
        this.selectedSurface = 1;

        // scrollview
        scrollView = new ScrollView({
            direction: Utility.Direction.Y,
            paginated: true
        });

        // touch/mouse listening
        GenericSync.register({
            "mouse" : MouseSync,
            "touch" : TouchSync
        });
        sync = new GenericSync(
            ["mouse", "touch"],
            {direction : GenericSync.DIRECTION_Y}
        );
        
        // communicate with parent
        this.eventHandler = new EventHandler();
 
        // Bind&Pipe
        scrollView.sequenceFrom(this.surfaces); // connect surfaces <=> scrollView
        sync.pipe(scrollView);

        // Swipe tracking for events
        enableSwipeTracking(scrollView);

        // Initialization: 24 hours
        setContent.call(this);

        this.add(scrollView);
    }

    /** 
     * @desc Create surfaces (1/2 hours), pipe, listen and add 
     *  to the scrollview
     */
    function setContent() {

        // 24 / (1/2 hours)
        var howmany = 48;

        var hourContentBase = '<a class="item retina line line-gray time" href="#">';
        var hourContentEnd = '</a>';

        for (var i = 0, temp; i < howmany; i++) {
            var hours = normalizeTime((i/2)-((i%2)/2));
            var minutes = normalizeTime((i%2)*30);
            
            var type = '';
            if(hours >= 12) {
                type = 'PM';
                if(hours != 12) hours = hours - 12;
            } else type = 'AM';

            // create the surface
            temp = new Surface({
                content: hourContentBase + hours + ':' + minutes + ' ' + type + hourContentEnd,
                size: [undefined, 39]
            });

            // pipe
            temp.pipe(sync);

            // add to the scrollview surfaces
            this.surfaces.push(temp);

            // listen for click on a time
            var index = this.surfaces.length-1;
            this.surfaces[index].on('click', function(surfaceIndex) {
                if(!this.surfaces[surfaceIndex].isSwiping) return false;

                // extract only the time
                var selectedTime = this.surfaces[surfaceIndex].getContent()
                                    .replace(hourContentBase, '')
                                    .replace(hourContentEnd, '');

                // Fire the event 
                this.eventHandler.emit('timeSelected', selectedTime);
                    
                    // Classes
                this.surfaces[this.selectedSurface].removeClass('selected');
                this.surfaces[surfaceIndex].addClass('selected');

                this.selectedSurface = surfaceIndex;
            }.bind(this, index));
        }
    }

    /**
     * @desc Update isSwiping boolean so we can differentiate a click from a swipe
     * @param {Scrollview} scrollview Scrollview to monitor
     */
    function enableSwipeTracking(scrollview) {
        scrollview.on('update', function() {
            scrollview.isSwiping = true;
        });
        scrollview.on('end', function(){
            setTimeout(function() {
                scrollview.isSwiping = false;
            }, 300);
        });
    }

    TimeScrollView.prototype = Object.create(View.prototype);
    TimeScrollView.prototype.constructor = TimeScrollView;

    TimeScrollView.DEFAULT_OPTIONS = {};

    module.exports = TimeScrollView;
});
