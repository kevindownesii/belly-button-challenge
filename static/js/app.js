//  URL
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
  });
  
  // Initialize the dashboard  
  function init() {
  
      // Create the dropdown menu
      let Menu = d3.select("#selDataset");
  
      // Get names to populate the drop-down selector
      d3.json(url).then((data) => {
          
          // Create variable for the names
          let names = data.names;
  
          // Add samples to dropdown menu
          names.forEach((id) => {
  
              // Console Log the value of id 
              console.log(id);
  
              Menu.append("option")
              .text(id)
              .property("value",id);
          });
  
          // Set the first sample from the list
          let first_sample = names[0];
  
          // Console log first_sample
          console.log(first_sample);
  
          // Build the initial plots
          Metadata(first_sample);
          BarChart(first_sample);
          BubbleChart(first_sample);
          GaugeChart(first_sample);
  
      });
  };
  
  // Function that populates data
  function Metadata(sample) {
  
      // Use D3 to get all of the data
      d3.json(url).then((data) => {
  
          // Get all metadata
          let metadata = data.metadata;
  
          // Filter data
          let value = metadata.filter(result => result.id == sample);
  
          // Console Log the filtered metadata 
          console.log(value)
  
          // Get the first index
          let valueData = value[0];
  
          // Clear out metadata
          d3.select("#sample-metadata").html("");
  
          // Use Object.entries to add each key/value pair
          Object.entries(valueData).forEach(([key,value]) => {
  
              // Console Log the key/value pairs 
              console.log(key,value);
  
              d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
          });
      });
  
  };
  
  // Function for bar chart
  function BarChart(sample) {
  
      // Use D3 to get data
      d3.json(url).then((data) => {
  
          // Get all sample data
          let sampleData = data.samples;
  
          // Filter data
          let value = sampleData.filter(result => result.id == sample);
  
          // Get the first index 
          let valueData = value[0];
  
          // Get sample values, otu_ids, and otu_labels
          let sample_values = valueData.sample_values;
          let otu_ids = valueData.otu_ids;
          let otu_labels = valueData.otu_labels;
          
  
          // Console Log the data 
          console.log(otu_ids,otu_labels,sample_values);
  
          // Select top 10 items to display 
          let xticks = sample_values.slice(0,10).reverse();
          let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
          let labels = otu_labels.slice(0,10).reverse();
          
          // Create trace for the bar chart
          let trace = {
              x: xticks,
              y: yticks,
              text: labels,
              type: "bar",
              orientation: "h"
          };
  
           
          // Create Plot
          Plotly.newPlot("bar", [trace])
      });
  };
  
  // Function for bubble chart
  function BubbleChart(sample) {
  
      // Use D3 to get data
      d3.json(url).then((data) => {
          
          // get all sample data
          let sampledata1 = data.samples;
  
          // Filter data
          let value1 = sampledata1.filter(result => result.id == sample);
  
          // Get the first index 
          let valueData1 = value1[0];
  
          // Get sample values, otu_ids, and otu_labels
          let sample_values = valueData1.sample_values;
          let otu_ids = valueData1.otu_ids;
          let otu_labels = valueData1.otu_labels;
          
  
          // Console Log the data 
          console.log(otu_ids,otu_labels,sample_values);
          
          // Create trace for the bubble chart
          let trace1 = {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                  size: sample_values,
                  color: otu_ids,
                  colorscale: "Earth"
              }
          };
  
            // Create Plot
          Plotly.newPlot("bubble", [trace1])
      });
  };
  
  
  
  
  // Function that builds the gauge chart
  function GaugeChart(sample) {
  
      // Use D3 to get the data
      d3.json(url).then((data) => {
  
          // Retrieve all metadata
          let metadata = data.metadata;
  
          // Filter data
          let value = metadata.filter(result => result.id == sample);
  
          // Console Log the filter data
        //   console.log(value)
  
          // Get the first index 
           let valueData = value[0];
  
          // Use Object.entries to add each key/value pair
          let washingFrequency = Object.values(valueData)[6];
          
          // Create trace 
             let trace2 = {
              value: washingFrequency,
              domain: {x: [0,1], y: [0,1]},
              title: {
                  text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                  font: {color: "black", size: 18}
              },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                  axis: {range: [0,10], tickmode: "linear", tick0: 2, dtick: 2},
                  bar: {color: "blue", thickness: 0.25, line:{color: "black", width: 1} }, 
                  
                  steps:[
                
                    { "range": [0, 1], "color": "rgb(248, 243, 236)" },
                    { "range": [1, 2], "color": "rgb(244, 241, 229)" },
                    { "range": [2, 3], "color": "rgb(233, 231, 201)" },
                    { "range": [3, 4], "color": "rgb(229, 232, 176)" },
                    { "range": [4, 5], "color": "rgb(212, 229, 154)" },
                    { "range": [5, 6], "color": "rgb(182, 205, 143)" },
                    { "range": [6, 7], "color": "rgb(138, 192, 134)" },
                    { "range": [7, 8], "color": "rgb(137, 188, 141)" },
                    { "range": [8, 9], "color": "rgb(131, 181, 136)" },
                    { "range": [9, 10], "color": "rgb(128, 178, 127)" }
                
                ]
              } 
          };
  
          // Create layout
          let layout = {
              width: 500, 
              height: 400,
              margin: {t: 0, b:0}
          };
  
          // Create Plot
          Plotly.newPlot("gauge", [trace2], layout)
      });
  };
  
  
    
  // Dashboard Function when changes are made
  function optionChanged(value) { 
  
      // Console Log the new value
      console.log(value); 
  
      // Call all created functions 
      Metadata(value);
      BarChart(value);
      BubbleChart(value);
      GaugeChart(value);
  };
  
  // Call initialize function
  init();