const express = require("express");
const mongoose = require("mongoose");
const app = express();

// load routes]
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");


// DB config
const db = require("./config/keys").mongoURI;

// connect to mongodb/mlab
mongoose.connect(db)
  .then(() => {
    console.log("mongodb/mlab connected")
  })
  .catch(err => console.log("Error connecting mongodb/mlab:", err));

// home/index route
app.get("/", (req, res) => {
  res.send("Home page!!!!");
});

// user routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});