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
// Error handling middleware
app.use((err, request, response, next) => {
  console.error("Error occurred:", err); // Log the error to CloudWatch

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  return response.status(500).json({
    status: "error",
    message: "Internal Server Error",
    error: err.message, // Optionally include the error message for debugging
  });
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// Immediately invoke to run migrations when the Lambda function is deployed
// (async () => {
//   await migrateAndSeed();
//   console.log("Migrations and seed data complete.");
// })();

// Export the serverless handler for AWS Lambda
module.exports.handler = serverless(app);