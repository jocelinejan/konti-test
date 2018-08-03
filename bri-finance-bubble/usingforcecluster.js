var width = window.innerWidth, //chart width
    height = window.innerHeight, // chart height
    padding = 50; //chart padding

var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append("g");

var colorScale = d3.scaleOrdinal()
    .domain(function(d){
      return d.Category
    })
    .range(["rgb(178,90,237)", "rgb(47,21,139)", "rgb(220,80,142)", "rgb(26,101,135)", "rgb(92,13,71)", "rgb(87,108,231)", "rgb(157,100,145)"]);


//load and parse CSV
d3.csv('bri-funds.csv').then(function(data){
  var radiusScale = d3.scaleSqrt()
    .domain([d3.min(data, function(d){return +d.Amount}),d3.max(data, function(d){return +d.Amount})])
    .range([5, 75]);

  data.forEach(function(d){
    d.Amount = +d.Amount;
    d.cluster = +d.cluster;
    d.radius = radiusScale(d.Amount);
  }); //convert Amount to numbers
  console.log(data); //log array
  drawCircles(data); //draw circle after data loads
})

function drawCircles(data){

  var m = d3.max(data, function(d){
      return d.cluster;
    })+1;

  var clusters= new Array(m);

  data.map(function(d){
    var i = d.cluster;
    d.x = Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random();
    d.y = Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random();
    if (!clusters[i] || (d.radius > clusters[i].radius)) clusters[i] = d;
    return d;
  });


  var forceCenter = d3.forceCenter(width/2, height/2);

  var forceCluster = d3.forceCluster()
    .centers(function(d){
      return clusters[d.cluster];
    })
    .strength(0.3)
    .centerInertia(0.01);

  var forceYCenter = d3.forceY(height / 2);
  var forceXCenter = d3.forceX(width / 2);

  var splitScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d){
      return d.cluster
    }))
    .range([width*0.1, width*0.9]);

  var forceXSplit = d3.forceX(function(d){
    return splitScale(d.cluster)
  });


  var simulation = d3.forceSimulation()
  // .force('center', forceCenter)
  .force('attract', d3.forceAttract()
    .target([width/2, height/2])
    .strength(0.02))
  .force('cluster', forceCluster)
  .force("collide", d3.forceCollide(function(d){
    return d.radius+1
  }))
  .on('tick', ticked)
  .nodes(data);

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

  var transitionTime = 3000;
    var t = d3.timer(function (elapsed) {
      var dt = elapsed / transitionTime;
      simulation.force('collide').strength(Math.pow(dt, 2) * 0.7);
      if (dt >= 1.0) t.stop();
    });



  d3.select('#type').on('click', function() {
      console.log("you clicked me")
    });

  function continuousSplit(){

    var splitState = false;

    d3.select('#type').on('click', function() {
        console.log("you clicked me");
        if(!splitState){
          simulation.force("x", forceXSplit)
          .force("y", forceYCenter )
          // .force("collide", d3.forceCollide(function(d){
          //   return d.radius+1
          // }))
        } else {

          data.map(function(d){
            var i = d.cluster;
            d.x = Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random();
            d.y = Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random();
          });

          simulation.force('attract', d3.forceAttract()
            .target([width/2, height/2])
            .strength(0.01))
          .force('cluster', forceCluster)

        }

        splitState = !splitState;
        simulation.alpha(1).restart();
    });
  }


  function ticked() {
    circles.attr("cx", function(d) {
      return d.x
    })
    .attr("cy", function(d) {
      return d.y
    })
    .attr('r', function(d) {
      return d.radius
    });

    // labels.attr("x", function(d) {
    //   return d.x
    // })
    // .attr("y", function(d) {
    //   return d.y+4
    // })
    // .attr("text-anchor", "middle");
  }

  continuousSplit();

}
