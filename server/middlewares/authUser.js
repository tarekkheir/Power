const jwt = require('jsonwebtoken');
require('dotenv').config();


const authUser = (req, res, next) => {
  console.log(req.headers);
  const authHeaders = req.headers['authorization'];
  const token = authHeaders && authHeaders.split(' ')[1];

  if (!token) return res.status(501).send({ 'error': 'no authorization header found' });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.send({ 'error': 'wrong token', isLoggedIn: false });
    const role = user.role;
    if (role === 'user' || role === 'moderator' || role === 'admin') {
      next();
    } else {
      return res.send({ 'Forbidden': 'You don\'t have access on this page !' });
    }
  });
}

const authModerator = (req, res, next) => {
  console.log(req.headers['authorization']);
  const authHeaders = req.headers['authorization'];
  const token = authHeaders && authHeaders.split(' ')[1];

  if (!token) return res.status(501).send({ 'error': 'no authorization header found' });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.send({ 'error': 'wrong token', isLoggedIn: false });
    console.log(user);
    const role = user.role;
    if (role === 'moderator' || role === 'admin') {
      req.body.boss_id = user.id;
      console.log(req.body);
      next();
    } else {
      return res.send({ 'Forbidden': 'You don\'t have access on this page !' });
    }
  });
}

const authAdmin = (req, res, next) => {
  const authHeaders = req.headers['authorization'];
  const token = authHeaders && authHeaders.split(' ')[1];

  if (!token) return res.status(501).send({ 'error': 'no authorization header found' });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.send({ 'error': 'wrong token', isLoggedIn: false });
    console.log(user);
    const role = user.role;
    if (role === 'admin') {
      next();
    } else {
      return res.send({ 'Forbidden': 'You don\'t have access on this page !' });
    }
  });
}

// const isLoggedIn = (req, res, next) => {
//   const authHeaders = req.headers['authorization'];
//   const token = authHeaders && authHeaders.split(' ')[1];

//   if (!token) next();
//   else {
//     jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//       if (err) next();
//       console.log(user);
//       const role = user.role;
//       if (role === 'user' || role === 'moderator' || role === 'admin') {
//         req.body = user;
//         res.redirect('/home');
//       } else {
//         return res.send({ 'Forbidden': 'You don\'t have access on this page !' });
//       }
//     });
//   }

// }

module.exports = { authUser, authModerator, authAdmin };
