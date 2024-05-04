const express = require("express");
const router = express.Router();
const Graph = require("../models/Graph");
const authMiddleware = require("../middlewares/authMiddleware")

// Create a new graph
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { nodes, edges, name } = req.body;
    const newGraph = new Graph({ nodes, edges, name, user: req.user.id });
    await newGraph.save();
    res.status(201).json(newGraph);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all graphs
router.get("/", authMiddleware, async (req, res) => {
  try {
    const graphs = await Graph.find({ user: req.user.id });
    res.json(graphs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific graph by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const graph = await Graph.findById(req.params.id);
    if (!graph) {
      return res.status(404).json({ error: "Graph not found" });
    }
    res.json(graph);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a graph by ID
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { nodes, edges, name } = req.body;
    const updatedGraph = await Graph.findByIdAndUpdate(req.params.id, { nodes, edges, name }, { new: true });
    if (!updatedGraph) {
      return res.status(404).json({ error: "Graph not found" });
    }
    res.json(updatedGraph);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a graph by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedGraph = await Graph.findByIdAndDelete(req.params.id);
    if (!deletedGraph) {
      return res.status(404).json({ error: "Graph not found" });
    }
    res.json({ message: "Graph deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
