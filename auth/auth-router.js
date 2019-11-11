const router = require('express').Router();
const bcrypt = require('bcrypt');

const Users = require('../users/users-model.js');
const requiresAuth = require('../auth/requires-auth-middleware.js');

router.post('/register', (req, res) => {
  let user = req.body;
  // read a password from the body
  // hash the password using bcryptjs
  const hash = bcrypt.hashSync(user.password, 12);  
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', requiresAuth, (req, res) => {
  let { username } = req.headers;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
