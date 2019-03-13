const mongoose = require('mongoose');
const keys = require('../config/keys');
mongoose.connect(keys.mongoURI, {useNewUrlParser: true});
mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = Promise;

module.exports.users = require('./users');
module.exports.messages = require('./messages');
module.exports.chatrooms = require('./chatroom');
