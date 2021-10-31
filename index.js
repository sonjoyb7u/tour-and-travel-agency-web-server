const express = require('express');
const { MongoClient } = require('mongodb');
// Include Environment Variable ...
require('dotenv').config();
// Connect to Server + React Application(Client) ...
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5001;
// Used Middleware ...
app.use(cors());
// Data Parser ...
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eyx6a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Initially Check Server Run ...
app.get('/', (req, res) => {
    res.send("Tour & Travel App - Server Running...");
});


async function run() {
    try {
        await client.connect();
        const database = client.db("tourTravelerApp");
        const tourPackageCollection = database.collection("tourPackageItems");
        const orderBookingCollection = database.collection("bookingOrders");

        // CRUD OPERATION ... 
        
        // Create/Add Tour Package Post API ... 
        app.post('/tour-package/create', async (req, res) => {
            const formData = req.body;
            // console.log(formData);
            const create = await tourPackageCollection.insertOne(formData);
            res.json(formData);

        });

        //Read All Tour Packages Data Get API ... 
        app.get('/all-tour-packages', async (req, res) => {
            const query = {};
            const findTourPackage = tourPackageCollection.find(query);
            const tourPackage = await findTourPackage.toArray();
            res.send(tourPackage)
        })


    } 
    finally {
        // await client.close();
    }
}

run().catch(console.dir)


app.listen(port, () => {
    console.log("Listen & Running App Server port no: ", port);
})
