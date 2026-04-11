const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    organizationId: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["lead", "prospect", "customer", "inactive"],
      default: "lead",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Contact", contactSchema);
