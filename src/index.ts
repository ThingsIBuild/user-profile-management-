import app from "./app";
import { database_connection } from "./config/db";
import { env } from "./config/env";
import { logger } from "./logger/index";

async function startServer() {
  try {
    await database_connection();

    app.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error("failed to connect to database", error);
  }
}

startServer();
