require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/database");
const contactRoutes = require("./src/routes/contactRoutes");
const organizationRoutes = require("./src/routes/organizationRoutes");
const dealRoutes = require("./src/routes/dealRoutes");
const activityRoutes = require("./src/routes/activityRoutes");
const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const { verifyToken } = require("./src/middleware/authMiddleware");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// Public auth routes
app.use("/api/auth", authRoutes);

// Protected dashboard routes
app.use("/api/dashboard", verifyToken, dashboardRoutes);

// Protected contact routes (require authentication)
app.use("/api/contacts", verifyToken, contactRoutes);
app.use("/api/organizations", verifyToken, organizationRoutes);
app.use("/api/deals", verifyToken, dealRoutes);
app.use("/api/activities", verifyToken, activityRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
