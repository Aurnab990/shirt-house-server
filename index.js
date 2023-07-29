const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = 'mongodb+srv://newdata:hAC0Qp8JViZ7dFyn@cluster0.pg0uckr.mongodb.net/?retryWrites=true&w=majority';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const shirtsCollection = client.db('devhouse').collection('shirts');
    const orderCollection = client.db('devhouse').collection('orders');
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    app.get('/shirts', async(req,res)=>{
      const query = {};
      const cursor = shirtsCollection.find(query);
      const shirts = await cursor.toArray();
      res.send(shirts);

    });
    app.get('/shirts/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const shirts = await shirtsCollection.findOne(query);
      res.send(shirts);

    });

    //orders api
    app.get('/orders', async(req, res)=>{
      let query = {};
      if(req.query.email){
        query = {
          email: req.query.email
        }
      }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);

    });
    app.post('/orders', async(req, res)=>{
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    //DELETE ORDER  
    app.delete('/orders/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("Server is running");
})

app.listen(port, ()=>{
    console.log(`Hello server connected on ${port}`);
})
