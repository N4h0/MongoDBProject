import mongoClient from '../../../../../lib/MongoClient';
import { ObjectId } from 'mongodb';


export default async function handler(req, res) {
  const { database, collection, id } = req.query; // Get database and collection from URL parameters
  console.log("Attempting to delete document with id: ", id);

  try {
    await mongoClient.connect(); // Connect to MongoDB if not connected already
    const db = mongoClient.db(database); // Access the specified database
    const col = db.collection(collection); // Access the specified collection
    const result = await col.deleteOne({ _id: new ObjectId(id) });

  } catch (error) {
    console.error("Failed to fetch data from MongoDB:", error);
    result.status(500).json({ message: "Failed to fetch data", error: error.toString() });
  }
}