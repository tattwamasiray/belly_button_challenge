// Define the URL for the samples.json data
var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to create a horizontal bar chart
function createBarChart(otuIds, sampleValues, otuLabels) {
    var trace = {
        type: "bar",
        orientation: "h",
        x: sampleValues.slice(0, 10).reverse(),
        y: otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        marker: {
            color: 'rgb(31, 119, 180)',
        }
    };

    var data = [trace];

    var layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar-chart", data, layout);
}

// Function to update the bar chart based on selected OTU
function updateBarChart(selectedSample) {
    d3.json(url).then(function(data) {
        var samples = data.samples;
        var selectedData = samples.filter(sample => sample.id === selectedSample)[0];
        
        var otuIds = selectedData.otu_ids;
        var sampleValues = selectedData.sample_values;
        var otuLabels = selectedData.otu_labels;

        createBarChart(otuIds, sampleValues, otuLabels);
    });
}

// Initialize the page with default data
d3.json(url).then(function(data) {
    var names = data.names;

    // Create dropdown options
    var dropdown = d3.select("#dropdown");
    names.forEach(name => {
        dropdown.append("option").text(name).property("value", name);
    });

    // Update chart based on default selection
    var defaultSample = names[0];
    updateBarChart(defaultSample);
});

// Listen for dropdown change event
d3.select("#dropdown").on("change", function() {
    var selectedSample = d3.event.target.value;
    updateBarChart(selectedSample);
});

// Define the URL for the samples.json data
var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to initialize the dashboard
function init() {
    // Use D3 to fetch the data
    d3.json(url).then(function(data) {
        // Extract necessary data from the samples.json
        var samples = data.samples;
        var otuIds = samples[0].otu_ids;
        var sampleValues = samples[0].sample_values;
        var otuLabels = samples[0].otu_labels;

        // Create the bubble chart
        var bubbleTrace = {
            type: "bubble",
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            }
        };

        var bubbleData = [bubbleTrace];

        var bubbleLayout = {
            title: "Bubble Chart",
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bubble-chart", bubbleData, bubbleLayout);

        // Display sample metadata
        var metadata = data.metadata[0];
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html(""); // Clear existing content

        // Loop through metadata and display key-value pairs
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    });
}


// Function to update the gauge chart
function updateGaugeChart(washingFrequency) {
  // Calculate the angle for the needle
  var degrees = 180 - (washingFrequency * 20); // Assuming washing frequency ranges from 0 to 9
  var radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Create the path for the needle
  var mainPath = "M -.0 -0.025 L .0 0.025 L ",
      pathX = String(x),
      space = " ",
      pathY = String(y),
      pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var gaugeData = [
      {
          type: "scatter",
          x: [0],
          y: [0],
          marker: { size: 28, color: "850000" },
          showlegend: false,
          name: "Washing Frequency",
          text: washingFrequency,
          hoverinfo: "text+name"
      },
      {
          values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
              colors: [
                  "rgba(0, 105, 11, .5)",
                  "rgba(10, 120, 22, .5)",
                  "rgba(14, 127, 0, .5)",
                  "rgba(110, 154, 22, .5)",
                  "rgba(170, 202, 42, .5)",
                  "rgba(202, 209, 95, .5)",
                  "rgba(210, 206, 145, .5)",
                  "rgba(232, 226, 202, .5)",
                  "rgba(240, 230, 215, .5)",
                  "rgba(255, 255, 255, 0)"
              ]
          },
          labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: "label",
          hole: 0.5,
          type: "pie",
          showlegend: false
      }
  ];

  var gaugeLayout = {
      shapes: [
          {
              type: "path",
              path: path,
              fillcolor: "850000",
              line: {
                  color: "850000"
              }
          }
      ],
      title: "Belly Button Washing Frequency",
      height: 500,
      width: 500,
      xaxis: { visible: false },
      yaxis: { visible: false }
  };

  Plotly.newPlot("gauge-chart", gaugeData, gaugeLayout);
}

// ... Rest of the code ...
// ... Previous code ...

// Function to update all charts and display metadata
function updateCharts(sample) {
  // Update bar chart
  updateBarChart(sample);

  // Update bubble chart
  updateBubbleChart(sample);

  // Update gauge chart
  var metadata = data.metadata.find(item => item.id === parseInt(sample));
  var washingFrequency = metadata.wfreq;
  updateGaugeChart(washingFrequency);

  // Display metadata
  displayMetadata(metadata);
}

