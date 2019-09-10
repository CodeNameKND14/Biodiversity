function buildMetadata(sample) {
  // Used `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
  // Used d3 to select the panel with id of `#sample-metadata` and stored it in a variable
    var metaData = d3.select("#sample-metadata");
  // Used `.html("") to clear the existing metadata
    metaData.html("");
  // Used `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      metaData.append("h5").text(`${key}: ${value}`);
    });
  console.log(data.WFREQ);  
  buildGauge(data.WFREQ);  
  });

    // BONUS: Build the Gauge Chart
};

function buildCharts(sample) {
  // Used `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    
    // Stored the data into variables 
    const otu_ids = data.otu_ids; 
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values; 
    
    // Created the bubbleLayout and bubbleData
    var bubbleLayout = {
      margin: {t: 0},
      hovermode: "closest",
      xaxis: {title: "OTU ID"}
    };

    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ]; 
  //Plot the bubble chart 
  Plotly.plot("bubble", bubbleData, bubbleLayout)

  // // Created the pieLayout and pieData
  var pieData = [
    {
      values: sample_values.slice(0, 10),
      labels: otu_ids.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      hoverinfo: "hovertext",
      type: "pie"
    }
  ];
  
  var pieLayout = {
    margin: {t: 0, l: 0}
  };
  //Plot the pie chart 
  Plotly.plot("pie", pieData, pieLayout);
  });


};

function init() {
  // Grabbed a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Used the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the default/initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log("This is new data", newSample); // logs every change
  buildCharts(newSample); // builds the charts
  buildMetadata(newSample); // inserts the metadata into the #sample-metadata class

}

// Initialize the dashboard
init();
