var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
const mongoose = require('mongoose')
var dotenv = require('dotenv')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
const Message = require('./model/message')

dotenv.config()

var app = express()

// ================= VIEW ENGINE =================

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// ================= MIDDLEWARE =================

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  }),
)

app.use('/', indexRouter)
app.use('/users', usersRouter)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Error:', err))

// ! SOCKET.IO
const onlineUsers = new Map()

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('Socket Connected:', socket.id)

    // JOIN CHAT

    socket.on('joinChat', (userId) => {
      if (!userId) return

      onlineUsers.set(userId, socket.id)

      socket.userId = userId

      console.log(`${userId} joined with socket ${socket.id}`)
    })

    // PRIVATE MESSAGE

    socket.on('privateMessage', async (data) => {
      try {
        const { sender, receiver, content } = data

        if (!sender || !receiver || !content?.trim()) {
          return
        }

        // Receiver online છે કે નહીં?
        const receiverSocketId = onlineUsers.get(receiver)

        // SAVE MESSAGE IN MONGODB

        const msg = await Message.create({
          sender,
          receiver,
          content: content.trim(),
          // messageType: 'text',
          delivered: !!receiverSocketId,
          seen: false,
        })

        // SEND MESSAGE TO SENDER

        socket.emit('privateMessage', msg)

        // SEND MESSAGE TO RECEIVER

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('privateMessage', msg)
        }
      } catch (error) {
        console.error('Message Error:', error)

        socket.emit('messageError', {
          message: 'Failed to send message',
        })
      }
    })

    // DISCONNECT

    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId)
      }

      console.log('Socket Disconnected:', socket.id)
    })
  })
}

// ! Socket setup export
app.setupSocket = setupSocket



app.use(function (req, res, next) {
  next(createError(404))
})


app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)

  res.render('error')
})

module.exports = app