// Function to display metadata
function displayMetadata(metadata) {
  // Select the metadata panel element
  var metadataPanel = d3.select("#sample-metadata");

  // Clear existing metadata
  metadataPanel.html("");

  // Iterate through each key-value pair in metadata and append to panel
  Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
  });
}

// Function to handle change in dropdown selection
function optionChanged(newSample) {
  updateCharts(newSample);
}

// Function to initialize the dashboard
function init() {
  // Select the dropdown element
  var dropdown = d3.select("#selDataset");

  // Fetch data and populate dropdown
  d3.json(url).then(function(data) {
      // Store data in a global variable for easy access
      window.data = data;

      // Populate dropdown options
      data.names.forEach(function(sample) {
          dropdown.append("option").text(sample).property("value", sample);
      });

      // Initialize charts with default sample
      updateCharts(data.names[0]);
  });
}
// ... Previous code ...

// Function to update the bubble chart
function updateBubbleChart(sample) {
  // Extract data for the selected sample
  var selectedSample = data.samples.find(item => item.id === sample);
  var otuIds = selectedSample.otu_ids;
  var sampleValues = selectedSample.sample_values;
  var otuLabels = selectedSample.otu_labels;

  var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Earth"
      }
  };

  var bubbleData = [bubbleTrace];

  var bubbleLayout = {
      title: "Bubble Chart",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
  };

  Plotly.newPlot("bubble-chart", bubbleData, bubbleLayout);
}
// Function to update all charts and display metadata
function updateCharts(sample) {
  // Update bar chart
  updateBarChart(sample);

  // Update bubble chart
  updateBubbleChart(sample);

  // Update gauge chart
  var metadata = data.metadata.find(item => item.id === parseInt(sample));
  var washingFrequency = metadata.wfreq;
  updateGaugeChart(washingFrequency);

  // Display metadata
  displayMetadata(metadata);
}

// Initialize the dashboard
init();












// d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
//   // Your code to process the data will go here
// }).catch(error => console.log(error));
// // Assuming data is loaded and available
// const dropdown = d3.select("#dropdown-menu");

// // Get unique IDs from the data
// const ids = data.names;

// // Populate dropdown options
// ids.forEach(id => {
//   dropdown.append("option")
//     .text(id)
//     .property("value", id);
// });
// // Assuming data is loaded and available
// function updateBarChart(selectedId) {
//   const selectedData = data.samples.find(sample => sample.id === selectedId);
//   const top10Values = selectedData.sample_values.slice(0, 10).reverse();
//   const top10Labels = selectedData.otu_ids.slice(0, 10).reverse();
//   const top10HoverText = selectedData.otu_labels.slice(0, 10).reverse();

//   const trace = {
//     x: top10Values,
//     y: top10Labels.map(label => `OTU ${label}`),
//     text: top10HoverText,
//     type: "bar",
//     orientation: "h"
//   };

//   const layout = {
//     title: `Top 10 OTUs for Individual ${selectedId}`
//   };

//   Plotly.newPlot("bar-chart", [trace], layout);
// }

// // Call this function initially with a default ID or when the dropdown changes
// updateBarChart(defaultId); // Change defaultId to the default individual's ID
// // Assuming data is loaded and available
// function updateBarChart(selectedId) {
//   const selectedData = data.samples.find(sample => sample.id === selectedId);
//   const top10Values = selectedData.sample_values.slice(0, 10).reverse();
//   const top10Labels = selectedData.otu_ids.slice(0, 10).reverse();
//   const top10HoverText = selectedData.otu_labels.slice(0, 10).reverse();

//   const trace = {
//     x: top10Values,
//     y: top10Labels.map(label => `OTU ${label}`),
//     text: top10HoverText,
//     type: "bar",
//     orientation: "h"
//   };

//   const layout = {
//     title: `Top 10 OTUs for Individual ${selectedId}`
//   };

//   Plotly.newPlot("bar-chart", [trace], layout);
// }

// // Call this function initially with a default ID or when the dropdown changes
// updateBarChart(defaultId); // Change defaultId to the default individual's ID
// dropdown.on("change", function() {
//   const selectedId = this.value;
//   updateBarChart(selectedId);
// });








