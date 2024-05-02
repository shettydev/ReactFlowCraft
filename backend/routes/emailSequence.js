const express = require("express");
const router = express.Router();
const EmailSequence = require("../models/EmailSequence");
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// Create a new email sequence
router.post("/", async (req, res) => {
  try {
    const { name, steps } = req.body;
    console.log(req.body)
    const newSequence = new EmailSequence({ name, steps });
    await newSequence.save();
    res.status(201).json(newSequence);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});

// Get all email sequences
router.get("/", async (req, res) => {
  try {
    const sequences = await EmailSequence.find();
    res.json(sequences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific email sequence by ID
router.get("/:id", async (req, res) => {
  try {
    const sequence = await EmailSequence.findById(req.params.id);
    if (!sequence) {
      return res.status(404).json({ error: "Sequence not found" });
    }
    res.json(sequence);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an email sequence by ID
router.patch("/:id", async (req, res) => {
  try {
    const { name, steps } = req.body;
    const updatedSequence = await EmailSequence.findByIdAndUpdate(req.params.id, { name, steps }, { new: true });
    if (!updatedSequence) {
      return res.status(404).json({ error: "Sequence not found" });
    }
    res.json(updatedSequence);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});

// Delete an email sequence by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedSequence = await EmailSequence.findByIdAndDelete(req.params.id);
    if (!deletedSequence) {
      return res.status(404).json({ error: "Sequence not found" });
    }
    res.json({ message: "Sequence deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
