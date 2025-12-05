const express = require("express");
const cors = require("cors");
const snapRoutes = require("./routes/snapRoutes");
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

app.options("*", cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", snapRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "StudioSnap API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: `Route ${req.originalUrl} not found`,
  });
});

module.exports = app;
