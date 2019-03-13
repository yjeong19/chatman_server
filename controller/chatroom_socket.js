const db = require('../models');
const ObjectId = require('mongoose').Types.ObjectId;


module.exports = {
  newRoom: function(io, room_id){
    chatRoom(io, room_id)
  },

  joinRoom: (io, room_id, username) => {
    //create db stuff here... or get rid of all options
    //just use one join room;
    chatRoom(io, room_id);
  },
}

//function to access socket from whatever room;
function chatRoom(io, room){
  console.log('room id', room)
  const chatRoom = io.of(`/${room}`)
  chatRoom.on('connection', (socket)=>{
    console.log(`joined on ${room}`)
    socket.on('message', (message) => {
      console.log(message);
      socket.broadcast.emit('message', [message])
    })
  })
}

// function _sendMessage(message, socket, fromServer){
//   var sender = fromServer ? io : socket.broadcast;
//   testroom.emit('message', [message]);
// };
