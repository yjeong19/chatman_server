const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = mongoose.Types.ObjectId;
const chatrooms = require('./chatroom').schema;

const userSchema = new Schema ({
  username: {
    // id: ObjectId,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  chats: [{
    type: Schema.Types.Object,
    ref: chatrooms,
  }],
});

module.exports = mongoose.model('users', userSchema);
