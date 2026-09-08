var express = require('express')
const { default: Status } = require('../model/status')
const authMiddleware = require('../middleware/authMiddleware')
var router = express.Router()

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const data = await Status.find()
    res.status(200).json(data)
  } catch (error) {
    console.log(error)
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {

    const { content, description  , type} = req.body
    const userId = req.user.userId

    const data = await Status.create({ userId, content, description })

    res.json(201).json(data)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
