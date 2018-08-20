var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
const saltRounds = 10;

const FriendSchema = new Schema({
  _id: false,
  username: {
    type: String,
  },
  status: {
    type: String,
    enum: ['PENDING', 'OK', 'REQUEST'],
    default: 'PENDING'
  }
});

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
    trim: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  friends: [FriendSchema],
  token: {
    type: String
  }
});

UserSchema.methods.check = function (hash) {
  bcrypt.compare(this.password, hash, function (err, res) {
    if (err) return err;
    return res;
  });
}

module.exports = mongoose.model('User', UserSchema);