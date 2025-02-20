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
    const dadDB = client.db('dadDB');
    const usersCollection = dadDB.collection('users');
    const tasksCollection = dadDB.collection('tasks');
    app.post('/users', async (req, res) => {
      try {
        const user = req.body;
        console.log(user, '1');
        const findUser = await usersCollection.findOne({ email: user.email });
        if (findUser) {
          return res.status(400).send({
            success: false,
            message: 'User login successfully',
            data: findUser,
          });
        }
        const result = await usersCollection.insertOne(user);
        console.log(result);
        res.status(201).send({
          success: true,
          message: 'User created successfully',
          data: result,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: 'Failed to create user',
          error: error.message,
        });
      }
    });
    app.post('/tasks', async (req, res) => {
      try {
        const task = req.body;
        console.log(task, '1');
        const result = await tasksCollection.insertOne(task);
        console.log(result);
        res.status(201).send({
          success: true,
          message: 'Task created successfully',
          data: result,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: 'Failed to create task',
          error: error.message,
        });
      }
    });
    app.get('/tasks', async (req, res) => {
      try {
        const result = await tasksCollection.find({}).toArray();
        res.status(200).send({
          success: true,
          message: 'Tasks fetched successfully',
          data: result,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: 'Failed to fetch tasks',
          error: error.message,
        });
      }
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
