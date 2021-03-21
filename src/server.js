const express = require("express");
const cors = require("cors");
const listEndPoints = require("express-list-endpoints");
const mongoose = require("mongoose");
const passport = require("passport");

const userRoutes = require("./routes/userRoutes");
const oauth = require("./middleware/oauth");

//routes here

//ERROR HANDLERS
const {
  badRequestHandler,
  unauthorizedHandler,
  forbiddenHandler,
  notFoundHandler,
  genericErrorHandler,
} = require("./errorHandlers");

const server = express();

const port = process.env.PORT || 3001;
server.use(cors());
server.use(express.json());
server.use(passport.initialize());

userRoutes(server); //user

//ERROR HANDLERS MIDDLEWARES
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndPoints(server));
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port);
    })
  )
  .catch((err) => console.log(err));
