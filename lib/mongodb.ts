import { MongoClient, Db } from "mongodb";

const DEFAULT_URI = "mongodb+srv://genxpks_db_user:WCxt4C4P6gcbnxlD@cluster0.2w5nhw1.mongodb.net/test_python_saoviet?retryWrites=true&w=majority&appName=Cluster0";
const uri = process.env.MONGODB_URI || DEFAULT_URI;

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;

export async function getDatabase(dbName: string = "test_python_saoviet"): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
