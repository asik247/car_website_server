const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 3000;
//Todo middleware;
app.use(cors());
app.use(express.json());
//! Firebase Token Verify code here.
const verifyTokenWithFirebase = async (req, res, next) => {
    // console.log(req.headers.authorization);
    const authHeader = req.headers.authorization;
    // console.log(author);
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    // console.log('token',token);
    if(!token){
        return res.status(401).send({message:'Unauthorized access'})
    }
    try{
        const decoded = await getAuth().verifyIdToken(token);
        req.decoded = decoded.email;
        next();
    }catch(err){
        return res.status(401).send({message:"Invalid Token"})
    }


    // next()
}
//Todo mongodb client;
//?Firebase Admin sdk code here.
// var admin = require("firebase-admin");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
// console.log(admin);
// console.log(admin.credential);

var serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
}
// console.log(serviceAccount);

initializeApp({
    credential: cert(serviceAccount)
});

const client = new MongoClient(process.env.MONGO_URI);
//Todo main funk;
async function run() {
    try {
        await client.connect();
        //Todo my db and db colls;
        const db = client.db('carWebsite');
        const carsColl = db.collection('cars');
        const addToCartColl = db.collection('addToCartsData');

        //Todo post addToCarts Data in addToCartColl.
        app.post('/addToCartsData', async (req, res) => {
            const addToCartsInfo = req.body;
            const result = await addToCartColl.insertOne(addToCartsInfo)
            res.send(result)
        })
        //! Get AllCars data in db;
        app.get('/allCars', verifyTokenWithFirebase, async (req, res) => {
            const allCarsData = await carsColl.find().limit(10).toArray();
            // console.log(req.headers.authorization);
            // console.log(res);
            // console.log(req.decoded);
            res.send(allCarsData);
            
        })





        //? Get AddToCartColl data in dbs;
        app.get('/addToCartsData', async (req, res) => {
            const datas = await addToCartColl.find().toArray();

            res.send(datas)
        })
        //? Remove AddToCartData in db.
        app.delete('/addToCartsData/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('id',idssssss);
            const query = { _id: new ObjectId(id) };
            const result = await addToCartColl.deleteOne(query);
            res.send(result)
        })

        //Todo post cars data in carsColl;
        app.post('/cars', async (req, res) => {
            const result = await carsColl.insertOne(req.body);
            res.send(result);
        });
        //Todo get cars data in carsColl;
        app.get('/cars/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await carsColl.findOne(query)
            res.send(result);
        });
        app.get('/cars', async (req, res) => {
            const category = req.query.category;
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
        //Todo Stripe Checkedout session code start heres.
        app.post("/create-checkout-session", async (req, res) => {
            try {
                const { items } = req.body; // array of cart itemss

                if (!items || !Array.isArray(items) || items.length === 0) {
                    return res.status(400).send({ error: "No items provided for checkout." });
                }

                const line_items = items.map((item) => ({
                    price_data: {
                        currency: "usd",
                        product_data: { name: item.carName },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: item.quantity || 1,
                }));

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items,
                    mode: "payment",
                    success_url: `${process.env.YOUR_DOMAIN}/complete?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.YOUR_DOMAIN}/cancel`,
                });

                res.send({ url: session.url });
            } catch (error) {
                console.log(error);
                res.status(500).send({ error: error.message });
            }
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
