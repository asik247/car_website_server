const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
//Todo middleware;
app.use(cors());
app.use(express.json());
//Todo mongodb client;
const client = new MongoClient(process.env.MONGO_URI);
//Todo main funk;
async function run() {
    try {
        await client.connect();
        //Todo my db and db coll;
        const db = client.db('carWebsite');
        const userColl = db.collection('users');
        //Todo post users data in users coll;
        app.post('/users', async (req, res) => {
            const result = await userColl.insertOne(req.body);
            res.send(result);
        });
        //Todo root apis;
        app.get('/', (req, res) => {
            res.send('Car website running...');
        });
        //Todo ping message;
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error(error);
    }
}
//Todo cal run funk;
run();
//Todo listen port;
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
