const express = require("express");
const app = express();
require("dotenv").config();
const expressJwt = require("express-jwt");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

// Configure body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Make the app use the express-jwt authentication middleware on anything starting with "/api"
app.use("/api", expressJwt({ secret: process.env.SECRET }));

// Add routes
app.use("/auth", require("./routes/auth"));

// Add `/api` before your /todo requires request to go through
// the express-jwt middleware before it accesses those routes
// this way we can reference the "currently
// logged-in user" in our todo routes.
app.use("/api/todo", require("./routes/todo"));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "UnauthorizedError") {
    // express-jwt gives the 401 status to the err object for us
    res.status(err.status);
  }
  return res.send({ message: err.message });
});

// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/react-passport-example",
  {
    useCreateIndex: true,
    useNewUrlParser: true
  }
);

// Start the API server
app.listen(PORT, () =>
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`)
);
