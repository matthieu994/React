var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TodoSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  }
});

TodoSchema.methods.check = function () {
  this.done = true;
}

module.exports = mongoose.model('Todo', TodoSchema);