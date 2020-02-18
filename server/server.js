const models = require("./models/index");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("../config/keys_choice.js").MONGO_URI;
const schema = require("./schema/schema");
const cors = require("cors");
const expressGraphQL = require("express-graphql");
const app = express();
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
};

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.use(bodyParser.json());

app.use(cors());

setInterval(() => {
  app.get('/', (req, res) => {
    return res.send('Hello');
    // return console.log("test");
  });
}, 1740000);

app.use(
  "/graphql",
  expressGraphQL(req => {
    return {
      schema,
      context: {
        token: req.headers.authorization
      },
      graphiql: true
    };
  })
);



module.exports = app;
