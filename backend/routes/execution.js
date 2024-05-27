const express = require("express");
const router = express.Router();
const Graph = require("../models/Graph");
const nodemailer = require("nodemailer");
const authMiddleware = require("../middlewares/authMiddleware");

// Execute the workflow defined in the graph
router.post("/:id", authMiddleware, async (req, res) => {
  try {
    // Find the graph by ID
    const graph = await Graph.findById(req.params.id);
    if (!graph) {
      return res.status(404).json({ error: "Graph not found" });
    }

    // Iterate through the nodes of the graph
    for (const node of graph.nodes) {
      if (node.type === "Send") {
        // Send an email for "Send Email" nodes
        await sendEmail(node.parameters);
      }
      // Add logic for other types of nodes (e.g., "Wait", "Decision")
    }

    res.json({ message: "Workflow executed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Function to send an email using nodemailer
async function sendEmail(parameters) {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure your email provider here (e.g., SMTP, SendGrid, etc.)
    // For testing purposes, you can use SMTP with your Gmail account
    service: "gmail",
    auth: {
      user: "your_email@gmail.com", // Replace with your email address
      pass: "your_password" // Replace with your email password
    }
  });

  // Define the email options
  const mailOptions = {
    from: "your_email@gmail.com", // Replace with your email address
    to: parameters.to,
    subject: parameters.subject,
    text: parameters.body
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

module.exports = router;
