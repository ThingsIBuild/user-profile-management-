import mongoose from "mongoose"
import { env } from "./env"
import { logger } from "../logger/index"

export async function  database_connection() {
    try {
        mongoose.connect(env.MONGO_URI as string, {dbName:'ADMIN_USER_DASHBOARD_DB'})
        logger.info("successfully connected to database")
    } catch (error) {
        logger.error("failed to connect the database")
    }
}


export const getDBStatus = () => {
  const state = mongoose.connection.readyState;

  const statusMap = {
    0: { status: "disconnected", color: "red" },
    1: { status: "connected", color: "green" },
    2: { status: "connecting", color: "yellow" },
    3: { status: "disconnecting", color: "orange" }
  };

  const current = statusMap[state as keyof typeof statusMap] || {
    status: "unknown",
    color: "gray"
  };

  return {
    ...current,
    code: state
  };
};