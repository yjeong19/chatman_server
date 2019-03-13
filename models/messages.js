const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const users = require('./users').schema;

const messageSchema = new Schema({
  user: [{
    type: Schema.Types.Object,
    ref: users,
  }],
  message: String,
});

module.exports = mongoose.model('messages', messageSchema);
