const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const saltRounds = 10;

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/register", function(req, res, next) {
  const { username, password } = req.body;

  bcrypt.hash(password, saltRounds).then(hash => {
    const user = new User({
      username,
      password: hash
    });

    const promise = user.save();

    promise
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.send(err);
      });
  });
});

router.post("/authenticate", function(req, res, next) {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) {
      throw err;
    }

    if (!user) {
      res.json({
        status: false,
        message: "user : Authentication failed, user not found."
      });
    } else {
      bcrypt.compare(password, user.password).then(result => {
        if (!result) {
          res.json({
            status: false,
            message: "password: Authentication failed, user not found."
          });
        } else {
          const payload = {
            username
          };

          const token = jwt.sign(
            payload, 
            req.app.get("api_secret_key"),
            {
            //expiresIn: 720 // 720 dk = 60*12 = 12 saat
            expiresIn: '365d' // expires in 365 days
            //expiresIn: '24h' // expires in 24 hours
            }
          );
          res.json({
            status: true,
            token
          });
        }
      });
    }
  });
});

module.exports = router;

// jsonwebtoken
// https://jwt.io

// npm install bcrypt --save

// npm install -g node-gyp

//npm install jsonwebtoken --save
