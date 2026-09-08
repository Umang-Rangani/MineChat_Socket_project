var express = require('express')
const { default: Status } = require('../model/status')
const authMiddleware = require('../middleware/authMiddleware')
var router = express.Router()

/* GET home page. */
router.get('/all', async (req, res, next) => {
  try {
    const data = await Status.find()
    res.status(200).json(data)
  } catch (error) {
    console.log(error)
  }
})

router.get('/', authMiddleware, async (req, res) => {
  try {
    const data = await Status.find({
      expiresAt: { $gt: new Date() },
    })
      .populate('userId', 'name image')
      .sort({ createdAt: 1 })

    res.status(200).json(data)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to get status',
    })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, description, type, backgroundColor } = req.body

    console.log('content, description, type, backgroundColor ', content, description, type, backgroundColor)

    const userId = req.user.userId

    const data = await Status.create({
      userId,
      content,
      description,
      type,
      backgroundColor,
    })

    res.status(201).json(data)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to create status',
    })
  }
})

router.delete('/', async (req, res) => {
  try {
    const daat = await Status.deleteMany()
    res.json(daat)
  } catch (error) {
    console.log(error)
  }
})
module.exports = router
