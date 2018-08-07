var width     =   window.innerWidth;
var height    =   window.innerHeight;

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geoMercator();

var path = d3.geoPath()
      .projection(projection);

//data
d3.json('IND.geojson').then(function(basemap_data){
  drawMap(basemap_data);

  drawBubble();
})


function drawMap(basemap_data){
  projection.fitSize([width, height], basemap_data)

  svg.selectAll('path')
      .data( basemap_data.features )
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#4A4E69')



}

function drawBubble(){
  d3.csv('jalaxkonti.csv').then(function(language_data){

    language_data.forEach(function(d) {
      d.x = projection([+d.lon, +d.lat])[0]
      d.y = projection([+d.lon, +d.lat])[1]
    })

    var g = svg.append('g');

    var innerRadius = 50;
    var outerRadius = innerRadius*2;

    var cx = function(d) {
      if(+d.hierarchy === 1) {
        return d.x
      } else {
        return d.x + (Math.sin(-d.angle)*outerRadius)
      }
    }

    var cy = function(d) {
      if(+d.hierarchy === 1) {
        return d.y
      } else {
        return d.y + (Math.cos(-d.angle)*outerRadius)
      }
    }

    var parent = g.selectAll('circle')
      .data(language_data)
      .enter()
      .append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', function(d) {
        if(+d.hierarchy === 1) {
          return innerRadius
        } else {
          return 0
        }
      })
      .attr('id', function(d) {
        return d.language
      })
      .style("fill", function(d) {
        if(+d.hierarchy === 1) {
          return '#C4C4C4'
        } else {
          return '#80312B'
        }
      })
      .on('mouseover', showChildren);

    function showChildren(d) {

      var selection = d3.select(this);

      console.log(selection);

      d3.select(this)
        .attr('stroke', 'white')
        .attr('stroke-width', '5')
        .style('fill', '#B7433D');

      parent.transition()
        .duration(400)
        .attr("r", function(d) {
          if((+d.hierarchy === 2)) {
            return 40
          } else {
            return innerRadius
          }
        })
    }

    function hideChildren(d) {
      d3.select(this).attr('stroke', '#C4C4C4')
        .style('fill', '#C4C4C4');
    }

  });
}
