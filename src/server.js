require("express-async-errors");

const cors = require("cors");
const express = require("express");
const routes = require("./routes");
const uploadConfig = require("./configs/upload");
const AppError = require("./utils/AppError");

// Import the migrateAndSeed function
const migrateAndSeed = require('../migrateAndSeed'); 

// Create an async function to run migrations before starting the server
async function startServer() {
  try {
    // Run migrations and seed the data
    await migrateAndSeed();

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

    // Start the server
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the process with failure if something goes wrong
  }
}

// Call the async function to start the server
startServer();
