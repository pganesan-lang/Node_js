const mongoose = require("mongoose");
const userObject = require("../model/UserModal");

const getUserByNameOrId = async (req, res) => {
  const name = req?.params?.name;

  let user;
  if (mongoose.Types.ObjectId.isValid(name)) {
    user = await userObject.findById(name);
  } else {
    user = await userObject.findOne({ username: name });
  }
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
};

const getUserById = async (data) => {
  let user;
  try {
    if (mongoose.Types.ObjectId.isValid(data)) {
      user = await userObject.findById(data);
    }
  } catch (e) {
    throw e.message;
  }

  return user;
};

const addUser = async (req, res) => {
  const { username } = req.body;

  try {
    const addUser = new userObject({ username });
    await addUser.save();
    res.status(201).json(addUser);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const getAllUser = async (req, res) => {
  try {
    const allUsers = await userObject.find().select("username _id");
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(400).json("Someting went Wrong try again later");
  }
};

module.exports = {
  getUserByNameOrId,
  addUser,
  getAllUser,
  getUserById,
};
