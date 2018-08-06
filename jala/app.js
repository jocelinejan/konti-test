var width     =   window.innerWidth;
var height    =   window.innerHeight;


//data
d3.json('IND.geojson').then(function(data){
  drawMap(data);
})


function drawMap(data){

  var projection = d3.geoMercator()
    .fitSize([width, height], data);

  var path = d3.geoPath()
    .projection(projection);


  // Create SVG
  var svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.selectAll('path')
      .data( data.features )
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#4A4E69')



}
