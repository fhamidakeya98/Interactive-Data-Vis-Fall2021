/**
 * CONSTANTS AND GLOBALS
 * */
 const width = window.innerWidth * 0.9,
 height = window.innerHeight * 0.7,
 margin = { top: 70, bottom: 70, left: 60, right: 40 };

let svg;
let tooltip;

/**
* APPLICATION STATE
* */
let state = {
 data: null,
 hover: null
 // + INITIALIZE STATE
};

/**
* LOAD DATA
* */
d3.json("../data/flare.json", d3.autotype).then(data => {
 state.data = data;
 init();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function init() {
 // with scaleOrdinal, you can specify the color range, and leave the domain blank
 // as you use the colorScale, it will assign each unique key to a color
 const colorScale = d3.scaleOrdinal(d3.schemePastel2);
 const container = d3.select("#d3-container").style("position", "relative");

 svg = container
   .append("svg")
   .attr("width", width)
   .attr("height", height);

 // + INITIALIZE TOOLTIP IN YOUR CONTAINER ELEMENT
 tooltip = container.append("div")
   .attr("class", "tooltip")
   .style("position", "absolute")
   .style("top", 0)
   .style("left", 0)
   .style("background-color", "white")

 // + CREATE YOUR ROOT HIERARCHY NODE
 const root = d3.hierarchy(state.data)
   .sum(d => d.value) // sets the 'value' of each level
   .sort((a, b) => b.value - a.value);

 // + CREATE YOUR LAYOUT GENERATOR
 const pack = d3.pack() // circle pack
   .size([width, height])
   .padding(1)
   
// + CALL YOUR LAYOUT FUNCTION ON YOUR ROOT DATA
   pack(root)
   const node = root.descendants()

// + CREATE YOUR GRAPHICAL ELEMENTS
// draw tree leaves groups - move into place
 const packGroup = svg
   .selectAll("g")
   .data(node)
   .join("g")
   .attr("transform", d => `translate(${d.x}, ${d.y})`)

 // draw tree leaves rect
 packGroup.append("circle")
   .attr("width", d => d.x1 - d.x0)
   .attr("height", d => d.y1 - d.y0)
   .attr("stroke", "gray")
   .attr("fill", d => colorScale(d.height))
   .attr("r", d => d.r)
   
   
   // packGroup.append("text")
   //.attr("dy", "1em")
  // .text(d=>d.data.name)
   
   packGroup.on("mouseenter", (event, d)=>{
     state.hover = {
       position: [d.x, d.y],
       name: d.data.name,
       value: d.data.value
     }
     //state.hoverPositionR = d.r
   
   draw()
   
   })
   .on("mouseleave", () => {
     state.hover = null
     draw(); // calls the draw function
 })
   
   //append text
   draw(); // calls the draw function
}
   
   /**
    * DRAW FUNCTION
    * we call this everytime there is an update to the data/state
    * */
    function draw() {
     // + UPDATE TOOLTIP //working on getting the hover to work
     if (state.hover) {
       tooltip
       .html(
         `
         <div>Name: ${state.hover.name}</div>
         <div>Value: ${state.hover.value}</div>
         `
       )
       .style("font-size","15px")
       .transition()
       .duration(300)
       .style("transform", `translate(${state.hover.position[0]}px,${state.hover.position[1]}px)`)
     }
     tooltip.classed("visible", state.hover)
   }