const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;


var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    console.log("myVideoStream")
    addVideoStream(myVideo, stream, "0");
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
      console.log("user VideoStream")
        addVideoStream(video, userVideoStream, "1");
      });
    });
    socket.on("user-connected", (userId) => {
      if(userId === "aaa");
      else connectToNewUser(userId, stream);
    });
    socket.on("user-disconnected", (userId) => {
      console.log("user disconnected");
      // if (peer[userId]) peers[userId].close();
      const video = document.getElementById(userId);
      video.remove();
    });
  });
const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
   console.log("user VideoStream 2")
    addVideoStream(video, userVideoStream, userId);
  });
};
peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});
const addVideoStream = (video, stream, userId) => {
   video.setAttribute("id", userId);
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};
