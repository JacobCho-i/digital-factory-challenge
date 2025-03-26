const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },  
  content: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('UserData', userDataSchema);