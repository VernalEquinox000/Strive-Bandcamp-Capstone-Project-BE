const express = require("express");
const cors = require("cors");
const listEndPoints = require("express-list-endpoints");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const oauth = require("./middleware/oauth");
const passport = require("passport");
const cookieParser = require("cookie-parser");

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

const whitelist = [`${process.env.FE_URL}`];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

server.use(cors(corsOptions));
server.use(express.json());
server.use(cookieParser());
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
