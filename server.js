const express = require("express");
const mongoose = require("mongoose");
const app = express();


// DB config
const db = require("./config/keys").mongoURI;

// connect to mongodb/mlab
mongoose.connect(db)
  .then(() => {
    console.log("mongodb/mlab connected")
  })
  .catch(err => console.log("Error connecting mongodb/mlab:", err));

app.get("/", (req, res) => {
  res.send("Home page!!!!");
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});