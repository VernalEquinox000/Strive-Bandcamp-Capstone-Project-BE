const express = require("express");
const cors = require("cors");
const listEndPoints = require("express-list-endpoints");
const mongoose = require("mongoose");

//routes here

//ERROR HANDLERS
const {} = require("./errorHandlers");

const server = express();

const port = process.env.PORT || 3001;
server.use(cors());
server.use(express.json());

//ERROR HANDLERS MIDDLEWARES HERE

console.log(listEndPoints(server));
mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    httpServer.listen(port, () => {
      console.log("Running on port, port");
    })
  )
  .catch((err) => console.log(err));
