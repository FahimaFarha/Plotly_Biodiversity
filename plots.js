unction init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Setting Charts
    buildMetadata(940);
    buildCharts(940);
})}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log("resultArray",resultArray);
    var result = resultArray[0];
    console.log("result",result)
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text(result.location);
    Object.entries(result).forEach(function([key,value]){
      PANEL.append("h6").text(key +":"+ value);
    
  });
})};

function buildCharts(sample){
  d3.json("samples.json").then((data) => {

  var sampleData = data.samples;
  var sampleResultArray = sampleData.filter(sampleObj => sampleObj.id == sample);
  var sampleResult = sampleResultArray[0];
  var topTenValues = (sampleResult.sample_values).slice(0,10).reverse();
  var topTenBacteria = (sampleResult.otu_ids).slice(0,10);
  var stringtopTenBacteria = topTenBacteria.map(id => "OTU"+id);
  var bacteriaLabels = (sampleResult.otu_labels).slice(0,10);
  var metadata = data.metadata;
  var metadataResultArray = metadata.filter(sampleObj => sampleObj.id ==sample)
  var metadataResult = metadataResultArray[0];
  var wfreq = metadataResult.wfreq

  // Making Bar Chart
  var traceBar = {x:topTenValues, y:stringtopTenBacteria, type:"bar", 
  orientation:'h', hovertemplate: '<b>%{text}</b>', text:bacteriaLabels};
  var data1 = [traceBar];
  var layout1 = {hoverlabel: { bgcolor: "#fff" }}
  Plotly.newPlot("bar", data1, layout1);

  // Making Bubble Chart
  var otuIds= sampleResult.otu_ids;
  var sampleValues = sampleResult.sample_values;
  var traceBubble = {x:otuIds,y:sampleValues, text:bacteriaLabels, mode:"markers", 
  marker:{size:sampleValues, color: otuIds, colorscale:"Picnic"}};
  var data2 = [traceBubble];
  var layout2 ={xaxis:{title:"OTU ID"}}
  Plotly.newPlot("bubble", data2, layout2)

  // Making Gauge Chart

  var traceBelly = {
    title: { text: "Frequency of Belly Button Washes" },
    domain: { x: [0, 9]},
    type: "indicator",
    value: wfreq,
    mode: "gauge", 
    gauge:{axis:{visible:true,range:[0,9]}}
  };

  var data3 = [traceBelly]
  var layout3 = { width: 600, height: 400, margin: { t: 0, b: 0 }};
  Plotly.newPlot("gauge", data3, layout3);

});
}

init();