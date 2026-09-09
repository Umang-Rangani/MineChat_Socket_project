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

router.get('/my-status', authMiddleware, async (req, res) => {
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

// ! status delete krva mate
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const status = await Status.findById(id)

    if (!status) {
      return res.status(404).json({
        message: 'Status not found',
      })
    }

    // 🔐 Only status owner can delete
    if (status.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        message: 'You can delete only your own status',
      })
    }

    await Status.findByIdAndDelete(id)

    res.status(200).json({
      message: 'Status deleted successfully',
    })
  } catch (error) {
    console.log('Delete Status Error:', error)

    res.status(500).json({
      message: 'Failed to delete status',
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
