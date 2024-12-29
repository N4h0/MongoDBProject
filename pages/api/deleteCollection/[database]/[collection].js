import mongoClient from '../../../../lib/MongoClient';

export default async function handler(req, res) {
    const { database, collection } = req.query;

    console.log("Request received to delete collection:", req.query);

    if (!database || !collection) {
        res.status(400).json({ message: "Both database and collection names are required." });
        return;
    }

    try {
        await mongoClient.connect();
        const db = mongoClient.db(database); // Access the specified database
        const targetCollection = db.collection(collection); // Get the specific collection
        await targetCollection.drop(); // Drop the collection
        res.status(200).json({ message: `Collection ${collection} in database ${database} deleted successfully!` });
    } catch (error) {
        console.error("Error deleting collection:", error);
        res.status(500).json({ message: "Failed to delete collection", error: error.toString() });
    }
}
