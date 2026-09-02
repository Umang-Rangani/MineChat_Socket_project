  const mongoose = require('mongoose')

  const messageSchema = new mongoose.Schema(
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserWhatapp',
        required: true,
      },

      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserWhatapp',
        required: true,
      },

      content: {
        type: String,
        required: true,
        trim: true,
      },

      delivered: {
        type: Boolean,
        default: false,
      },

      seen: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    },
  )

  const Message = mongoose.model('MessageWhatapp', messageSchema)

  module.exports = Message

  //  {
  //     "name": "Rahul Patel",
  //     "email": "rahul@gmail.com",
  //     "password": "123456",
  //     "number": 9876543210,
  //     "age": 22
  //   },
