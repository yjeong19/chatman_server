const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const db = require('../models');

module.exports = {
  postMessage: async (room_id, message, username) => {
    let returnData;

    await db.chatrooms.findByIdAndUpdate(ObjectId(room_id, username, message), {
      $push: {
        messages: [{
          user: username,
          message
        }]
      }
    }, {new: true})
    .then(data => {
      returnData = data;
    })
    .catch(err => {
      console.log(err);
    })
    return returnData;
  },

  loadMessages: async (room_id) => {
    let returnData;
    await db.chatrooms.findById(ObjectId(room_id))
    .then(data =>{
      returnData = data
    })
    .catch(err => console.log(err));
    return returnData;
  },
}



// router.put('/messages', (req, res) => {
//   const { message, room_id, username } = req.body;
//   console.log(room_id, message, username)

//   db.chatrooms.findByIdAndUpdate(ObjectId(room_id, username, message), {
//     $push: {
//       messages: [{
//         user: username,
//         message
//       }]
//     }
//   }, {new: true})
//   .then(data => {
//     console.log(data);
//     res.send(data);
//   })
//   .catch(err => {
//     console.log(err);
//     res.send(err);
//   })
// });

// router.get('/messages', (req, res) => {
//   const { room_id } = req.query;
//   db.chatrooms.findById(ObjectId(room_id))
//     .then(data =>{
//       console.log(data);
//       res.send(data)
//     })
//     .catch(err => console.log(err));
// })

// module.exports = router;
