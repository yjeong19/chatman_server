require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const users = require('./controller/users');
const chatroom = require('./controller/chatroom');
const messages = require('./controller/messages');
const PORT = process.env.PORT | 8000;
const passport = require('passport');
require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(passport.initialize());

app.use('/', users);
app.use('/', chatroom);
app.use('/', messages);
app.get('/test', (req, res) => {
  console.log('call from client');
  res.send('hello');
})

app.listen(PORT, ()=> {
  console.log(`app listening on ${PORT}`)
});
