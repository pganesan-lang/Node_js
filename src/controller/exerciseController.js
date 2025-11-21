const userObject = require("../model/UserModal");
const exerciseObject = require("../model/ExerciseModal");
const { getUserById } = require("./userController");
const {
  validateDuration,
  validateDate,
  validateId,
  validateDateRange,
} = require("../utils/validation");

const addExercises = async (req, res) => {
  const { description, duration, date } = req.body;
  const { id } = req.params;

  // Validate ID
  const idValidation = validateId(id);
  if (!idValidation.isValid) {
    return res.status(400).json({ error: idValidation.error });
  }

  // Validate duration
  const durationValidation = validateDuration(duration);
  if (!durationValidation.isValid) {
    return res.status(400).json({ error: durationValidation.error });
  }

  // Validate date
  const dateValidation = validateDate(date);
  if (!dateValidation.isValid) {
    return res.status(400).json({ error: dateValidation.error });
  }

  const parsedDuration = durationValidation?.value;
  const exerciseDate = dateValidation?.value;

  try {
    const user = await userObject.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const createExercise = new exerciseObject({
      userId: idValidation?.value,
      description,
      duration: parsedDuration,
      date: exerciseDate,
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
    const { from, to, limit } = req.query;

    // Validate ID
    const idValidation = validateId(id);
    if (!idValidation.isValid) {
      return res.status(400).json({ error: idValidation.error });
    }

    const user = await getUserById(id);
    if (user === "Invaild User" || !user) {
      return res.status(400).json({ error: "Invaild User" });
    }

    // Validate date range
    const dateRangeValidation = validateDateRange(from, to);
    if (!dateRangeValidation.isValid) {
      return res.status(400).json({ error: dateRangeValidation.error });
    }

    let query = { userId: id };
    let dateFilter = {};

    if (dateRangeValidation.from) {
      dateFilter.$gte = dateRangeValidation.from;
    }
    if (dateRangeValidation.to) {
      dateFilter.$lte = dateRangeValidation.to;
    }

    if (dateRangeValidation.from || dateRangeValidation.to) {
      query.date = dateFilter;
    }

    const count = await exerciseObject.countDocuments(query);
    let logsQuery = exerciseObject.find(query).sort({ date: 1 });
    if (limit) logsQuery = logsQuery.limit(Number(limit));
    const logs = await logsQuery.exec();
    const result = {
      userId: id,
      name: user?.username,
      count,
      logs: logs.map((item) => ({
        description: item.description,
        duration: item.duration,
        date: item.date ? item.date.toDateString() : undefined,
      })),
    };
    res.status(200).json(result);
  } catch {
    res.status(400).json("Something went wrong, try again later");
  }
};
module.exports = {
  addExercises,
  getAllExercises,
  getUserLogs,
};
