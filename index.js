const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// 
// 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xkximz0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    

    const gardenerCollection = client.db('gardenerDB').collection('gardeners')

    const trendingTips = client.db('planTipsDB').collection('tips')


    app.get('/gardeners',async(req,res)=>{

        const activeGardeners = await gardenerCollection.find({status:'active'}).limit(6).toArray();
        res.send(activeGardeners);

    })
    app.get('/tips',async(req,res)=>{

        const allTips = await trendingTips.find().limit(6).toArray();
        res.send(allTips);

    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{

    res.send('Planting trees in server..!')
});

app.listen(port,()=>{

    console.log(`Plant server is running on port ${port}`);
})