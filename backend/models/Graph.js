const mongoose = require("mongoose");

// Schema for node
const nodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  position: {
    type: {
      x: Number,
      y: Number
    },
    required: true
  }
});

// Schema for edge
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

// Schema for storing the entire graph
const graphSchema = new mongoose.Schema({
  name: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  nodes: [nodeSchema], 
  edges: [edgeSchema]  
},{
  timestamps: true
});

// Model for the graph
const Graph = mongoose.model("Graph", graphSchema);

module.exports = Graph;
