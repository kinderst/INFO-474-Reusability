window.Graph = (function() {
    var chart = function() {
        //set global variables
        var xAxisLabel, yAxisLabel, xAxisText, yAxisText, xScale, yScale, xAxis, yAxis, g, width, height, color;
        //set default margins
        var margin = {
                        left: 40,
                        right: 10,
                        top: 10,
                        bottom: 20
                    }

        //default svg to null
        var svg = null;

        var my = function(selection) {
            //d is data, 'this' is dom element
            selection.each(function(d, i) {
                //only if svg doesn't already exist
                if (svg == null) {
                    svg = d3.select(this).append("svg")
                        .attr("width", width)
                        .attr("height", height);

                    //append g where data goes
                    g = svg.append("g");

                    //append labels, text
                    xAxisLabel = svg.append("g")
                                .attr("class", "xaxislabel")
                                .attr('transform', 'translate(' + margin.left + ',' + (height - margin.bottom) + ')');

                    yAxisLabel = svg.append("g")
                                .attr("class", "yaxislabel")
                                .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

                    xAxisText = svg.append('text');

                    yAxisText = svg.append('text');

                }
                //set svg width and height
                svg.attr('class','none')
                    .attr("width", width)
                    .attr("height", height);

                //set g width and height
                g.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("width", width - margin.left - margin.right)
                    .attr("height", height - margin.bottom - margin.top);

                setScales(d);

                setAxes();

                //make sure values are numeric
                d.forEach(function(e) {
                    e.y = +e.y;
                });        

                //perform data call
                var bars = g.selectAll("rect").data(d);

                bars.enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return xScale(d.x); })
                    .attr("y", function(d) { return yScale(d.y); })
                    .attr("width", xScale.rangeBand())
                    .attr("fill", color);

                bars.exit().remove();

                
                bars.transition()
                    .attr("height", function(d) { return height - margin.top - margin.bottom - yScale(d.y)})
            });
        }

        //Sets width of svg, value is value in pixels
        my.width = function(value) {
            if (!arguments.length) {
                return width;
            }
            width = value;

            xScale = d3.scale.ordinal() 
                 .rangeRoundBands([0, width - margin.left - margin.right], .1);

            xAxis = d3.svg.axis()
                 .scale(xScale)
                 .orient("bottom");
            return my;
        };

        //Set height of svg, value is value in pixels
        my.height = function(value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            yScale = d3.scale.linear()
                    .range([height - margin.top - margin.bottom, 0]);

            yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickSize(0);

            return my;
        };

        //Set data of the graph, value should be given in form of dictionary x and y values
        my.data = function(value) {
            if (!arguments.length) return data;
            data = value;

            return my;
        };

        //Set margin of graph, value should be given in left, right, top, and bottom values
        my.margin = function(value) {
            if (!arguments.length) return data;
            margin = value;

            return my;
        };

        //sets color of rectangles, value should be given in terms of string with rgb values
        my.rectColor = function(value) {
            if (!arguments.length) return data;
            color = value;

            return my;
        }

        //Set scales for graph
        var setScales = function(data) {
            // Get the unique values of x scale
            var names = data.map(function(d) {return d.x});

            xScale  = d3.scale.ordinal().rangeBands([0, width - margin.left - margin.right], .2).domain(names);

            // Get max value of y
            var yMax = d3.max(data, function(d){return +d.y});

            yScale = d3.scale.linear().range([height - margin.top - margin.bottom, 0]).domain([0, yMax]);
        }

        //Set axes for graph
        var setAxes = function() {
            xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient('bottom')

            yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient('left')
                        .tickFormat(d3.format('.2s'));

            xAxisLabel.transition().duration(1500).call(xAxis);

            yAxisLabel.transition().duration(1500).call(yAxis);
        }

        return my;
    };

    return chart;
})();