const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, ROLES } = require('../models/user.model');
require('dotenv').config();


const usersController = {

  signUp: (req, res) => {
    // check parameters
    if (Object.keys(req.body).length > 4) return res.status(500).send({ message: 'too much parameters' });
    const { email, username, password, role } = req.body;
    if (!email || !password || !username || !role) {
      return res.send({ message: 'missing parameters' });
    }

    // find user with email
    User.findAll({ where: { email: email } })
      .then((user) => {
        // check email found
        if (Object.keys(user).length) {
          console.log('Email already used');
          return res.status(409).send({ message: 'Email already used' });
        }
        else {
          // find user with username
          User.findAll({ where: { username: username } })
            .then((user) => {
              // check username found
              if (Object.keys(user).length) {
                console.log('Username already exist');
                return res.status(409).send({ message: 'Username already exist' });
              }
              else {
                // crypt password
                bcrypt.hash(password, 10, (err, hashPassword) => {
                  if (err) return res.status(500).send({ message: 'impossible to hash password' });
                  if (!ROLES.includes(role)) return res.status(500).send({ message: 'wrong role' });
                  // create user
                  User.create({
                    email,
                    username,
                    password: hashPassword,
                    role: role
                  }).then((item) => {
                    console.log('user added');
                    const { id, username, password, role } = item.dataValues;
                    const payload = { username: username, password: password, role: role, id: id };
                    const accesToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 86400 });
                    return res.send({ accessToken: accesToken, isLoggedIn: true, username: username, user_id: id, role: role });
                  })
                    .catch((err) => {
                      console.log(err);
                      console.log('error on user creation');
                      return res.status(500).send({ message: 'impossible to add user' });
                    });
                })
              }
            })
        }
      })
      .catch((err) => {
        console.log('error on find user');
        return res.status(500).send({ message: 'Loading user request error' })
      });
  },

  login: (req, res) => {
    // check paramaters errors
    if (Object.keys(req.body).length > 2) return res.status(500).send({ message: 'too much parameters', isLoggedIn: false });
    const { username, password } = req.body;
    console.log(req.body);
    if (!username || !password) return res.status(500).send({ message: 'missing parameters', isLoggedIn: false });

    // find user with username
    User.findAll({ where: { username: username } })
      .then((user) => {
        // check user found 
        if (Object.keys(user).length) {

          // check matching password
          bcrypt.compare(password, user[0].password, (err, isMatch) => {
            if (err) return res.send({ message: 'compare error', isLoggedIn: false });
            if (isMatch) {
              // create token
              const { username, password, role, id } = user[0];
              const payload = { username: username, password: password, role: role, id: id };
              const accesToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 86400 });
              return res.send({ accessToken: accesToken, isLoggedIn: true, username: username, user_id: id, role: role });
            }
            else return res.send({ message: 'wrong password', isLoggedIn: false });
          })
        } else return res.send({ message: 'user not found', isLoggedIn: false });
      })
      .catch((err) => {
        console.log('error on find user');
        console.log(err);
        return res.send.status(501).send({ 'error': 'error on finding user', isLoggedIn: false });
      })
  }
}

module.exports = usersController;
