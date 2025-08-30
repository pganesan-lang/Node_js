const express = require("express");
const routes = express.Router();

const {
  getAllExercises,
  addExercises,
  getUserLogs,
} = require("../controller/exerciseController");
const {
  getUserByNameOrId,
  addUser,
  getAllUser,
} = require("../controller/userController");

// add user
routes.post("/", addUser);

// get All user
routes.get("/", getAllUser);

// add exercise
routes.post("/:id/exercises", addExercises);

// Get All exercise
routes.get("/exercises", getAllExercises);

// Get user by name
routes.get("/:name", getUserByNameOrId);

// get user logs
routes.get("/:id/logs", getUserLogs);

module.exports = routes;
