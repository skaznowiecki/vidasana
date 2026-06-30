import { MongoClient, type MongoClientOptions } from "mongodb";

const LOCAL_DEV_URI = "mongodb://127.0.0.1:27017";

const uri =
  process.env.NODE_ENV === "development"
    ? (process.env.MONGODB_URI ?? LOCAL_DEV_URI)
    : process.env.MONGODB_URI;

const options: MongoClientOptions = {
  maxPoolSize: 10,
  maxIdleTimeMS: 10_000,
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    return global._mongoClientPromise;
  }

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri, options).connect();
  }
  return global._mongoClientPromise;
}

export async function getDb() {
  const clientPromise = getClientPromise();
  if (!clientPromise) return null;

  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB ?? "vidasana";
  return client.db(dbName);
}
