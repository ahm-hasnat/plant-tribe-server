const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
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
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const gardenerCollection = client.db("gardenerDB").collection("gardeners");

    const tipsCollection = client.db("planTipsDB").collection("tips");

    app.post("/tipsdata", async (req, res) => {
      const newTips = req.body;
      console.log(newTips);
      const result = await tipsCollection.insertOne(newTips);
      res.send(result);
    });

    app.get("/gardeners", async (req, res) => {
      const activeGardeners = await gardenerCollection
        .find({ status: "active" })
        .limit(6)
        .toArray();
      res.send(activeGardeners);
    });
    app.get("/allgardeners", async (req, res) => {
      const allGardeners = await gardenerCollection.find().toArray();
      res.send(allGardeners);
    });

    app.get("/publictips", async (req, res) => {
      const publicTips = await tipsCollection
        .find({ availability: "Public" })
        .toArray();
      res.send(publicTips);
    });

    app.get("/tips", async (req, res) => {
      const trendingTips = await tipsCollection
        .find({ availability: "Public" })
        .sort({ likes: -1 })
        .limit(6)
        .toArray();
      res.send(trendingTips);
    });
    app.get("/alltips", async (req, res) => {
      const allTips = await tipsCollection.find().toArray();
      res.send(allTips);
    });
    app.get("/alltips/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tipsCollection.findOne(query);
      res.send(result);
    });
    app.get("/publictips/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tipsCollection.findOne(query);
      res.send(result);
    });
    app.put("/alltips/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTip = req.body;
      const updatedDoc = {
        $set: updatedTip,
      };
      const result = await tipsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.patch("/publictips/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedLike = req.body;
      const updatedDoc = {
        $set: updatedLike,
      };
      const result = await tipsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/alltips/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tipsCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Planting trees in server..!");
});

app.listen(port, () => {
  console.log(`Plant server is running on port ${port}`);
});
