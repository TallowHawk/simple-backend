const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  }
});

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

UserSchema.statics.authenticate = (username, password, callback) => {
  User.findOne({ username: username })
    .exec((err, user) => {
      if (err) return callback(err);
      else if (!user) {
        const notFoundError = new Error('User not found');
        notFoundError.status = 401;
        return callback(notFoundError);
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (result === true) return callback(null, user);
        else return callback();
      })
    })
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
