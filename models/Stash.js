const mongoose = require('../db/connections')
const Schema = mongoose.Schema

const Stash = new Schema({
  title: String,
  total: Number,
  amountIn: Number,
  neededBy: Date,
  group: Boolean,
  activities: {
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  }
})

module.exports = mongoose.model('Stash', Stash)
