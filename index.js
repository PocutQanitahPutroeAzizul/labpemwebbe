const app = require("./app");

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    status: "error",
    code: 500,
    message: "Internal Server Error: " + err.message,
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3030;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
