const mongoose = require('../db/connections')
const Schema = mongoose.Schema

const User = new Schema({
  username: String,
  fullName: String,
  active: Boolean,
  stashes: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Stash'
    }
  ]
})

module.exports = mongoose.model('User', User)