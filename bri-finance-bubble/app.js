var chart_width = 1000;
var chart_height = 800;
var padding = 50;



d3.csv('bri-funds.csv').then(function(data){
  data.forEach(function(d){ d.Amount = +d.Amount; });
  console.log(data);
  drawCircles(data);
})

function drawCircles(data){
  var simulation = d3.forceSimulation()
  .force("x", d3.forceX(chart_width/2).strength(0.05))
  .force("y", d3.forceY(chart_height/2).strength(0.05))
  .force("anticollision", d3.forceCollide(function(d){
    return radiusScale(d.Amount)+1
  }));

  var svg = d3.select('#chart')
    .append('svg')
    .attr('width', chart_width)
    .attr('height', chart_height)
    .append("g");

  var radiusScale = d3.scaleSqrt()
    .domain([d3.min(data, function(d){return d.Amount}),d3.max(data, function(d){return d.Amount})])
    .range([10, 100]);

  var circles = svg.selectAll('.fund')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'fund')
    .attr('r', function(d) {
      return radiusScale(d.Amount)
    })
    .attr('fill', '#D1AB0E');

  simulation.nodes(data)
    .on('tick', ticked);

  function ticked() {
    circles.attr("cx", function(d) {
      return d.x
    })
    .attr("cy", function(d) {
      return d.y
    })
  }

}
