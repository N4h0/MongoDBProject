import mongoClient from '../../../../lib/MongoClient';

export default async function handler(req, res) {
  const { database, collection } = req.query; // Get database and collection from URL parameters

  try {
    await mongoClient.connect(); // Connect to MongoDB if not connected already
    const db = mongoClient.db(database); // Access the specified database
    const col = db.collection(collection); // Access the specified collection

    const data = await col.find({}).toArray(); // Fetch all documents in the collection
    res.status(200).json(data); // Send data as JSON response
  } catch (error) {
    console.error("Failed to fetch data from MongoDB:", error);
    res.status(500).json({ message: "Failed to fetch data", error: error.toString() });
  }
}