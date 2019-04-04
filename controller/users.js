const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

//validation
const validateRegisterInput = require("../validator/register");
const validateLoginInput = require("../validator/login");

//register users
router.post("/register", (req, res) => {
  const { errors, isValid, passMatch } = validateRegisterInput(req.body);
  const { username, password } = req.body;
  //if its not valid return status 400
  if (!isValid || passMatch === false) {
    return res.status(400).json(errors);
  }
  db.users.findOne({ username }).then(user => {
    if (user) {
      //return username is taken
      return res.status(400).json({
        username: "username is taken"
      });
    } else {
      const newUser = new db.users({
        username,
        password
      });

      //salt and hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(userInfo => {
              const payload = { id: userInfo.id, username: userInfo.username };
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token,
                    payload
                  });
                }
              );
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  // console.log(req);
  const { username, password } = req.body;
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  db.users.findOne({ username }).then(user => {
    if (!user) {
      return res.status(404).json({ username: "the user does not exist" });
    }
    console.log("line 72: ", password, user.password);
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, username: user.username };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              payload
            });
          }
        );
      } else {
        return res.status(404).json({
          password: "incorrect password"
        });
      }
    });
  });
});

//creates loggin in route;
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username
    });
  }
);

module.exports = router;
