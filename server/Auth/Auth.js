const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema");

module.exports = (app) => {
  const saltRounds = 10;

  app.post("/test", function (req, res) {
    res.json({ foo: "bar" });
  });

  app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username) {
      return res.send({
        message: "Erreur: Pseudo invalide.",
      });
    }
    if (!password) {
      return res.send({
        message: "Erreur: Mot de passe invalide.",
      });
    }

    User.find({ username }, (err, user) => {
      if (err) return res.send({ err });

      if (user.length > 0) {
        return res.sendStatus(400);
      }
    });

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      if (err) return res.send({ err });
      const user = new User({ username: req.body.username, password: hash });
      user.save((err) => {
        if (err) return res.send({ err });
        res.sendStatus(200);
      });
    });
  });

  app.post("/login", (req, res) => {
    const { username, password } = req.body;

    User.find({ username }, (err, user) => {
      if (err) return res.send({ err });
      if (user.length < 1) {
        return res.send({
          code: 1,
          message: "L'utilisateur n'existe pas.",
        });
      }

      // Compare hash et password de l'user
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) return res.send({ err });
        if (!result) {
          return res.send({
            code: 2,
            message: "Le mot de passe ne correspond pas à cet utilisateur.",
          });
        }

        // Genère un token si non existant dans la DB
        User.findById(user[0].id, (err, user) => {
          if (!user.token) {
            jwt.sign(
              { user: user._id },
              process.env.JWT_SECRET,
              (err, token) => {
                if (err) return res.send({ err });
                user.token = token;
                user.save(() =>
                  res.send({
                    token: user.token,
                  })
                );
              }
            );
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
