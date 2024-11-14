require("dotenv/config");
require("express-async-errors");

const cors = require("cors");
const express = require("express");
const serverless = require("serverless-http");
const routes = require("./routes");
const uploadConfig = require("./configs/upload");
const AppError = require("./utils/AppError");

// Import the migrateAndSeed function
const migrateAndSeed = require('../migrateAndSeed'); 

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors());

// Serve static files
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

// Register routes
app.use(routes);

// Error handling
app.use((err, request, response, next) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

// Run migrations and seed the data before exporting the handler
async function runMigrations() {
  try {
    await migrateAndSeed();
    console.log("Migrations and seed data complete.");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
}

// Run migrations asynchronously (once) before starting the handler
//runMigrations();

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the serverless handler for AWS Lambda
//module.exports.handler = serverless(app);
