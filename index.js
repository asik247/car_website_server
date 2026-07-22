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
        const carsColl = db.collection('cars');
        //Todo post cars data in carsColl;
        app.post('/cars', async (req, res) => {
            const result = await carsColl.insertOne(req.body);
            res.send(result);
        });
        //Todo get cars data in carsColl;
        // app.get('/cars', async (req, res) => {
        //     const catagory = req.query.category;
        //     console.log(catagory);
        //     const result = await carsColl.find().limit(3).sort({price: -1}).toArray()
        //     res.send(result);
        // });
        app.get('/cars', async (req, res) => {
            const category = req.query.category;
            console.log(category);

            let query = {};

            if (category) {
                query.category = {
                    $regex: category,
                    $options: 'i'
                };
            }

            const result = await carsColl
                .find(query)
                .sort({ price: -1 })
                .limit(3)
                .toArray();

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
