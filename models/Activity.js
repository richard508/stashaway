const mongoose = require('../db/connections')
const Schema = mongoose.Schema

const Activity = new Schema({
  description: String
})

module.exports = mongoose.model('Chat', Chat)
