const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
var voiceRouter = require("./voiceRouter");
const uploadRouter = require('./uploadRouter');
var mongoose = require('mongoose');
mongoose
  .connect('mongodb://127.0.0.1:27017/mydatabase')
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use('/public', express.static('public'));
app.use('/uploadRouter', uploadRouter)
app.use("/voiceRouter", voiceRouter);

app.use((req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
      next(new Error('Something went wrong'));
  });
});
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

app.listen(process.env.PORT || 8080, function(){
  console.log("Server is running.");
})
