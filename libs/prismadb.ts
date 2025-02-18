import { PrismaClient } from "@prisma/client";
import { MongoClient } from "mongodb";

export async function ensureIndexes() {
  const client = new MongoClient(process.env.MONGODB_URL!);
  await client.connect();
  const db = client.db(); // auto-selects the database from the connection string
  await db.collection("Quest").createIndex({ location: "2dsphere" });
  //await db.collection("User").createIndex({ email: 1 }, { unique: true });
  await client.close();
}

declare global {
    var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV != 'production') globalThis.prisma = client;

await ensureIndexes();
export default client;