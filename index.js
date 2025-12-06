const app = require("./app");

if (require.main === module) {
  const PORT = process.env.PORT || 3030;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;