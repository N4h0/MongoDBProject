import getDatabases from "../../lib/getDatabases";

export default async function handler(req, res) {
    const data = await getDatabases();
    res.status(200).json(data); // Send the data as JSON response
}
