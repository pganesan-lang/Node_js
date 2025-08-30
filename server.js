const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const userRoutes = require("./src/routes/UserRoutes");

const connectDB = require("./src/config/dp");
connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/src", "views", "index.html"));
});

console.log(__dirname);

const listener = app.listen(process.env.PORT || 5000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
