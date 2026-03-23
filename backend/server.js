const express = require("express");
const http = require("http");
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const taskRoutes = require("./routes/taskRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI , {
  
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/tasks", taskRoutes(io));

io.on("connection", (socket) => {
  console.log("User connected");
});

server.listen(5000, () => console.log("Server running on 5000"));