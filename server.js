const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport"); 
const app = express();

// load routes
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

//**********************************************
// 	 MIDDLEWARES start
//**********************************************

// body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

//**********************************************
// 	 MIDDLEWARES end
//**********************************************


// user routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});