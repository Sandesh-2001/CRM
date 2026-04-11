const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Please provide an activity type"],
      enum: ["call", "meeting", "task"],
    },
    date: {
      type: Date,
      required: [true, "Please provide an activity date"],
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    relatedTo: {
      entityType: {
        type: String,
        required: [true, "Please provide a related entity type"],
        enum: ["contact", "deal"],
      },
      entityId: {
        type: String,
        required: [true, "Please provide a related entity"],
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Activity", activitySchema);
