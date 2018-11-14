const mongoose = require('../db/connections')
const Schema = mongoose.Schema

const User = new Schema({
  email: String,
  googleId: String,
  name: String,
  active: { type: Boolean, default: true },
  stashes: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Stash'
    }
  ]
})

module.exports = mongoose.model('User', User)