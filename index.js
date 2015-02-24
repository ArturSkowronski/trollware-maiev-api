"use strict";

var express = require("express");
var http = require("http");
var path = require("path");
var winston = require("winston");
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: "debug" })
  ]
});

var app = express();
var server = http.createServer(app);

var io = require("./src/modules/connection");
var game = require("./src/modules/game");

game.init(io.initialize(server));

app.set("port", (process.env.PORT || 5000));
app.use("/public", express.static(path.join(__dirname, "/public")));

app.get("/", function (req, res) {res.sendFile(path.join(__dirname, "/views/index.html"));});
app.get("/socket-local", function (req, res) {res.sendFile(path.join(__dirname, "/views/socket-local.html"));});
app.get("/socket-server", function (req, res) {res.sendFile(path.join(__dirname, "/views/socket-server.html"));});
app.get("/debug", function (req, res) {res.send(JSON.stringify(game.debug()));});

server.listen(app.get("port"), function() {log.debug("Node app is running at localhost: %s", app.get("port"));});


