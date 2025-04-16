import "dotenv/config";

import express from "express";
import process from "process";
import cors from "cors";
import { connectToDB, disconnectFromDB } from "./config/database.js";
import setupSwagger from "./config/swagger.js";
import routes from "./config/routes.js";
import { logApiCalls } from "./middlewares/logging.middleware.js";
import { globalErrorHandler } from "./middlewares/errors.middleware.js";
import { populateAccountingDocument } from "./modules/accounting/accounting.controller.js";
import { populateOrganization } from "./modules/organization/organization.controller.js";
import { populateSuperAmsAdmin } from "./modules/user/user.controller.js";
// import { restoreDB } from "./config/db-backup.js";

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());

app.use(cors());

app.get("/api/v1", (_, res) => {
  return res.status(200).json({ message: "We are live" });
});

// routing
app.use("/api/v1", routes);

// logging
app.use(logApiCalls);

// global error handling
app.use(globalErrorHandler);

// init DB then start server
connectToDB(() => {
  console.log("Connected to database");

  populateSuperAmsAdmin();
  populateAccountingDocument();
  populateOrganization();

  app.listen(port, () => {
    // restoreDB("");
    console.log(`Server listening on port ${port}`);
  });

  setupSwagger(app);
});

// On server shutdown
process.on("SIGINT", async () => {
  await disconnectFromDB();
  console.log("Disconnected from database");
  process.exit(1);
});
