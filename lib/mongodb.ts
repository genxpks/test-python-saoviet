// lib/mongodb.ts - Kết nối MongoDB Atlas Singleton cho Next.js & Vercel Serverless
// Đơn vị: TIN HỌC SAO VIỆT THỦ ĐỨC

import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://genxpks_db_user:WCxt4C4P6gcbnxlD@cluster0.2w5nhw1.mongodb.net/test_python_saoviet?retryWrites=true&w=majority&appName=Cluster0";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  // If not explicitly set in process.env, use the URI
  console.log("Using default MongoDB URI from atlas-credentials");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase(dbName: string = "test_python_saoviet"): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
