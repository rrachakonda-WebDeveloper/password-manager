const express = require("express");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const cors = require("cors");

dotenv.config();

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "passop";
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

client.connect();

// Get all passwords
app.get("/", async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("password");
  const findResult = await collection.find({}).toArray();
  res.json(findResult); 
});

// Save or Update password
app.post("/", async (req, res) => {
  const password = req.body;
  const db = client.db(dbName);
  const collection = db.collection("password");

  const result = await collection.updateOne(
    { id: password.id },
    { $set: password },
    { upsert: true }
  );

  res.send({ success: true, result });
});

// Delete password
app.delete("/", async (req, res) => {
  const { id } = req.body;
  const db = client.db(dbName);
  const collection = db.collection("password");

  const result = await collection.deleteOne({ id });
  res.send({ success: true, result });
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port http//:localhost:${port}`);
});
