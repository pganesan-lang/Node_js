const mongoose = require("mongoose");
const userObject = require("../model/UserModal");
const exerciseObject = require("../model/ExerciseModal");
const { getUserById } = require("./userController");

const addExercises = async (req, res) => {
  const { description, duration, date } = req.body;
  const { id } = req.params;

  // Validate user id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  try {
    const user = await userObject.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const createExercise = new exerciseObject({
      userId: id, // id is a valid ObjectId string
      description,
      duration,
      date,
    });
    await createExercise.save();
    res.status(201).json(createExercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllExercises = async (req, res) => {
  try {
    const allExercises = await exerciseObject.find();
    res.status(200).json(allExercises);
  } catch (err) {
    res.status(400).json("Someting went Wrong try again later");
  }
};

const getUserLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    const { from, to, limit } = req.query;

    let query = {
      userId: id,
    };

    let dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);
    if (from || to) query.date = dateFilter;

    let exercise = await exerciseObject.find(query);

    if (limit) exercise = exercise.slice(0, limit);

    const result = {
      userId: id,
      name: user?.username,
      logs: exercise?.map((item) => ({
        description: item.description,
        duration: item.duration,
        date: item.date ? item.date.toDateString() : undefined,
      })),
    };

    res.status(200).json(result);
  } catch {
    res.status(400).json("Someting went Wrong try again later");
  }
};

module.exports = {
  addExercises,
  getAllExercises,
  getUserLogs,
};
