const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide an organization name"],
      trim: true,
      maxlength: [120, "Organization name cannot exceed 120 characters"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [240, "Address cannot exceed 240 characters"],
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [120, "Industry cannot exceed 120 characters"],
    },
  },
  {
    timestamps: true,
  },
);

organizationSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Organization", organizationSchema);
