const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
    try {
        await client.connect();

        const db = client.db('carWebsite');
        const userColl = db.collection('users');

        app.post('/users', async (req, res) => {
            const result = await userColl.insertOne(req.body);
            res.send(result);
        });

        app.get('/', (req, res) => {
            res.send('Car website running...');
        });

        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error(error);
    }
}

run();

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
