var width = window.innerWidth, //chart width
    height = window.innerHeight, // chart height
    padding = 50; //chart padding

//create svg container
var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append("g");

//load and parse CSV
d3.csv('bri-funds.csv').then(function(data){

  //convert string to numbers
  data.forEach(function(d){
    d.Amount = +d.Amount;
    d.cluster = +d.cluster;
  });

  //log array
  console.log(data);

  //draw circle after data loads
  drawCircles(data);
})

function drawCircles(data){

  //Min and max amount
  var minAmount = d3.min(data, function(d){return +d.Amount});
  var maxAmount = d3.max(data, function(d){return +d.Amount});

  //Locations to move bubbles towards, depending on which view mode is selected.
  var centerDefault = {
    x: width/2,
    y: height/2
  };

  var simulation = d3.forceSimulation()
  .force('center', centerDefault)
  .force('collide', d3.forceCollide(function(d){
    return d.radius+1
  }))
  .on('tick', ticked)
  .nodes(data);

  //SCALE

  //set colors based on category
  var colorScale = d3.scaleOrdinal()
      .domain(function(d){
        return d.Category
      })
      .range([
        "rgb(178,90,237)",
        "rgb(47,21,139)",
        "rgb(220,80,142)",
        "rgb(26,101,135)",
        "rgb(92,13,71)",
        "rgb(87,108,231)",
        "rgb(157,100,145)"
      ]);

  //set radius based on Amount
  var radiusScale = d3.scaleSqrt()
      .domain([ minAmount, maxAmount ])
      .range([ 5, 75 ]);


  var circles = svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('id', function(d){
      return d.Category+'-'+d.Name
    })
    .attr('fill', function(d){
      return colorScale(d.Category)
    })
    .attr('fill-opacity', 0.7)
    .attr('stroke', function(d){
      return colorScale(d.Category)
    });

  // var labels = svg.selectAll('text')
  //     .data(data)
  //     .enter()
  //     .append('text')
  //     .text(function(d){
  //       return d.abbr
  //     })
  //     .attr('font-size', 11)


  function ticked() {
    circles.attr("cx", function(d) {
      return d.x
    })
    .attr("cy", function(d) {
      return d.y
    })
    .attr('r', function(d) {
      return radiusScale(d.Amount)
    });

    // labels.attr("x", function(d) {
    //   return d.x
    // })
    // .attr("y", function(d) {
    //   return d.y+4
    // })
    // .attr("text-anchor", "middle");
  }

}
