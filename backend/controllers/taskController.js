const Task = require("../models/Task");

// get all tasks
exports.getTasks = async (req, res) => {
  try {
    const taskList = await Task.find().sort({ createdAt: -1 });
    res.json(taskList);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// create task
exports.createTask = (io) => async (req, res) => {
  try {
    if (!req.body.title || req.body.title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }
    const newTask = await Task.create({
      ...req.body,
      userId: req.user.id
    });

    io.emit("new-task-added", newTask);

    res.json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
};

// update task (with conflict handling)
exports.updateTask = (io) => async (req, res) => {
  try {
    const taskId = req.params.id;
    const incomingData = req.body;

    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const incomingTime = new Date(incomingData.updatedAt);
    const currentTime = new Date(existingTask.updatedAt);

    if (incomingTime > currentTime) {
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        incomingData,
        { new: true }
      );

      io.emit("task-updated", updatedTask);

      return res.json(updatedTask);
    } else {
      return res.json(existingTask);
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
};

// delete task
exports.deleteTask = (io) => async (req, res) => {
  try {
    const taskId = req.params.id;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    io.emit("task-removed", taskId);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
};