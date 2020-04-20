const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserSchema');

function verifAuth(token) {
  return new Promise((resolve) => {
    if (!token) resolve(false);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) resolve(false);
      User.findById(decoded.user, (err, user) => {
        if (err) resolve(false);
        if (token == user.token) {
          resolve(true);
        }
      });
    });
  });
}

module.exports = function (app) {
  const saltRounds = 10;

  app.post('/auth', (req, res) => {
    const token = req.body.token ? req.body.token : req.headers.token;
    verifAuth(token).then((isAuth) => {
      if (app.get('env') != 'development') {
        if (!isAuth) {
          return res
            .status(403)
            .sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
        }
        res.status(200).sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
      } else {
        if (!isAuth) return res.sendStatus(403);
        res.sendStatus(200);
      }
    });
  });

  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username) {
      return res.send({
        message: 'Erreur: Pseudo invalide.',
      });
    }
    if (!password) {
      return res.send({
        message: 'Erreur: Mot de passe invalide.',
      });
    }

    User.find({ username }, (err, user) => {
      if (err) return err;
      if (user.length > 0) {
        return res.sendStatus(400);
      }
    });

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      if (err) return err;
      const user = new User({ username: req.body.username, password: hash });
      user.save((err) => {
        if (err) return err;
        res.sendStatus(200);
      });
    });
  });

  app.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.find({ username }, (err, user) => {
      if (err) return err;
      if (user.length < 1) {
        return res.send({
          message: 'Erreur: Identifiants invalides.',
        });
      }

      // Compare hash et password de l'user
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) return err;
        if (!result) {
          return res.send({
            message: 'Erreur: Identifiants invalides.',
          });
        }

        // Genère un token si non existant dans la DB
        User.findById(user[0].id, (err, user) => {
          if (!user.token) {
            jwt.sign({ user: user._id }, process.env.JWT_SECRET, (err, token) => {
              if (err) return err;
              user.token = token;
              user.save(() => res.send({
                token: user.token,
              }));
            });
          } else {
            return res.send({
              token: user.token,
            });
          }
        });
      });
    });
  });
};
