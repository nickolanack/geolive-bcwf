//bar graph
<?php
    Behavior('graph');
?>



(function() {


    var BCWFTimeline = new Class_({

        initialize: function(timeline, options) {

            this._container = timeline.element;
            this._timeline = timeline;
            this.options = Object.append({
                smallGraph: {
                    lineTemplate: UIGraph.UnitStepBarsTemplate,
                    //lineTemplate:UIGraph.LineTemplate,
                    title: "",
                    height: 26,
                    width: 100,
                    widthUnit: '%',
                    padding: 0,
                    lineColor: 'black',
                    fillGradient: true,
                    fillGradientArray: [
                        'rgba(0, 0, 0, 0.5)',
                        'rgba(0, 0, 0, 0.5)'
                    ]
                },
                activeGraph: {
                    //lineTemplate:UIGraph.CubicSplineTemplate,
                    lineTemplate: UIGraph.UnitStepBarsTemplate,
                    //lineTemplate:UIGraph.LineTemplate,
                    title: "Violation Reports Per Day",
                    height: 77,
                    width: 100,
                    widthUnit: '%',
                    padding: 0,
                    lineColor: 'black',
                    fillGradientArray: [
                        'rgba(0, 0, 0, 0.7)',
                        'rgba(0, 0, 0, 0.7)'
                    ],
                    highlightFillGradientArray: [
                        'rgba(0,160,80,0.7)',
                        'rgba(0,160,80,0.9)',

                    ],
                    highlightLineColor: 'cornflowerblue',
                    fillGradient: true,
                    highlightTemplate: UIGraph.UnitStepBarsHighlighter,
                    parseMeta: function(v, i) {
                        return v;
                    },
                    parseY: function(v, i) {
                        return v.count;
                    }
                }


            }, options);

        },


        render: function() {

            var options = this.options;

            var me = this;

            var container = this._container;
            var timeline = this._timeline;

            var erraSpan = container.appendChild(new Element('span', {
                'class': 'era-s'
            }));
            var barBack = erraSpan.appendChild(new Element('div', {
                'class': 'era-bar bk'
            }));
            var graphBar = erraSpan.appendChild(new Element('div', {
                'class': 'timeline-graph'
            }))
            this._graphBar = graphBar;
            var bar = erraSpan.appendChild(new Element('div', {
                'class': 'era-bar'
            }));
            var graphBarDetail = erraSpan.appendChild(new Element('div', {
                'class': 'timeline-graph detail'
            }));
            this._graphBarDetail = graphBarDetail;

            var eventsBar = container.appendChild(new Element('div', {
                'class': 'events-bar'
            }));
            this._eventsBar = eventsBar;



            var eras = [{
                start: me._dayFromNowFloor(-3600 * 24 * 1000),
                end: me._dayFromNowFloor(3600 * 24 * 1000),
                label: ''
            }];


            eras.forEach(function(era) {

                var eraRange = [(new Date(era.start)).getTime(), (new Date(era.end)).getTime()];

                var s = eraRange[0] - slider.getDateRange()[0];
                var e = eraRange[1] - eraRange[0];
                var r = [me._dateToPercent(s), me._dateToPercent(e)]
                bar.appendChild(new Element('div', {
                    'class': 'era e-' + era.start,
                    'data-label': era.label,
                    styles: {
                        left: r[0] + '%',
                        width: r[1] + '%'
                    }
                }));
            });

            var eraRange = [(new Date(eras[0].start)).getTime(), (new Date(eras[eras.length - 1].end)).getTime()];
            var s = eraRange[0] - slider.getDateRange()[0];
            var e = eraRange[1] - eraRange[0];
            var r = [me._dateToPercent(s), me._dateToPercent(e)];
            barBack.appendChild(new Element('div', {
                styles: {
                    left: r[0] + '%',
                    width: r[1] + '%'
                }
            }));



            //event class: a, b, c, and d are used to alter the height and label directions

            var events = [
                //{start:'1804', label:'under Austrian control'},
            ];

            events.forEach(function(event) {
                me._addEvent(event)
            });



            this._requestData();



        },

        _requestData:function(options){

            var me=this;

            me._queryOptions=options;

            (new TimelineQuery('get_timeline_graph', Object.append({
                showDates: true
            }, me._queryOptions))).addEvent('success', function(resp) {
                me.setData(resp.values, resp.metadata);
                if(!me._rendered){
                    me._renderGraphs();
                    me._rendered=true;
                }

                if ((!me._subscription)&&resp.subscription) {
                    me._subscription=AjaxControlQuery.Subscribe(resp.subscription, function(result) {
                        (new TimelineQuery('get_timeline_graph', Object.append({
                            showDates: true
                        }, me._queryOptions))).addEvent('success', function(resp) {
                            me.setData(resp.values, resp.metadata);

                        }).execute();
                    });
                }

            }).execute();
        },

        setData: function(data, metadata) {

            if(data.length==0){
               this._data=[];
               this._setHintBar();
               return;
            }

            var unitStep = Date.parse(data[0].end) - Date.parse(data[0].start);



            var dateString = metadata.range[0];

            var formattedData = [];

            var max = 1500;
            while (data.length) {
                while (data[0].start > dateString) {

                    var next = new Date(Date.parse(dateString) + unitStep);
                    var nextString = next.toISOString().split('T').shift();


                    formattedData.push({
                        start: dateString,
                        end: nextString,
                        count: 0
                    });

                    dateString = nextString;
                    max--;
                    if (max == 0) {
                        throw 'too many loops';
                    }
                }
                dateString = data[0].end;
                formattedData.push(data.shift());

            }


            var dateStringEnd = metadata.range[1];

            while(dateString<dateStringEnd){
                var next = new Date(Date.parse(dateString) + unitStep);
                var nextString = next.toISOString().split('T').shift();

                formattedData.push({
                    start: dateString,
                    end: nextString,
                    count: 0
                });

                dateString = nextString;

                max--;
                if (max == 0) {
                    throw 'too many loops';
                }

            }



            this._data = formattedData;

            var range=[Date.parse(metadata.range[0]),Date.parse(metadata.range[1])];
            timeline.setDateRangeSpan(range);


            this._setHintBar();
            
            
            slider._checkResize();

        },

        _setHintBar:function(){
            if (this._hintBarGraph) {
                this._hintBarGraph.setData(this._data.map(function(d) {
                    return d.count;
                }));
            }
            if (this._detailBarGraph) {
                this._detailBarGraph.setData(this._data);
            }

        },

        _renderGraphs: function() {

            var data = this._data;
            var options = this.options;

            var graphBar = this._graphBar;
            var graphBarDetail = this._graphBarDetail;




            var hintBarGraph = new UIGraph(graphBar, data.map(function(d) {
                return d.count;
            }), options.smallGraph);

            this._hintBarGraph = hintBarGraph;

            var detailBarGraph = new UIGraph(graphBarDetail, data, options.activeGraph);


            var me=this;
            var btns=[
                new Element('button',{
                    html:"All Time",
                    "class":"",
                    events:{click:function(){
                        var thisBtn=this;
                        btns.forEach(function(btn){
                            if(btn!==thisBtn){
                                btn.removeClass('active');
                            }

                        });
                        me._requestData({
                            minDate:"-"+(365*3)
                        })
                        thisBtn.addClass('active');
                    }}
                }),
                new Element('button',{
                    html:"Last Year",
                    "class":"",
                    events:{click:function(){
                        var thisBtn=this;
                        btns.forEach(function(btn){
                            if(btn!==thisBtn){
                                btn.removeClass('active');
                            }

                        });
                        me._requestData({
                            minDate:"-365"
                        })
                        thisBtn.addClass('active');
                    }}
                }),
                 new Element('button',{
                    html:"6 Months",
                    'class':"",
                    events:{click:function(){
                        var thisBtn=this;
                        btns.forEach(function(btn){
                            if(btn!==thisBtn){
                                btn.removeClass('active');
                            }
                        })
                        me._requestData({
                            minDate:"-128"
                        })
                        thisBtn.addClass('active');
                    }}
                }),
                new Element('button',{
                    html:"2 Months",
                    'class':"active",
                    events:{click:function(){
                        var thisBtn=this;
                        btns.forEach(function(btn){
                            if(btn!==thisBtn){
                                btn.removeClass('active');
                            }
                        })
                        me._requestData({
                            minDate:"-60"
                        })
                        thisBtn.addClass('active');
                    }}
                }),
                new Element('button',{
                    html:"Last Month",
                    "class":"",
                    events:{click:function(){
                        var thisBtn=this;
                        btns.forEach(function(btn){
                            if(btn!==thisBtn){
                                btn.removeClass('active');
                            }
                        })
                        me._requestData({
                            minDate:"-30"
                        })
                        thisBtn.addClass('active');
                    }}
                })

            ];
            btns.forEach(function(btn){
                detailBarGraph.titleEl.appendChild(btn)

            })
            
            this._detailBarGraph = detailBarGraph;

            application.getEventManager().addEvent('onShowTimeline', function() {
                hintBarGraph.checkResize();
                detailBarGraph.checkResize();
            });



            detailBarGraph.addEvent('click', function(data) {

                console.log(data);
                timeline.setDateRange(data.meta.start, data.meta.end);
            });

            //adding a custom popover that follows the cursor.
            var popover = null;
            detailBarGraph.addEvent('mouseover', function(d) {

                if (d.y > 0) {
                    if (!popover) {
                        popover = new UIPopover(detailBarGraph.canvas, {});
                        popover.show();
                    }

                    popover.setText(d.y + " violation" + (d.y == 1 ? "" : "s"));
                } else {
                    if (popover) {
                        popover.hide();
                        popover.detach();
                        popover = null;

                    }

                }

            });



            /*
             * add title and checkboxes to filter the graph
             */
            detailBarGraph.titleEl.addClass('dropdown-menu');

        },

        _addEvent: function(event) {

            var me = this;

            var eventsBar = me._eventsBar;

            var startTime = (new Date(event.start)).getTime();

            var startOffset = startTime - slider.getDateRange()[0];
            var startPercent = me._dateToPercent(startOffset);
            var pin = eventsBar.appendChild(new Element('div', {
                'class': 'e-' + event.start + ' ' + (event.class || 'a'),
                'data-label': event.start,
                styles: {
                    left: startPercent + '%',
                }
            })).addEvent('click', function() {

            });

            new UIPopover(pin, {
                anchor: UIPopover.AnchorTo(['top']),
                title: '',
                description: event.label //,
                //hideDelay:500,
                //margin:50
            });

        },
        _dayFromNowFloor: function(offset) {

            var d = new Date((new Date()).getTime() + offset);
            d.setHours(0)
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0)
            return d;
        },
        _dateToPercent: function(time) {
            return Math.round((time / (slider.getDateRange()[1]- slider.getDateRange()[0])) * 100.0);
        }


    });



    (new BCWFTimeline(timeline)).render();



})();