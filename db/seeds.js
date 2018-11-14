const User = require('../models/User')
const Stash = require('../models/Stash')
const mongoose = require('./connections')

const vegas = new Stash({
  title: 'Trip to Vegas',
  total: 5000,
  amountIn: 250,
  neededBy: 2019-10-01,
  group:false
})

const ps4 = new Stash({
  title: 'Buy PS4 Pro',
  total: 400,
  amountIn: 250,
  neededBy: 2019-02-01,
  group: false
})

const richard = new User({
    username: 'richard508',
    password: 'noNeed',
    stashes: [ps4, vegas]
})

User.remove({})
    .then(() => Stash.remove({}))
    .then(() => Stash.insertMany([ps4, vegas]))
    .then(() => richard.save())
    .then(() => console.log('Successful Save'))
    .then(() => mongoose.connection.close())