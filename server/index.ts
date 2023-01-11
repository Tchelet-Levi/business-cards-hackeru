import * as dotenv from "dotenv";
dotenv.config(); // Make sure the environment variable is loaded before any other import. See https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import fileUpload from "express-fileupload";
import express from "express";
import { startDB } from "./src/database/database_manager";
import { jsonErrorHandler } from "./src/middleware/jsonHandler";
import { jwtAuthorizeMiddleware } from "./src/middleware/jwtAuthorizeMiddleware";
import { APIRouter } from "./src/routes/api_router";

const PORT = process.env.PORT;
const app = express();

// Enable JSON parser
app.use(express.json());

// Handle JSON syntax errors
app.use(jsonErrorHandler);

// Handle uploading files
app.use(
  fileUpload({ limits: { fileSize: 50 * 1024 * 1024 }, createParentPath: true, abortOnLimit: true })
);

// Statically serve assets
app.use("/assets", express.static("assets"));

// Serve the front end
app.use(express.static("dist"));

// Handle protected routes
app.use(jwtAuthorizeMiddleware);

// API router
app.use("/api", APIRouter);

app.listen(PORT || 3500, async () => {
  if (PORT) console.log(`Listening on port ${PORT}. http://localhost:${PORT}.`);
  if (PORT === undefined)
    console.log(
      `No PORT environment variable. Listening on port ${3500} instead. http://localhost:${3500}.`
    );

  // Start the DB
  await startDB();
});
