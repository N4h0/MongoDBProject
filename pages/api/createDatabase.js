import mongoClient from '../../lib/MongoClient';

export default async function handler(req, res) {

  const { database, collection } = req.body;
  console.log("Request received:", req.body);


  if (!database || !collection) {
    res.status(400).json({ message: "Database and collection names are required." });
    return;
  }

  try {
    await mongoClient.connect();
    const db = mongoClient.db(database);
    await db.createCollection(collection);
    res.status(201).json({ message: `Database ${database} with collection ${collection} created successfully!` });
  } catch (error) {
    console.error("Error creating database:", error);
    res.status(500).json({ message: "Failed to create database", error: error.toString() });
  }
}
