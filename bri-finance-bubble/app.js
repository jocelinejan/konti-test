function bubbleChart(){
  var width = window.innerWidth, //chart width
    height = window.innerHeight, // chart height
    padding = 50; //chart padding

  var tooltip = floatingTooltip('funds_tooltip', 240);

  var center = {
    x: width / 2,
    y: height / 2
  };

  var splitCenters = {
    1: { x: width/6, y: height/6 },
    2: { x: width/2, y: height/6 },
    3: { x: 5 * width / 6, y: height/6 },
    4: { x: width/6, y: height/2 },
    5: { x: width/2, y: height/2 },
    6: { x: 5 * width/6, y: height /2 },
    7: { x: width/6, y: 5 * height/6 },
    8: { x: width/2, y: 5 * height/6 }
  }


  var forceStrength = 0.01;

  var svg = null;
  var bubbles =  null;
  var nodes = [];

  // function charge(d) {
  //    return -Math.pow(d.radius, 2.0) * forceStrength;
  //  }

  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('collide', d3.forceCollide(function(d){
      return d.radius + 1;
    }))
    // .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  simulation.stop();

  var fillColor = d3.scaleOrdinal()
    .domain(function(d){
      return d.category
    })
    .range(d3.schemePaired);

  function createNodes(rawData) {
    var minAmount = d3.min(rawData, function(d){return +d.amount});
    var maxAmount = d3.max(rawData, function(d){return +d.amount});

    console.log(maxAmount);

    var radiusScale = d3.scaleSqrt()
      .domain([minAmount,maxAmount])
      .range([2, 70]);

    var myNodes = rawData.map(function(d) {
      return {
        radius: radiusScale(+d.amount),
        amount: +d.amount,
        name: d.name,
        category: d.category,
        categoryCluster: +d.categoryCluster,
        type: d.type,
        typeCluster: +d.typeCluster,
        categoryDescription: d.categoryDescription,
        description: d.description,
        x: Math.random()*900,
        y: Math.random()*800,
      };
    });

    myNodes.sort(function(a,b) {
      return b.value - a.value;
    });

    return myNodes;
  }


  var chart = function chart(selector, rawData) {
    nodes = createNodes(rawData);

      console.log(nodes);

    svg = d3.select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    bubbles = svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 0)
      .attr('fill', function(d) {
        return fillColor(d.category)
      })
      .attr('fill-opacity', 0.8)
      .attr('stroke', function (d) {
        return fillColor(d.category)
      })
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    bubbles.transition()
      .duration(2000)
      .attr('r', function(d) { return d.radius });

    simulation.nodes(nodes);

    groupBubbles();
  }

  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  function nodeCategoryX(d) {
    return splitCenters[d.categoryCluster].x;
  }

  function nodeCategoryY(d) {
    return splitCenters[d.categoryCluster].y;
  }

  function nodeTypeX(d) {
    return splitCenters[d.typeCluster].x;
  }

  function nodeTypeY(d) {
    return splitCenters[d.typeCluster].y;
  }

  function groupBubbles() {
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
    simulation.force('y', d3.forceY().strength(forceStrength).y(center.y));
    simulation.alpha(1).restart();
  }

  function splitBubblesCategory() {
    simulation.force('x', d3.forceX().strength(0.02).x(nodeCategoryX));
    simulation.force('y', d3.forceY().strength(0.02).y(nodeCategoryY));
    simulation.alpha(1).restart();
  }

  function splitBubblesType() {
    simulation.force('x', d3.forceX().strength(0.02).x(nodeTypeX));
    simulation.force('y', d3.forceY().strength(0.02).y(nodeTypeY));
    simulation.alpha(1).restart();
  }

  function showDetail(d) {
    d3.select(this).attr('stroke', 'black');

    var name = '<span class="name">Name: </span><span class="value">' +
                d.name +
                '</span><br/>';


    if(d.amount === 0) {
      var amount = '<span class="name">Amount: </span><span class="value">Pending</span><br/>';
    } else {
      var amount =
        '<span class="name">Amount: </span><span class="value">$' + d.amount + ' Billion </span><br/>';
    }
    console.log(amount);
    var content =  name + amount;


    tooltip.showTooltip(content, d3.event);
  }

  function hideDetail(d) {
     // reset outline
     d3.select(this)
      .attr('stroke', function (d) {
        return fillColor(d.category)
      });

     tooltip.hideTooltip();
  }

   chart.toggleDisplay = function (displayName) {
     if (displayName === 'category') {
       splitBubblesCategory();
     } else if (displayName === 'type') {
       splitBubblesType();
     } else {
       groupBubbles();
     }
   };


  return chart;
}

var myBubbleChart = bubbleChart();

function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}
// function display(error, data){
//   console.log(error)
//   console.log(data);
//
//   // myBubbleChart('#chart', data);
// }

d3.csv('bri-finance.csv').then(function(data){
  console.log(data)

  myBubbleChart('#chart', data)
});

setupButtons();
