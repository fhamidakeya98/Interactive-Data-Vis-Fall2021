/* CONSTANTS AND GLOBALS */
const height = 500;
const margin = 100;
const width = window.innerWidth *0.6  ;

/* LOAD DATA */
d3.csv('../data/exdata.csv', d3.autoType)
.then(data => {
  console.log("data", data)

 /* SCALES */
//x scale - Count 
const xScale = d3.scaleLinear()
              .domain([0, d3.max(data, d => d.Amount)])
              .range([margin,width-margin])
              

// yscale Activity
const yScale = d3.scaleBand()
              .domain(data.map(d => d.Country))
              .range([height-margin,margin])
              .paddingInner([0.2])
              .paddingOuter([0.1])


//Color of the Bars
const colorScale = d3.scaleOrdinal(d3.schemeAccent)
              .domain(data.map(d => d.Country));
              

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
          .attr("width", d=> xScale(d.Amount))
          .attr("height", yScale.bandwidth())
          .attr("x", margin)
          .attr("y", d=> yScale(d.Country))
          .attr("fill", d=> colorScale(d.Country)) 

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
          .text("Country");

          svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", (width / 2.3) + margin)
          .attr("y", height - margin * .3)
          .style("font-size", "1.3 rem")
          .text("Annual Fish Consumption (Tons)");

          svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", (width / 2.3) + margin)
          .attr("y", height - margin * 4.1)
          .style("font-weight", "bold")
          .style("font-size", "1.3 rem")
          .text("Countries with Most Fish Consumption");

 })