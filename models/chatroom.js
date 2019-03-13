const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messages = require('./messages').schema;
const users = require('./users').schema;

const chatroomSchema = new Schema({
  owner: {
    username: String,
    id: String,
  },
  users: [{
    type: Schema.Types.Object,
    ref: users,
  }],
  messages: [messages],
});

module.exports = mongoose.model('chatrooms', chatroomSchema);
