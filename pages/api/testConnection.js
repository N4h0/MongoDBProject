// pages/api/testMongoConnection.js
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    console.log(uri)
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    res.status(200).json({ message: "Successfully connected to MongoDB!" });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    res.status(500).json({ message: "Failed to connect to MongoDB", error: error.toString() });
  } finally {
    // Close the connection
    await client.close();
  }
}