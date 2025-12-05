const express = require("express");
const cors = require("cors");
const snapRoutes = require("./routes/snapRoutes");
const app = express();

// CORS configuration untuk Vercel deployment
const corsOptions = {
  origin: [
    "https://labpemwebfe.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", snapRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "StudioSnap API is running",
    timestamp: new Date().toISOString(),
  });
});

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: `Route ${req.originalUrl} not found`,
  });
});

module.exports = app;
