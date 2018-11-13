const User = require('../models/User')
const Stash = require('../models/Stash')

const stashController = {
  index: (req, res) => {
    let userId = req.params.userId
    User.findById(userId).populate('stashes')
      .then((user) => {
        res.send(user.stashes)
      })
  },
  show: (req, res) => {
    let stashId = req.params.stashId
    Stash.findById(stashId).populate('activities')
      .then((stash) => {
        res.send(stash)
      })
  },
  delete: (req, res) => {
    let stashId = req.params.stashId
    Stash.findByIdAndDelete(stashId)
      .then(() => {
        res.send(200)
      })
  },
  update: (req, res) => {
    let stashId = req.params.stashId
    Stash.findByIdAndUpdate(stashId, req.body, { new: true })
      .then((updatedStash) => {
        updatedStash.save()
        res.send(updatedStash)
      })
  },
  create: (req, res) => {
    let userId = req.params.userId
    User.findById(userId)
      .then((user) => {
        Stash.create(req.body)
          .then((newStash) => {
            user.stashes.push(newStash)
            user.save()
            res.send(newStash)
          })
      })
  }

}

module.exports = stashController
