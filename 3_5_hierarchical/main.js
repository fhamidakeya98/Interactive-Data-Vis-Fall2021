/**
 * CONSTANTS AND GLOBALS
 * */
 const width = window.innerWidth * 0.3,
 height = window.innerHeight * 0.6,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;
let tooltip;

/**
* APPLICATION STATE
* */
let state = {
 data: null,
 hover: null
};

/**
* LOAD DATA
* */
d3.json("../../data/flare.json", d3.autotype).then(data => {
 state.data = data;
 init();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function init() {

 const colorScale = d3.scaleOrdinal(d3.schemeSet2);

 const container = d3.select("#d3-container").style("position", "relative");

 svg = container
   .append("svg")
   .attr("width", width)
   .attr("height", height)
   .attr("text-anchor", "middle");

 // initialize tooltip here — fill it with text in draw whenever state is updated
 tooltip = container.append("div")
   .attr("class", "tooltip")
   .style("position", "absolute") 
   .style("top", 0)
   .style("left", 0)
   .style("background-color", "white")
   

 const root = d3.hierarchy(state.data)
   .sum(d => d.value) 
   .sort((a, b) => b.value - a.value);

 const packLayout = d3.pack()
   .size([width - 1, height - 1])
   .padding(2)

 const pack = packLayout(root)
 const node = root.descendants()

 // draw tree leaves groups - move into place
 const packGroups = svg
   .selectAll("g")
   .data(node)
   .join("g")
   .attr("transform", d => `translate(${d.x}, ${d.y})`)

 // draw tree leaves cirlces
packGroups.append("circle")
 .attr("r", d => d.r+0.5)
 .attr("fill", d => colorScale(d.height))
 .attr("stroke", "black")
 .attr("width", d => d.x)
 .attr("heigh", d => d.y)
  

 // add mouseover event listener on our group so that it updates state each time one is over
 packGroups
   .on("mouseenter", (event, d) => { // second argument returns the data associated with that leaf
     state.hover = {
       position: [d.x, d.y],
       name: d.data.name,
      value: d.data.value,
       
     }
     // fill in the tooltip once state is updated
     draw()
   })
   .on("mouseleave", () => {
     //reset hover when mouse out of the leaf
     state.hover = null
     draw();
   })

 draw(); // calls the draw function
}

/**
* DRAW FUNCTION
* we call this everytime there is an update to the data/state
* */
function draw() {
 // check if there is something saved to `state.hover`
 if (state.hover) {
   tooltip
     .html(
       `
   <div>Name: ${state.hover.name}</div>
   
   `
     ).transition()
     .duration(200)
     .style("transform", `translate(${state.hover.position[0]}px, ${state.hover.position[1]}px )`)
     .attr("fill", "white")
 }
 tooltip.classed("visible", state.hover)
}