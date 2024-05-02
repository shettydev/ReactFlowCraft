const mongoose = require("mongoose");

// Define schema for sequence steps (nodes)
const sequenceStepSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Send Email", "Wait", "Decision"] // Define the types of sequence steps
  },
  parameters: {
    type: mongoose.Schema.Types.Mixed // Allows for customizable parameters
  }
});

// Define schema for email sequence
const emailSequenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  steps: [sequenceStepSchema] // Embed sequence steps in the email sequence
}, {
  timestamps: true
});

// Define model for email sequence
const EmailSequence = mongoose.model("EmailSequence", emailSequenceSchema);

module.exports = EmailSequence;
