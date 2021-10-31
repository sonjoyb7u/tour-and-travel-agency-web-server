const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        });

        // Client Tour Booking Item Detail API Use GET ... 
        app.get('/tour-booking/detail/:id', async (req, res) => {
            const tourPackageId = req.params.id;
            const query = { _id: ObjectId(tourPackageId) };
            const tourPackage = await tourPackageCollection.findOne(query);
            // console.log(tourPackage);
            res.json(tourPackage);

        });

        // Set Order Booking API Use POST(Client) ... 
        app.post('/order-placed', async (req, res) => {
            const orderPlacedForm = req.body;
            // console.log(orderPlacedForm);
            const result = await orderBookingCollection.insertOne(orderPlacedForm);
            res.json(result);

        });


        //Read All Booking Orders Get API ... 
        app.get('/all-booking-orders', async (req, res) => {
            const findOrders = orderBookingCollection.find({});
            const services = await findOrders.toArray();
            res.send(services)
        });

        // Read/Show Single Booking Order Detail Get API ... 
        app.get('/booking-order/detail/:id', async (req, res) => {
            // console.log(req.params.id);
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const orderBookDetail = await orderBookingCollection.findOne(query);
            res.json(orderBookDetail);
        });

        // Update Single Booking Order Data API ... 
        app.put('/booking-order/update/:id', async (req, res) => {
            const orderId = req.params.id;
            const updateFormData = req.body;
            console.log(updateFormData);
            const filter = {_id: ObjectId(orderId) }
            const options = { upsert: true };
            const updated = await orderBookingCollection.updateOne(filter, updateFormData, options)
            res.json(updated)

        });

        // Get API Delete/Destroy Tour Booking ... 
        app.delete('/booking-order/delete/:id', async (req, res) => {
            // console.log(req.params.id);
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const destroy = await orderBookingCollection.deleteOne(query)
            console.log(destroy);
            res.json(destroy)
        });

        // Use GET Authenticate Client Booking Order Items API... 
        app.get('/user-booking-order/:email', async (req, res) => {
            const userEmail = req.params.email;
            console.log(userEmail);
            const query = {email: userEmail}
            const myOrders = await orderBookingCollection.find(query).toArray();
            res.json(myOrders);

        })

        // Get API Delete/Destroy Client Booking Order Items ... 
        app.delete('/user-booking-order/delete/:id', async (req, res) => {
            // console.log(req.params.id);
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const destroy = await orderBookingCollection.deleteOne(query);
            res.json(destroy);

        });


    } 
    finally {
        // await client.close();
    }
}

run().catch(console.dir)


app.listen(port, () => {
    console.log("Listen & Running App Server port no: ", port);
})
