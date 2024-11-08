//Nada try catch

import mongoClient from './MongoClient';

export default async function getDatabases() {
    await mongoClient.connect();
    console.log("Connected to MongoDB successfully");

    const admin = mongoClient.db().admin();
    const databasesList = await admin.listDatabases();
    const data = databasesList.databases
    .map((db) => db.name) //Vil berre hente ut navnet til databasen
    .filter((name) => name !== 'admin' && name !== 'local'); //Fjerner databasene der navne er local og admin (Dei er alltid med).
    return data;
}
