// var data            =   [];
//
// for (var i = 0; i<5; i++) {
//   var num = Math.floor(d3.randomUniform(1,50)());
//   data.push(num);
// }
//
// console.log(data);
//
// var chart_width = 800;
// var chart_height = 400;
// var bar_padding = 5;
//
// var svg= d3.select('#chart')
//     .append('svg')
//     .attr('width', chart_width)
//     .attr('height', chart_height);
//
// svg.selectAll('rect')
//    .data(data)
//    .enter()
//    .append('rect')
//    .attr('x', function(d,i){
//      return i*(chart_width/data.length); //
//    })
//    .attr('y', function(d) {
//      return chart_height - d*5;
//    })
//    .attr('width', chart_width/data.length - bar_padding)
//    .attr('height', function(d) {
//      return d*5;
//    })
//    .attr('fill', '#7ED26D');
//
//
// svg.selectAll('text')
//    .data(data)
//    .enter()
//    .append('text')
//    .text(function(d){
//      return d;
//    })
//    .attr('x', function(d,i){
//      return i * ( chart_width / data.length ) +
//                 ( chart_width / data.length - bar_padding ) / 2
//    })
//    .attr('y', function(d) {
//      return chart_height - d*5 + 15;
//    })
//    .attr('font-size', 14)
//    .attr('fill', '#fff')
//    .attr('text-anchor', 'middle')

// var data = [
//   [400,200],
//   [210,140],
//   [722,300],
//   [70,160],
//   [250,50],
//   [110,280],
//   [699,225],
//   [90,220]
// ];

var chart_width = 800;
var chart_height = 400;
var padding = 50;

var data = [
  { date: '07/01/2017', num: 20 },
  { date: '07/02/2017', num: 37 },
  { date: '07/03/2017', num: 25 },
  { date: '07/04/2017', num: 45 },
  { date: '07/05/2017', num: 23 },
  { date: '07/06/2017', num: 33 },
  { date: '07/07/2017', num: 49 },
  { date: '07/08/2017', num: 40 },
  { date: '07/09/2017', num: 36 },
  { date: '07/10/2017', num: 27 },
];

var time_parse = d3.timeParse('%m/%d/%Y');
var time_format = d3.timeFormat('%b %e');

data.forEach(function(e,i){
  data[i].date = time_parse(e.date);
});
//create svg elements

var svg = d3.select('#chart')
    .append('svg')
    .attr('width', chart_width)
    .attr('height', chart_height);

var x_scale = d3.scaleTime()
    .domain([
      d3.min(data, function(d){
        return d.date;
      }),
      d3.max(data, function(d){
        return d.date;
    })])
    .range([padding, chart_width - padding * 2]);

var y_scale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){
      return d.num;
    })])
    .range([ chart_height - padding, padding ]);

// var r_scale = d3.scaleLinear()
//     .domain([0, d3.max(data, function(d){
//       return d[1];
//     })])
//     .range(5,30);

var a_scale = d3.scaleSqrt()
    .domain([0, d3.max(data, function(d){
        return d.num;
    })])
    .range([0,25]);

var x_axis = d3.axisBottom()
    .scale(x_scale);

svg.append('g')
   .attr('class', 'x-axis')
   .attr(
    'transform',
    'translate(0, '+(chart_height-padding) + ')'
   )
   .call(x_axis);

svg.selectAll('circle')
   .data(data)
   .enter()
   .append('circle')
   .attr('cx', function(d) {
     return x_scale(d.date);
   })
   .attr('cy', function(d) {
     return y_scale(d.num);
   })
   .attr('r', function(d) {
     return a_scale(d.num);
   })
   .attr('fill', '#D1AB0E');


svg.append('g').selectAll('text')
   .data(data)
   .enter()
   .append('text')
   .text(function(d) {
     return time_format(d.date);
   })
   .attr('x', function(d) {
     return x_scale(d.date);
   })
   .attr('y', function(d) {
     return y_scale(d.num);
   });
