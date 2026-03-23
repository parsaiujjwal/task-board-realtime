const express = require("express");
const controller = require("../controllers/taskController");

module.exports = (io) => {
  const router = express.Router();

  router.get("/", controller.getTasks);
  router.post("/", controller.createTask(io));
  router.put("/:id", controller.updateTask(io));
  router.delete("/:id", controller.deleteTask(io));

  return router;
};