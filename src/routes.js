const User = require('./models/UserModel');

module.exports = (router) => {

  router.post('/login', (req, res, next) => {
    if (req.body.username
      && req.body.password
    ) {
      const userData = {
        username: req.body.username,
        password: req.body.password,
      };
      User.authenticate(userData.username, userData.password, (error, user) => {
        if (error || !user) {
          const err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          console.log(req.session.userId);
          return res.send('Success');
        }
      });
    } else {
      const err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  });

  router.get('/getCurrentUser', (req, res, next) => {
    console.log(req.session.userId);
    User.findById(req.session.userId)
      .exec((error, user) => {
        if (error) return error;
        else {
          if (user === null) {
            res.status(400).send({ user });
          } else {
            return res.send({ user });
          }
        }
      })
  });

  router.get('/logout', function (req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.send("Successfully destroyed");
        }
      });
    } else {
      res.send("no session");
    }
  });

  router.post('/createAccount', (req, res, next) => {
    if (req.body.email
      && req.body.username
      && req.body.password
    ) {
      const userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      };

      User.create(userData, (err, user) => {
        if (err) return next(err);
        else return res.redirect('/');
      });
    }
    else {
      res.send('err');
    }
  });
};