// // Function to create the horizontal bar chart
// function createBarChart(sampleData) {
//     // Sort the data based on sample_values in descending order to get the top 10 OTUs
//     const sortedData = sampleData.sort((a, b) => b.sample_values - a.sample_values).slice(0, 10);
  
//     // Reverse the data to display in descending order on the chart
//     const reversedData = sortedData.reverse();
  
//     // Extract values for the bar chart
//     const sampleValues = reversedData.map(d => d.sample_values);
//     const otuIds = reversedData.map(d => `OTU ${d.otu_ids}`);
//     const otuLabels = reversedData.map(d => d.otu_labels);
  
//     // Create the bar chart
//     const trace = {
//       x: sampleValues,
//       y: otuIds,
//       text: otuLabels,
//       type: "bar",
//       orientation: "h",
//     };
  
//     const layout = {
//       title: "Top 10 OTUs",
//       xaxis: { title: "Sample Values" },
//       yaxis: { title: "OTU IDs" },
//     };
  
//     Plotly.newPlot("bar", [trace], layout);
//   }
  
//   // Function to update all plots when a new sample is selected
//   function optionChanged(selectedValue) {
//     d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
//       .then(function(data) {
//         const samples = data.samples;
//         const metadata = data.metadata;
  
//         // Filter data based on the selected individual
//         const selectedData = samples.find(sample => sample.id === selectedValue);
//         const selectedMetadata = metadata.find(meta => meta.id === parseInt(selectedValue));
  
//         // Update the bar chart
//         createBarChart(selectedData);
  
//         // Display sample metadata
//         displayMetadata(selectedMetadata);
//       })
//       .catch(function(error) {
//         console.error("Error loading the data:", error);
//       });
//   }
  
//   // Initial plot rendering with the first individual's data
//   d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
//     .then(function(data) {
//       const individuals = data.names;
//       const dropdown = d3.select("#selDataset");
  
//       // Add options to the dropdown menu
//       dropdown
//         .selectAll("option")
//         .data(individuals)
//         .enter()
//         .append("option")
//         .text(d => d);
  
//       // Call the optionChanged function with the first individual's data
//       optionChanged(individuals[0]);
//     })
//     .catch(function(error) {
//       console.error("Error loading the data:", error);
//     });
//   // Function to create the bubble chart
// function createBubbleChart(sampleData) {
//     const trace = {
//       x: sampleData.otu_ids,
//       y: sampleData.sample_values,
//       text: sampleData.otu_labels,
//       mode: "markers",
//       marker: {
//         size: sampleData.sample_values,
//         color: sampleData.otu_ids,
//         colorscale: "Viridis",
//       },
//     };
  
//     const layout = {
//       title: "Belly Button Biodiversity - Bubble Chart",
//       xaxis: { title: "OTU IDs" },
//       yaxis: { title: "Sample Values" },
//     };
  
//     Plotly.newPlot("bubble", [trace], layout);
//   }
  
//   // Function to update all plots when a new sample is selected
//   function optionChanged(selectedValue) {
//     d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
//       .then(function(data) {
//         const samples = data.samples;
//         const metadata = data.metadata;
  
//         // Filter data based on the selected individual
//         const selectedData = samples.find(sample => sample.id === selectedValue);
//         const selectedMetadata = metadata.find(meta => meta.id === parseInt(selectedValue));
  
//         // Update the bar chart
//         createBarChart(selectedData);
  
//         // Create the bubble chart
//         createBubbleChart(selectedData);
  
//         // Display sample metadata
//         displayMetadata(selectedMetadata);
//       })
//       .catch(function(error) {
//         console.error("Error loading the data:", error);
//       });
//   }
  
//   // Initial plot rendering with the first individual's data
//   d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
//     .then(function(data) {
//       const individuals = data.names;
//       const dropdown = d3.select("#selDataset");
  
//       // Add options to the dropdown menu
//       dropdown
//         .selectAll("option")
//         .data(individuals)
//         .enter()
//         .append("option")
//         .text(d => d);
  
//       // Call the optionChanged function with the first individual's data
//       optionChanged(individuals[0]);
//     })
//     .catch(function(error) {
//       console.error("Error loading the data:", error);
//     });
  
  