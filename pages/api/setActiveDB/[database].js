import mongoClient from '../../../lib/mongoClient';

export default async function handler(req, res) {
  const { database} = req.query; // Get database from URL parameters

  try {
    await mongoClient.connect(); // Connect to MongoDB if not connected already
    const db = mongoClient.db(database); // Access the specified database
    const data = await getCollections();
    res.status(200).json(data); // Send data as JSON response
  } catch (error) {
    console.error("Failed to fetch data from MongoDB:", error);
    res.status(500).json({ message: "Failed to fetch data", error: error.toString() });
  }
}