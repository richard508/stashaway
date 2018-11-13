const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const stashController = require('../controllers/stashController')

router.get('/api/users', userController.index)
router.post('/api/users/', userController.create)
router.get('/api/users/:userId', userController.show)
router.patch('/api/users/:userId', userController.update)
router.delete('/api/users/:userId', userController.delete)

router.get('/api/users/:userId/stashes', stashController.index)
router.get('/api/users/:userId/stashes/:stashId', stashController.show)
router.delete('/api/users/:userId/stashes/:stashId', stashController.delete)
router.patch('/api/users/:userId/stashes/:stashId', stashController.update)
router.post('/api/users/:userId/stashes', stashController.create)

module.exports = router