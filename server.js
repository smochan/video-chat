const express = require("express");
const app = express();
const server = require("http").Server(app);

const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});


io.on("connection", (socket) => {
   // console.log("user connected --");
   const roomId = socket.handshake.query.roomId;
   const userId = socket.handshake.query.userId;
  socket.on("join-room", (roomId, userId) => {

    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });
  socket.on("disconnect", () => {
   //  socket.join(roomId);
    socket.to(roomId).emit("user-disconnected", userId);
   console.log("user disconnected");
  });
});

// io.on("disconnection", (socket) => {
//    socket.to(roomId).emit("user-disconnected", userId);
//    // socket.to(roomId).emit("user-disconnected", userId);
// });


server.listen(3000, () => {
   console.log("Server is running on port 3000");
});
