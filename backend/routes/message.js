const express = require('express')
const router = express.Router()

const Message = require('../model/message')

// GET messages between two users
router.get('/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params

    const messages = await Message.find({
      $or: [
        {
          sender: user1,
          receiver: user2,
        },
        {
          sender: user2,
          receiver: user1,
        },
      ],
    }).sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    console.log('Get Messages Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get messages',
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const data = await Message.find()
    res.json(data)
  } catch (error) {
    console.log(error)
  }
})



module.exports = router
