import mongoose from "mongoose";
import Debug from "debug";

const log = Debug("jobintel:db");

let inMemoryServer: any = null;

export async function connectDB(mongoUri?: string) {
  // Try provided URI first
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      log("Connected to MongoDB URI");
      return;
    } catch (err: any) {
      log("Failed to connect with provided MONGODB_URI:", err?.message || err);
      const shouldFallback = process.env.USE_INMEM === "true" || process.env.NODE_ENV !== "production";
      if (!shouldFallback) throw err;
      log("Falling back to in-memory MongoDB because non-production or USE_INMEM requested.");
    }
  }

  // Start in-memory MongoDB for local dev/testing
  try {
    // lazy import so package is optional
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MongoMemoryServer } = require("mongodb-memory-server");
    inMemoryServer = await MongoMemoryServer.create();
    const uri = inMemoryServer.getUri();
    await mongoose.connect(uri);
    log("Connected to in-memory MongoDB");
  } catch (err) {
    log("Failed to start in-memory MongoDB:", err);
    throw err;
  }
}

export async function stopInMemory() {
  if (mongoose.connection.readyState) await mongoose.disconnect();
  if (inMemoryServer) await inMemoryServer.stop();
}
