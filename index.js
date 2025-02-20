require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const findTasks = await tasksCollection.find({}).toArray();

        const result = await tasksCollection.insertOne({
          ...task,
          orderid: findTasks.length + 1,
          id: findTasks.length + 1,
        });
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
        const result = await tasksCollection
          .find({})
          .sort({ orderid: 1 })
          .toArray();
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
    app.put('/tasks', async (req, res) => {
      try {
        const tasks = req.body;
        console.log('Received updated tasks:', tasks);

        if (!Array.isArray(tasks)) {
          return res
            .status(400)
            .json({ success: false, message: 'Invalid data format' });
        }

        // Perform bulk update in MongoDB (if using Mongoose)
        const bulkOps = tasks.map((task) => ({
          updateOne: {
            filter: { _id: new ObjectId(task._id) }, // Find the task by its ID
            update: {
              $set: {
                columnId: task.columnId,
                orderid: task.orderid,
                category:
                  task.columnId === '3'
                    ? 'Done'
                    : task.columnId === '2'
                    ? 'In progress'
                    : 'To do',
              },
            }, // Update fields
          },
        }));

        await tasksCollection.bulkWrite(bulkOps);

        res
          .status(200)
          .json({ success: true, message: 'Tasks updated successfully!' });
      } catch (error) {
        console.error('Error updating tasks:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to update tasks',
          error: error.message,
        });
      }
    });

    app.put('/tasks/:id', async (req, res) => {
      const { id } = req.params;
      const { category, order } = req.body;
      console.log(category, 'category');
      console.log(order, 'order');
      //   console.log(category, order, 'category, order');
      try {
        const task = await tasksCollection.findByIdAndUpdate(
          id,
          { category, order },
          { new: true }
        );
        res.status(200).json({ success: true, data: task });
      } catch (err) {
        res
          .status(500)
          .json({ success: false, message: 'Failed to update task' });
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
