var svg = d3.select("svg");

const height = +svg.attr("height");
const width = +svg.attr("width");
const radius = height / 2;

var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
array = array.map(x => {
  return { number: x, selected: false };
});
array[4].selected = true;

var pie = d3
  .pie()
  .value(d => d.number)
  .padAngle(0.1);

var arc = d3
  .arc()
  .padRadius(100)
  .outerRadius(radius - 40)
  .innerRadius(100);

var arcHover = d3
  .arc()
  .padRadius(100)
  .outerRadius(radius - 20)
  .innerRadius(100);

var arcSelected = d3
  .arc()
  .padRadius(100)
  .outerRadius(radius - 10)
  .innerRadius(100);

var arcSelHover = d3
  .arc()
  .padRadius(100)
  .outerRadius(radius)
  .innerRadius(100);

var g = svg
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

function updatePie(data) {
  var arcs = g.selectAll("path").data(pie(data));

  arcs.transition().attrTween("d", function(d) {
    var current = this.getAttribute("d");
    if (d.data.selected) return d3.interpolate(current, arcSelected(d));
    return d3.interpolate(current, arc(d));
  });

  arcs
    .enter()
    .append("path")
    .attr("d", d => {
      return d.data.selected ? arcSelected(d) : arc(d);
    })
    .attr("fill", "red")
    .on("mouseover", arcTween(true, 0))
    .on("mouseout", arcTween(false, 150));

  arcs.exit().remove();
}

updatePie(array);

function arcTween(mouseOver, delay) {
  //return function needed to correctly set the value of "this"
  return function() {
    d3
      .select(this)
      .transition()
      .delay(delay)
      .attrTween("d", function(d) {
        var current = this.getAttribute("d");

        if (d.data.selected) {
          if (mouseOver) return d3.interpolate(current, arcSelHover(d));
          return d3.interpolate(current, arcSelected(d));
        }

        if (mouseOver) return d3.interpolate(current, arcHover(d));
        return d3.interpolate(current, arc(d));
      });
  };
}

const button = document.querySelector("button");
button.addEventListener("click", () => {
  array.forEach(x => (x.selected = false));
  array[Math.floor(Math.random() * array.length)].selected = true;
  updatePie(array);
});
