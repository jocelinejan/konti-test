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

var data = [
  [400,200],
  [210,140],
  [722,300],
  [70,160],
  [250,50],
  [110,280],
  [699,225],
  [90,220]
];

var chart_width = 800;
var chart_height = 400;

//create svg elements

var svg = d3.select('#chart')
    .append('svg')
    .attr('width', chart_width)
    .attr('height', chart_height);

svg.selectAll('circle')
   .data(data)
   .enter()
   .append('circle')
   .attr('cx', function(d) {
     return d[0];
   })
   .attr('cy', function(d) {
     return d[1];
   })
   .attr('r', function(d) {
     return d[1]/10;
   })
   .attr('fill', '#D1AB0E');


svg.selectAll('text')
   .data(data)
   .enter()
   .append('text')
   .text(function(d) {
     return d.join(',');
   })
   .attr('x', function(d) {
     return d[0];
   })
   .attr('y', function(d) {
     return d[1];
   });
