# Task Management Application - Backend

## Description

This is the backend service for the Task Management Application. It provides RESTful API endpoints for managing user authentication and task operations, including creating, updating, deleting, and fetching tasks. The backend is built using Node.js, Express.js, and MongoDB.

## Live API Link

[https://drag-drop-server-amber.vercel.app/]

## Technologies Used

- Node.js
- Express.js
- MongoDB

## Dependencies

```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "mongodb": "^6.13.0",
    "nodemon": "^3.1.9"
  }
}
```

## Installation and Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Steps to Run Locally

1. Clone the repository:

   ```sh
   git clone https://github.com/tapader13/task-manegment-backend
   cd backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:

   ```env
   PORT=5001
   DB_URI=your_mongodb_connection_string
   ```

4. Start the server:

   ```sh
   npm start
   ```

## API Endpoints

### User Authentication

- `POST /users` - Creates a new user or logs in an existing user.

### Task Management

- `POST /tasks` - Adds a new task.
- `GET /tasks` - Retrieves all tasks.
- `PUT /tasks` - Updates multiple tasks for reordering.
- `PUT /tasks/:id` - Updates a specific task.
- `DELETE /tasks/:id` - Deletes a task.

## Deployment

To deploy the backend, use a cloud service like Vercel.