const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, ROLES } = require('../models/user.model');
require('dotenv').config();


const usersController = {

  signUp: (req, res) => {
    // check parameters
    if (Object.keys(req.body).length > 4) return res.status(200).send({ message: 'too much parameters', isLoggedIn: false });
    const { email, username, password, role } = req.body;
    if (!email || !password || !username || !role) {
      return res.status(200).send({ message: 'missing parameters', isLoggedIn: false });
    }
    if (!ROLES.includes(role)) return res.status(200).send({ message: 'wrong role', isLoggedIn: false });

    // find user with email
    User.findAll({ where: { email: email } })
      .then((user) => {
        // check email found
        if (Object.keys(user).length) {
          console.log('Email already used');
          return res.status(200).send({ message: 'Email already used', isLoggedIn: false });
        }
        else {
          // find user with username
          User.findAll({ where: { username: username } })
            .then((user) => {
              // check username found
              if (Object.keys(user).length) {
                console.log('Username already exist');
                return res.status(200).send({ message: 'Username already exist', isLoggedIn: false });
              }
              else {
                // crypt password
                bcrypt.hash(password, 10, (err, hashPassword) => {
                  if (err) return res.status(200).send({ message: 'impossible to hash password', isLoggedIn: false });
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
                    return res.status(200).send({ accessToken: accesToken, isLoggedIn: true, username: username, user_id: id, role: role });
                  })
                    .catch((err) => {
                      console.log(err);
                      console.log('error on user creation');
                      return res.status(200).send({ message: 'impossible to add user', isLoggedIn: false });
                    });
                })
              }
            })
        }
      })
      .catch((err) => {
        console.log('error on find user');
        return res.status(200).send({ message: 'Loading user request error' })
      });
  },

  login: (req, res) => {
    // check paramaters errors
    if (Object.keys(req.body).length > 2) return res.status(200).send({ message: 'too much parameters', isLoggedIn: false });
    const { username, password } = req.body;
    console.log(req.body);
    if (!username || !password) return res.status(200).send({ message: 'missing parameters', isLoggedIn: false });

    // find user with username
    User.findAll({ where: { username: username } })
      .then((user) => {
        // check user found 
        if (Object.keys(user).length) {

          // check matching password
          bcrypt.compare(password, user[0].password, (err, isMatch) => {
            if (err) return res.status(200).send({ message: 'compare error', isLoggedIn: false });
            if (isMatch) {
              // create token
              const { username, password, role, id, money } = user[0];
              const payload = { username: username, password: password, role: role, id: id };
              const accesToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 86400 });
              return res.status(200).send({ accessToken: accesToken, isLoggedIn: true, username: username, user_id: id, role: role, money: money });
            }
            else return res.status(200).send({ message: 'wrong password', isLoggedIn: false });
          })
        } else return res.status(200).send({ message: 'user not found', isLoggedIn: false });
      })
      .catch((err) => {
        console.log('error on find user');
        console.log(err);
        return res.status(200).send({ 'error': 'error on finding user', isLoggedIn: false });
      })
  },

  update_user_details: (req, res) => {
    if (Object.keys(req.body).length > 4) return res.status(500).send({ message: 'too much parameters', success: false });
    const { username, role, id, money } = req.body;
    console.log(req.body);
    if (!username || !role || !id || !money) return res.status(500).send({ message: 'missing parameters', success: false });
    if (!ROLES.includes(role) && id !== 1) return res.send({ message: 'wrong role', success: false });

    // find user with username
    User.findAll({ where: { username: username, id: { [Op.ne]: id } } })
      .then((user) => {
        if (!Object.keys(user).length) {
          User.findAll({ where: { id: id } })
            .then((user) => {
              // check user found
              console.log(username !== user[0].dataValues.username);
              if (Object.keys(user).length) {
                User.update({ username, role, money }, { where: { id: id } })
                  .then((new_user) => {
                    if (new_user) {
                      // create token
                      const payload = { username: username, role: role, id: id };
                      const accesToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 86400 });
                      return res.status(200).send({ accessToken: accesToken, username: username, role: role, money: money, success: true });
                    } else return res.send({ message: 'no modifications done', success: false });
                  })
                  .catch((err) => {
                    console.log('error on user update: ', err);
                    return res.send({ message: 'error on user update', success: false });
                  })
              } else return res.status(200).send({ message: 'no user found', success: false });
            })
            .catch((err) => {
              console.log('error on find user');
              console.log(err);
              return res.send.status(501).send({ 'error': 'error on finding user', success: false });
            })
        } else return res.send({ message: 'Username already used', success: false });
      })
  },

  get_user_details: (req, res) => {
    console.log(req.body);
    if (Object.keys(req.body).length > 1) return res.status(200).send({ message: 'too much parameters', success: false });
    const { id } = req.body;
    if (!id) return res.status(200).send({ message: 'missing parameters', success: false });

    User.findAll({ where: { id: id } })
      .then((user) => {
        if (!Object.keys(user).length) return res.status(200).send({ message: 'No user found for this id' });
        const { username, role, money } = user[0].dataValues;
        return res.status(200).send({ username: username, role: role, money: money, success: true })
      })
      .catch((err) => {
        console.log('error on find user: ', err);
        return res.status(200).send({ message: 'error on find user', success: false });
      })
  }
}

module.exports = usersController;
