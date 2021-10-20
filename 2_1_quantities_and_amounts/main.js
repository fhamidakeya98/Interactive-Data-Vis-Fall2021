/* CONSTANTS AND GLOBALS */
const height = 500;
const margin = 100;
const width = window.innerWidth *0.6  ;

/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType)
.then(data => {
  console.log("data", data)

 /* SCALES */
//x scale - Count 
const xScale = d3.scaleLinear()
              .domain([0, d3.max(data, d => d.count)])
              .range([margin,width-margin])
              

// yscale Activity
const yScale = d3.scaleBand()
              .domain(data.map(d => d.activity))
              .range([height-margin,margin])
              .paddingInner([0.2])
              .paddingOuter([0.1])


//Color of the Bars
const colorScale = d3.scaleOrdinal(d3.schemeAccent)
              .domain(data.map(d => d.activity))
              .range(["Red", "Green", "Blue", "Pink", "Purple"]);

  /* HTML ELEMENTS */
 // svg
 const svg = d3.select("#container")
            .append("svg")
            .attr("width",width)
            .attr("height",height)

 // Bars
        svg.selectAll("rect")
          .data(data)
          .join("rect")
          .attr("width", d=> xScale(d.count))
          .attr("height", yScale.bandwidth())
          .attr("x", margin)
          .attr("y", d=> yScale(d.activity))
          .attr("fill", d=> colorScale(d.activity)) 

        svg.append("g")
          .attr("class","x-axis")
          .style("transform", `translate(0px,${height-margin}px)`)
          .call(d3.axisBottom(xScale))
          
        svg.append("g")
          .attr("class","y-axis")
          .style("transform", `translate(${margin}px,0px)`)
          .call(d3.axisLeft(yScale))

//Title of the X and Y Axis

        svg.append("text")
          .attr("y", margin / 2 )
          .attr("x", -margin * 3)
          .attr("transform", "rotate(-90)")
          .style("font-size", "1.3 rem")
          .text("Squirrel Acitivity");

          svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", (width / 2.3) + margin)
          .attr("y", height - margin * .3)
          .style("font-size", "1.3 rem")
          .text("Count of Squirrels");

          svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", (width / 2.3) + margin)
          .attr("y", height - margin * 4.1)
          .style("font-weight", "bold")
          .style("font-size", "1.3 rem")
          .text("Squirrel Activities Bar Chart");

 })