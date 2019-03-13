const express = require('express');
const router = express.Router();
const app = express();
const db = require('../models');
const ObjectId = require('mongoose').Types.ObjectId;
//find userby username
//returns user
function getUser(username){
  db.users.find(username)
  .then(res => {
    console.log(res);
    return (res)
  })
  .catch(err => console.log(err))
}

//create chat room
router.post('/room', async function(req, res){
  const { username, id } = req.body;
  //need validation to check if user exists;
  //when creating, insert the current user
  console.log(req.body);

  //need function to add current user when creating chatroom
  db.chatrooms.create({
    owner: {
      username,
      id,
    },
  })
  .then(resp => {
    console.log(resp)
    chatRoom(io, resp._id);
    res.json(resp);
  })
  .catch(err => console.log(err));
});

//adding users to chatroom
router.put('/adduser', (req, res) => {
  const { username, room_id } = req.body;

  const user = getUser({ username });
  console.log(user);
  //adding user works, just need to find a way to find the users
  db.chatrooms.findByIdAndUpdate(ObjectId(room_id), {
    $push : {
      users: [{
        user
      }]
    }
  }, {new : true})
  .then(data => {
    console.log(data);
    res.send(data);
  })
  .catch(err => {console.log(err)})
});

//function to access socket from whatever room;
async function chatRoom(io, room){
  console.log('room id', room)
  const chatRoom = await io.of(`/${room}`)
  chatRoom.on('connection', (socket)=>{
    console.log(`joined on ${room}`)
    socket.on('message', (message) => {
      console.log(message)
    })
  })
}

module.exports = router;
