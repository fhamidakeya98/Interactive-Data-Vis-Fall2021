/**
 * CONSTANTS AND GLOBALS
 * */
 const width = window.innerWidth * 0.5,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;

/**
* APPLICATION STATE
* */
let state = {
 // + SET UP STATE
 geojson: null,
 points: null,
 hover: {
   screenPosition: null, //
   mapPosition: null,    // 
   visible: false,      
 },
 
};

/**
* LOAD DATA
* Using a Promise.all([]), we can load more than one dataset at a time
* */
Promise.all([
 d3.json("../data/usState.json"),
 d3.csv("../data/stateCapitals.csv", d3.autoType),
]).then(([geojson, data]) => {
 // + SET STATE WITH DATA
 state.geojson = geojson
 state.points = data
 console.log("state: ", state);
 init();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function init() {
 // create an svg element in our main `d3-container` element
 svg = d3
   .select("#d3-container")
   .append("svg")
   .attr("width", width)
   .attr("height", height);

 // + SET UP PROJECTION...this is like setting the scale with domain/range
 const project = d3.geoAlbersUsa()
   .fitSize ([
     width-margin.left - margin.right,
     height - margin.top - margin.bottom
   ], state.geojson)
 // + SET UP GEOPATH
 const path = d3.geoPath(project)

 // + DRAW BASE MAP PATH
 const states = svg.selectAll("path.states")
   .data(state.geojson.features)
   .join("path")
   .attr("class", 'states')
   .attr("stroke", "Blue")
   .attr("fill", "ligthblue")
   .attr ("d", path)

 // + Draw points on map
 const dot = svg 
 .selectAll("circle.point")
 .data(state.data)
 .join("circle")
 .attr("fill", "green")
 .attr("r", 5)
 .attr("transform", d => {
   const [x, y] = project([d.Long, d.Lat])
   return `translate(${x}, ${y})`
 })
 // + ADD EVENT LISTENERS (if you want)


 draw(); // calls the draw function
}

/**
* DRAW FUNCTION
* we call this everytime there is an update to the data/state
* */
function draw() {
 d3.select("#d3-container")
   .selectAll('div.tooltip')
   .data[state.hover]
   .attr("class", 'tooltip')
   .classed("visible", d => d.visible)
   .style("transform")
   .style("position", 'absolute')
}
function draw() {
  if (state.hover) {
    tooltip
      .html(
        `
        <div>Name: ${state.hover.name}</div>
        <div>Value: ${state.hover.value}</div>
        <div>Hierarchy Path: ${state.hover.title}</div>
      `
      )
      .transition()
      .duration(500)
      .style(
        "transform",
        `translate(${state.hover.translate[0]}px,${state.hover.translate[1]}px)`
      );
  }
}