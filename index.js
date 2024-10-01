require("dotenv/config");
require("express-async-errors");

const cors = require("cors");
const express = require("express");
const serverless = require("serverless-http");
const routes = require("./src/routes");
const uploadConfig = require("./src/configs/upload");
const AppError = require("./src/utils/AppError");

// Import the migrateAndSeed function
const migrateAndSeed = require('./migrateAndSeed'); 

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors());

// Serve static files
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

// Register routes
app.use(routes);

// Error handling middleware
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
  if (process.env.RUN_MIGRATIONS === 'true') { // Control with environment variable
    try {
      await migrateAndSeed();
      console.log("Migrations and seed data complete.");
    } catch (error) {
      console.error("Error running migrations:", error);
      throw new Error("Failed to run migrations");
    }
  }
}

// Immediately invoke to run migrations when the Lambda function is deployed
(async () => {
  await runMigrations(); // Wait for migrations before proceeding
})();

// Export the serverless handler for AWS Lambda
module.exports.handler = serverless(app);
