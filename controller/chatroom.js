const db = require('../models');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  createChat: async function(payload){
    const { username, id } = payload
    let data;
    await db.chatrooms.create({
      owner: {
        username,
        id,
      },
      users: [{
        username,
        id
      }]
    })
      .then(resp => {
      data = resp;
      })
      .catch(err => console.log(err))
    return data;
  },

  addUser: async function(payload){
    const { username, room_id } = payload;
    //need user_id instead of room_id;
    //push user_id with username in the update;
    let data;
    await db.chatrooms.findByIdAndUpdate(ObjectId(room_id), {
      $push : {
        users: [{
          // user
          username,
        }],
      }
    }, {new : true})
    .then(res => {
      data = res
    })
    .catch(err => {console.log(err)})
      return data
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

  addChatToUser: async function(user_id, payload){
    console.log(user_id)
    let data;
    await db.users.findByIdAndUpdate(ObjectId(user_id), {
      $push: {
        chats: [{
          room_id: payload._id,
          users: payload.users
        }]
      }
    }, {new: true})
      .then(resp => {console.log(resp); data = resp})
      .catch(err => console.log(err));
    return data;
  },


}
