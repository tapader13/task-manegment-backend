require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize MongoDB client
const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
