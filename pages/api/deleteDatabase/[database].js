import mongoClient from '../../../lib/MongoClient';

export default async function handler(req, res) {
  const { database } = req.query;

  console.log("Request received:", req.query);

  if (!database) {
    res.status(400).json({ message: "Database name is required." });
    return;
  }

  try {
    await mongoClient.connect();
    const db = mongoClient.db(database); // Access the specific database
    await db.dropDatabase(); // Drop the database
    res.status(200).json({ message: `Database ${database} deleted successfully!` });
  } catch (error) {
    console.error("Error deleting database:", error);
    res.status(500).json({ message: "Failed to delete database", error: error.toString() });
  }
}
