const db = require('../models');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  createChat: async function(payload){
    const { username, id, currentUser, current_id } = payload
    console.log('line 7========', payload);
    let data;
    //check if username exists;

    await db.chatrooms.create({
      owner: {
        username: currentUser,
        id: current_id,
      },
      users: [
        { 
          username,
          id
        },
        {
          username: currentUser,
          id: current_id,
        }
      ]
    })
      .then(resp => {
      data = resp;
      })
      .catch(err => console.log(err))
      return data;
  },
  getAllRooms: async function(payload){
    let data;
    await db.chatrooms.find()
      .then(resp => {
        data = resp
      })
      .catch(err => console.log(err));
    return data;
  },

  findUserRooms: async function(user_id){
    let data; 
    await db.users.findById(ObjectId(user_id))
      .then(resp => {
        data = resp
      })
      .catch(err => console.log(err));
    return data;
  },

  addChatToUser: async function(user_id, payload, user_id2){
    let data;
    const ids = [user_id, user_id2];

    ids.forEach((user, i) => {
      db.users.findByIdAndUpdate(ObjectId(user), {
        $push: {
          chats: [{
            room_id: payload._id,
            users: payload.users
          }]
        }
      }, {new: true})
        .then(resp => data = resp)
        .catch(err => console.log(err));
    })
    return data;
  },

  findUser: async function (username){
    let data; 
    await db.users.findOne({username})
      .then(user => {
        if(!user){
        data = 'No user with that username';
        }
        data = user;
      })
      .catch(err => console.log(err));
      return data;
  },
}
