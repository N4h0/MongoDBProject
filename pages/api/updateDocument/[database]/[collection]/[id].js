import { ObjectId } from 'mongodb';
import mongoClient from '../../../../../lib/MongoClient';

export default async function handler(req, res) {
    const { database, collection, id: documentId } = req.query;

    if (req.method === 'PUT') {
        await mongoClient.connect(); // Ensure connection to MongoDB
        const db = mongoClient.db(database); // Access the specified database
        const col = db.collection(collection); // Access the specified collection

        const { data } = req.body; // Expect `data` object in the request body

        console.log('Request received:', req.body);
        // Validate the `data` payload
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'Invalid or empty update data.' });
        }

        try {
            // Perform the update
            const result = await col.updateOne(
                { _id: new ObjectId(documentId) }, // Match by `_id`
                { $set: data } // Use `$set` to update specified fields
            );

            if (result.matchedCount > 0) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(404).json({ error: 'Document not found.' });
            }
        } catch (error) {
            console.error('Error updating document:', error);
            return res.status(500).json({ error: 'Failed to update document.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}
