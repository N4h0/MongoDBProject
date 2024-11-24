import mongoClient from '../../../lib/MongoClient';

export default async function handler(req, res) {
  const { database} = req.query; // Get database and collection from URL parameters

  try {
    await mongoClient.connect(); // Connect to MongoDB if not connected already
    const db = mongoClient.db(database); // Access the specified database

    const data = await db.listCollections().toArray(); // Henter all info om collection
    const collectionNames = data.map((col) => col.name); //SLepp å få med ekstra info
    console.log("Returning following data to client: ", collectionNames)
    res.status(200).json(collectionNames); // Send data as JSON response
  } catch (error) {
    console.error("Failed to fetch data from MongoDB:", error);
    res.status(500).json({ message: "Failed to fetch data", error: error.toString() });
  }
}