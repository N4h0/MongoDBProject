import mongoClient from '../../../../lib/MongoClient';

export default async function handler(req, res) {
    const { database, collection } = req.query;

    if (req.method === 'POST') {
        await mongoClient.connect(); // Connect to MongoDB if not connected already
        const db = mongoClient.db(database); // Access the specified database
        const col = db.collection(collection); // Access the specified collection
        const { data } = req.body;
        const result = await col.insertOne(data);
        return res.status(201).json({ success: true, documentId: result.insertedId });

    } else {
        console.error("Post request required!");
    }
}