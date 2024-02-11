/**
 * npm i express [require]
 * npm i ejs
 * npm i socket.io [require]
 */

//#region Requires
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 7004;

//#region MiddleWare
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/assets"));
//#endregion

app.get("/", (req, res) => {
  res.render("main.ejs");
});
const server = app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
//#endregion

//#region Socket
let socketsConnected = new Set();

const io = require("socket.io")(server);
io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  socketsConnected.add(socket.id);

  io.emit("clients-total", socketsConnected.size);

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
    socketsConnected.delete(socket.id);
    io.emit("clients-total", socketsConnected.size);
  });

  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
//#endregion
