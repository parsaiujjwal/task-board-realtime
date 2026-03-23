# Real-Time Task Board App

A full-stack task management application with real-time updates. Users can create, update, delete, and move tasks across different stages using drag and drop functionality.

## Features

* Create, edit, and delete tasks
* Drag and drop tasks (Todo, In Progress, Done)
* Real-time updates using Socket.io
* Search tasks by title (debounced)
* Filter tasks by status
* Conflict handling using updated timestamps
* REST API integration

## Tech Stack

### Frontend

* React
* Axios
* React Beautiful DnD
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB with Mongoose
* Socket.io

## Project Structure

```
project-root/

backend/
  controllers/
  models/
  routes/
  middleware/
  index.js

frontend/
  components/
  pages/
  services/
  App.jsx
```

## Installation and Setup

### Clone the repository

```
git clone https://github.com/parsaiujjwal/task-board-realtime.git
cd task-board-realtime
```

### Backend setup

```
cd backend
npm install
```

Create a .env file:

```
PORT=5000
MONGO_URI=mongodb+srv://abhay:abhayabhay@cluster0.6itwk6b.mongodb.net/task_board_TODO
```

Run backend:

```
node index.js
```

### Frontend setup

```
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint       | Description   |
| ------ | -------------- | ------------- |
| GET    | /api/tasks     | Get all tasks |
| POST   | /api/tasks     | Create task   |
| PUT    | /api/tasks/:id | Update task   |
| DELETE | /api/tasks/:id | Delete task   |

## Real-Time Events

* taskCreated
* taskUpdated
* taskDeleted


## Author

Ujjwal Parsai
