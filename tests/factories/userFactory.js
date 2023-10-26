const mongoose = require('mongoose');
const User = mongoose.model('User');

const userFactory = () => {
  return new User({}).save();
};

module.exports = userFactory;
