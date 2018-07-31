let width = window.innerWidth, //chart width
    height = window.innerHeight, // chart height
    padding = 50; //chart padding

const n = 24, //total number of nodes
      c = 7; // number of distinct clusters


//load and parse CSV
d3.csv('bri-funds.csv').then(function(data){
  data.forEach(function(d){ d.Amount = +d.Amount; }); //convert Amount to numbers
  console.log(data); //log array
  drawCircles(data); //draw circle after data loads
})

function drawCircles(data){



  let simulation = d3.forceSimulation()
  // .force("x", d3.forceX(width/2).strength(0.05))
  // .force("y", d3.forceY(height/2).strength(0.05))
  .force('center', d3.forceCenter(width/2, height/2))
  .force('attract', d3.forceAttract()
    .target([width/2, height/2])
    .strength(0.01))
  .force('cluster', d3.forceCluster()
    .centers(function (d) { return data[d.Category]; })
    .strength(0.5)
    .centerInertia(0.1))
  .force("collide", d3.forceCollide(function(d){
    return radiusScale(d.Amount)+1
  }));

  let svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append("g");

  let colorScale = d3.scaleOrdinal()
    .domain(function(d){
      return d.Category
    })
    .range(["#4cdf95",
              "#b68ef2",
              "#6ed6aa",
              "#b5aae9",
              "#5cddd2",
              "#76a4ee",
              "#54c3e5"]);

  let radiusScale = d3.scaleSqrt()
    .domain([d3.min(data, function(d){return d.Amount}),d3.max(data, function(d){return d.Amount})])
    .range([10, 100]);

  let circles = svg.selectAll('.fund')
    .data(data)
    .enter()
    .append('circle')
    .attr('id', function(d){
      return d.Category+'-'+d.Name
    })
    .attr('r', function(d) {
      return radiusScale(d.Amount)
    })
    .attr('fill', function(d){
      return colorScale(d.Category)
    });

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
