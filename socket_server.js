const express = require('express');
const http = require('http');
const webSocket = require('socket.io');
const app = express();
const server = http.Server(app);
const io = webSocket(server);
const PORT = process.env.PORT | 8080;
const users = require('./controller/users');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const chatroom = require('./controller/chatroom');
const messages = require('./controller/messages');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(passport.initialize());

//import socket modules
const chatroomSocket = require('./controller/chatroom_socket');

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

app.get('/room', (req,res, next) => {
  chatroom.getAllRooms()
    .then(data => {
      res.send(data);
    })
    .catch(err => console.log(err));
});

//this is request is to update chatrooms and add user.
app.put('/test', (req, res) => {
  //need to get id from db.
  //send the id as second argument to joinRoom;
  // console.log('line 52 socket_server' ,req.body)
  chatroom.addUser({username: 'poop', room_id: '5c750a51a98436ae995e800e'})
    .then(data => res.send(data))
    .catch(err => console.log('line 55 socket server', err))
});

app.get('/messages', (req, res) => {
  const { room_id } = req.query;
  messages.loadMessages(room_id)
  .then(data => {
    // console.log('line 63', data)
    res.send(data)
  })
  .catch(err => console.log(err));
})

//testing sockt server
  io.on('connection', (socket)=>{
    socket.on('joinRoom', (room_id) => {
      // console.log(room_id);
      console.log('joined on', room_id);
      socket.join(room_id);
      socket.emit('joined', 'youve entered the dungeon')
    })

    socket.on('leaveRoom', (room_id) => {
      // console.log('old room', room_id);
      socket.leave(room_id);
    })

    socket.on('message', (message) => {
    socket.to(message.room_id).emit('message', [message]);
    //need to send username and room_id from client
    messages.postMessage(message.room_id, message.message, message.username);

    })
  })


//loging in and registering
app.use('/', users);

//testing users and their chats
//gets the chats of users
app.get('/rooms', (req, res) => {
  const { user_id } = req.query;
  chatroom.findUserRooms(user_id)
    .then(data => {
      res.send(data);
    })
    .catch(err => console.log(err));
});

app.get('/createChat', (req, res) => {
  const { user_id } = req.query;
  chatroom.createChat({username: 'test', id: 'testing'})
    .then(data => {
      console.log(data)
      chatroom.addChatToUser(user_id, data)
        .then(data => console.log('line 98 ===============',data.chats))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
})


//testing with id of room provided by DB

// function sendMessage(message, socket, fromServer){
//   const testroom = io.of(`/${room}`);
//   // console.log(test);
//   var sender = fromServer ? io : socket.broadcast;
//   console.log(room);
//   // console.log(sender);
//   //sender has to be io.of
//   testroom.emit('message', [message.text]);
// }
//
// const stdin = process.openStdin();
// stdin.addListener('data', (d) => {
//   sendMessage({
//     text: d.toString().trim(),
//   }, null, true);
// })
