// Width and height
var chart_width     =   800;
var chart_height    =   600;

var path = d3.geoPath()
  .projection( d3.geoMercator());


d3.json('ind.geojson').then(function(data){
  svg.selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
    .attr('d', path);


})
// Create SVG
var svg             =   d3.select("#chart")
    .append("svg")
    .attr("width", chart_width)
    .attr("height", chart_height);
