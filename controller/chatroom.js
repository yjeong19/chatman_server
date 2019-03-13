const db = require('../models');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  getId: async function(payload){
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



}
