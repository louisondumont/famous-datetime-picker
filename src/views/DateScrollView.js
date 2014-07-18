/*** DateScrollView ***/

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ScrollView = require('famous/views/Scrollview');
    var Utility = require('famous/utilities/Utility');
    var GenericSync = require('famous/inputs/GenericSync');
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var EventHandler = require('famous/core/EventHandler');
    var Sheet = require('../lib/Sheet')
    var DateUtils = require('../lib/dateUtils');
  
    /** 
     * @desc DateScrollView constructor
     * @return {View} View containing the scrollview
     */
    function DateScrollView() {
        View.apply(this, arguments);
                
        // init vars
        this.conf = {
            offset: 5    // number of weeks we want to preload
        };
        this._currentIndex = 0;
        this._surfaces = [];
        this.selectedDate = new Date();
        this.lastDate = new Date();
        this.isBeingSwiped = false;

        // Mouse/Touch Sync
        GenericSync.register({
            'mouse' : MouseSync,
            'touch' : TouchSync
        });
        this.genericSync = new GenericSync(
            ['mouse', 'touch'],
            {direction : GenericSync.DIRECTION_X}
        );
        
        // Scrollview
        this.scrollView = new ScrollView({
            direction: Utility.Direction.X,
            paginated: true,
            friction: 0.10
        });
        
        // Bind&Pipe
        this.scrollView.sequenceFrom(this._surfaces);
        this.genericSync.pipe(this.scrollView);

        // Event handler
        this.eventHandler = new EventHandler();

        // Listeners
        _monitor.call(this);

        // Initial content
        var initialDate = new Date(this.selectedDate);
        initialDate.setDate(initialDate.getDate() - initialDate.getDay());
        _setContent.call(this, initialDate, 3);

        // Put initial selected css
        setCSSOnDay(this.selectedDate.getDay());

        this.add(this.scrollView);
    }

    /** 
     * @desc Generate week innerHTML surface content
     * @param {Date} startDate Date (Sunday) to start
     *
     * @return {String} Week InnerHtml
     */
    function generateWeek(startDate) {
        var startDate = new Date(startDate);
        var week = '<table class="week-table full-width" style="width:100%">' +
                        '<tbody>' +
                            '<tr>';
        for(var i = 0; i < 7; i++) {
            week += '<td>' + 
                       '<a id="' + DateUtils.weekday[i] + '">' +
                            '<div class="week-day-name">' + DateUtils.weekday[i].substring(0,2) + '</div>' + 
                            '<div class="week-day-value">' + startDate.getDate() + '</div>' + 
                        '</a>' +
                    '</td>';

            startDate.setDate(startDate.getDate() + 1);
       }
       week +=              '</tr>' +
                        '</tbody>' +
                    '</table>';
        return week;
    }

    /** 
     * @desc Create new weeks, pipe events, and add to the queue
     * @param {Date} startDate Date (Sunday) to start from
     * @param {Number} howmany How many weeks I should create?
     */
    function _setContent(startDate, howmany) {
        howmany = howmany || 1; 
        for (var j = 0, temp; j < howmany; j++) {

            // create the surface
            temp = new Surface({
                content: generateWeek(startDate),
                size: [undefined, undefined]
            });

            // pipe
            temp.pipe(this.genericSync);

            // add to the scrollview surfaces
            this._surfaces.push(temp);
            
            // listen for click to select the day
            this._surfaces[this._surfaces.length-1].on('click', function(e) {
                if(this.isBeingSwiped === false) {
                    _daySelected.call(this, e);
                }
            }.bind(this));

            // increment
            startDate.setDate(startDate.getDate() + 7);
            if( j == howmany -1) {
                this.lastDate = startDate;
            }
         }
    }

    /** 
     * @desc Listen to touch/mouse gestures on the scrollview
     */
    function _monitor() {

        // swipe/click differentiate
        this.genericSync.on('update', function() {
            this.isBeingSwiped = true;
        }.bind(this));

        // page changed bug hack fix
        this.genericSync.on('end', function(e) {
            setTimeout(function() {
                this.isBeingSwiped = false;
            }.bind(this), 300);

            var backupIndex = this._currentIndex;
            var position = this.scrollView.getPosition();
            var goingSomewhere = position > (this._surfaces[this.scrollView._node.index]._currTarget.offsetWidth/2);
            var newIndex = this.scrollView._node.index;
            if(newIndex != this._currentIndex || goingSomewhere) { 
                
                // something happened
                var value = 0;
                if(goingSomewhere !== 0) {
                    value = (e.position < 0 ) ? 1 : 0;  
                }
                this._currentIndex = newIndex + value;
                this.eventHandler.emit('pageChanged', {
                    page: this._currentIndex,
                    delta: this._currentIndex - backupIndex
                });
            }
        }.bind(this));

        // listen for pageChanged for infnite scrolling
        this.eventHandler.on('pageChanged',function(e){

            // debugging
            console.log('pageChanged fired. Page:' + e.page + ' Delta: ' + e.delta);

            // check if we reached the end (infinite scrolling)
            if((this._currentIndex + this.conf.offset) >= (this._surfaces.length-1)) {
                _setContent.call(this, this.lastDate, 1);
            }

            // increment the current date by the number of pages swiped
            this.selectedDate.setDate(this.selectedDate.getDate() + e.delta * 7);

            // Fire the event
            this.eventHandler.emit('dateSelected', this.selectedDate);
        }.bind(this)); 
    }

    /** 
     * @desc Set the new day selected from the pos of the click
     * @param {Object} e Event (pos x y ...)
     */
    function _daySelected(e) {
        var day = Math.floor((e.x * 7)/ window.innerWidth);

        // Edit css
        setCSSOnDay(day);

        // Update selectedDate
        var dayOfTheMonth = (this.selectedDate.getDate() - this.selectedDate.getDay() + day)
        this.selectedDate.setDate(dayOfTheMonth);

        this.eventHandler.emit('dateSelected', this.selectedDate);
    }

    /** 
     * @desc Set 'selected CSS' rule on specified day
     * @param {Number} day Day (in week format 0-6)
     */
    function setCSSOnDay(day) {
        Sheet.deleteRule(document.styleSheets[0], 0);
        var selectedStyle = 'border-radius:50%;-webkit-box-shadow:0 0 0 1px #cff700;box-shadow:0 0 0 1px #cff700';
        Sheet.addRule(document.styleSheets[0], '#' + DateUtils.weekday[day] + ' .week-day-value', selectedStyle, 0);
    }
  
    DateScrollView.prototype = Object.create(View.prototype);
    DateScrollView.prototype.constructor = DateScrollView;

    DateScrollView.DEFAULT_OPTIONS = {};
   
    module.exports = DateScrollView;
});
