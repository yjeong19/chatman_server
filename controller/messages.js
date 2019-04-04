const express = require("express");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const db = require("../models");

module.exports = {
  postMessage: async (room_id, message, username) => {
    let returnData;
    console.log(room_id, message, username);
    await db.chatrooms
      .findByIdAndUpdate(
        ObjectId(room_id),
        {
          $push: {
            messages: [
              {
                user: username,
                message
              }
            ]
          }
        },
        { new: true }
      )
      .then(data => {
        console.log(data);
        returnData = data;
      })
      .catch(err => {
        console.log(err);
      });
    return returnData;
  },

  loadMessages: async room_id => {
    let returnData;
    await db.chatrooms
      .findById(ObjectId(room_id))
      .then(data => {
        returnData = data;
      })
      .catch(err => console.log(err));
    return returnData;
  }
};

