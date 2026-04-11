const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a deal title"],
      trim: true,
      maxlength: [140, "Deal title cannot exceed 140 characters"],
    },
    value: {
      type: Number,
      required: [true, "Please provide a deal value"],
      min: [0, "Deal value cannot be negative"],
    },
    stage: {
      type: String,
      required: [true, "Please provide a deal stage"],
      enum: ["Lead", "Contacted", "Proposal", "Won", "Lost"],
      default: "Lead",
    },
    contactId: {
      type: String,
      required: [true, "Please provide a linked contact"],
      trim: true,
    },
    assignedTo: {
      type: String,
      required: [true, "Please provide an assignee"],
      trim: true,
      maxlength: [120, "Assignee cannot exceed 120 characters"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Deal", dealSchema);
