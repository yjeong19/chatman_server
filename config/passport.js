const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/users');
const keys = require('./keys');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(new JwtStrategy(options, (payload, done) => {
    //payload incudes the items specified ealier
    User.findById(payload.id)
    .then(user => {
      if(user){
        return done(null, user);
      }

      return done(null, false);
    })
    .catch(err => {
      console.log(err);
    })
  }))
}
