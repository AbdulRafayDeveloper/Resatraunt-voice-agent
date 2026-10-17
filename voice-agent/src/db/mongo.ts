import { MongoClient, type Db } from "mongodb";

import type { Logger } from "../logger.js";

export interface MongoConnection {
  client: MongoClient;
  db: Db;
  /** True when the server answers a ping; used by the health check. */
  ping(): Promise<boolean>;
  close(): Promise<void>;
}

export interface MongoOptions {
  uri: string;
  dbName: string;
}

export async function connectMongo(options: MongoOptions, logger: Logger): Promise<MongoConnection> {
  const client = new MongoClient(options.uri, {
    appName: "tabletalk-voice-agent",
    serverSelectionTimeoutMS: 10_000,
  });
  await client.connect();
  const db = client.db(options.dbName);
  logger.info({ db: options.dbName }, "connected to MongoDB");

  return {
    client,
    db,
    async ping() {
      try {
        await db.command({ ping: 1 });
        return true;
      } catch {
        return false;
      }
    },
    close: () => client.close(),
  };
}
