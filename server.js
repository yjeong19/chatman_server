const express = require("express");
const http = require("http");
const webSocket = require("socket.io");
const app = express();
const server = http.Server(app);
const io = webSocket(server);
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const users = require("./controller/users");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const chatroom = require("./controller/chatroom");
const messages = require("./controller/messages");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

app.get("/room", (req, res, next) => {
  chatroom
    .getAllRooms()
    .then(data => {
      res.send(data);
    })
    .catch(err => console.log(err));
});

app.get("/messages", (req, res) => {
  const { room_id } = req.query;
  messages
    .loadMessages(room_id)
    .then(data => {
      // console.log('line 63', data)
      res.send(data);
    })
    .catch(err => console.log(err));
});

//testing sockt server
io.on("connection", socket => {
  socket.on("chatList", username => {
    socket.join(username);
    console.log("user joined on dash", username);
  });

  socket.on("newChat", room => {
    // console.log(room, '--------===================-------------------');
    // socket.emit('newChat', room)
    socket.to(room.users[0].username).emit("newChat", room);
  });

  socket.on("joinRoom", room_id => {
    // console.log(room_id);
    console.log("joined on", room_id);
    socket.join(room_id);
    socket.emit("joined", "youve entered the dungeon");
  });

  socket.on("leaveRoom", room_id => {
    // console.log('old room', room_id);
    socket.leave(room_id);
  });

  socket.on("message", message => {
    socket.to(message.room_id).emit("message", [message]);
    //need to send username and room_id from client
    messages.postMessage(message.room_id, message.message, message.username);
  });
});

//loging in and registering
app.use("/", users);

//testing users and their chats
//gets the chats of users
app.get("/rooms", (req, res) => {
  const { user_id } = req.query;
  chatroom
    .findUserRooms(user_id)
    .then(data => {
      res.send(data);
    })
    .catch(err => console.log(err));
});

app.get("/createChat", (req, res) => {
  const { username, currentUser, current_id } = req.query;
  //user_id == the id creating the chat,
  //username == the username of person being added to chat

  //addusertochat checks if user exists;
  chatroom
    .findUser(username)
    .then(data => {
      //if user exists, create chatroom
      if (data !== null) {
        chatroom
          .createChat({
            username: data.username,
            id: data._id.toString(),
            currentUser,
            current_id
          })
          .then(chatData => {
            console.log("line 121", chatData._id);
            //using the response from creating chatroom, push to userID == need to push to both??
            chatroom.addChatToUser(current_id, chatData, data._id);
            res.json(chatData);
          })
          .catch(err => console.log(err));
      } else {
        console.log("no user");
        res.json("no user");
      }
    })
    .catch(err => console.log(err));
});
