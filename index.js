const config = require('./app/config');
const express = require("express");
const session = require("express-session");
const { json } = require("express");
const http = require("http");
const path = require("path");
const async = require("async");
const MongoClient = require("mongodb").MongoClient;

const port = 3000;

/*
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
*/

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Admin session setting ==> Config
app.use(
  session({
    secret: "hellop",
    resave: true,
    saveUninitialized: true,
  })
);

const requestHandler = (req, res) => {
  res.end("Hello Node.js Server!");
};

const server = http.createServer(requestHandler);

module.exports = app;

app.locals.basedir = path.join(__dirname, "views");
app.set("view engine", "pug");

var routes = require('./app/routes');
app.use('/',routes);


app.use(express.static("public"));

app.listen(port, function () {
  console.log("Example app listening on port:", port);
});
