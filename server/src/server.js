import { createServer } from "http";
import createSuperAdmin from "./seed.js";
import createApp from "./app.js";
import env from "./config/env.js";
import logger from "./config/logger.js";
import { connectDB } from "./database/mongodb.js";
import { initSocket } from "./sockets/socketGateway.js";

const app = createApp();

// ───create HTTP Server banao — Express + Socket.IO
const httpServer = createServer(app);

// ───attach Socket.IO
initSocket(httpServer);

function startServer() {
  connectDB()
    .then(async () => {
      await createSuperAdmin();

      // httpServer.listen instead app.listen
      httpServer.listen(env.PORT, () => {
        logger.info({ port: env.PORT }, "Server is running on port");
      });
    })
    .catch((err) => {
      logger.error({ error: err }, "Error while running server.");
    });
}

startServer();