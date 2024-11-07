// pages/api/readData/[database]/[collection].js
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export default async function handler(req, res) {
  const { database, collection } = req.query; // Get database and collection from URL parameters

  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db(database); // Access the specified database
    const col = db.collection(collection); // Access the specified collection

    const data = await col.find({}).toArray(); // Fetch all documents in the collection
    res.status(200).json(data); // Send data as JSON response
  } catch (error) {
    console.error("Failed to fetch data from MongoDB:", error);
    res.status(500).json({ message: "Failed to fetch data", error: error.toString() });
  }
}
