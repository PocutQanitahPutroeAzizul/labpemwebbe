const express = require("express");
const cors = require("cors");
const snapRoutes = require("./routes/snapRoutes");
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", snapRoutes);

module.exports = app;
