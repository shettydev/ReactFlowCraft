const mongoose = require("mongoose");

// Define schema for node
const nodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed // Allow for flexible data structure
  },
  position: {
    type: {
      x: Number,
      y: Number
    },
    required: true
  }
});

// Define schema for edge
const edgeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  }
});

// Define schema for storing the entire graph
const graphSchema = new mongoose.Schema({
  name: String,
  nodes: [nodeSchema], // Array of nodes
  edges: [edgeSchema]  // Array of edges
},{
  timestamps: true
});

// Define model for the graph
const Graph = mongoose.model("Graph", graphSchema);

module.exports = Graph;
