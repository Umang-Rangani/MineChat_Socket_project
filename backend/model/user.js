const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ! 1
    image: {
      type: String,
    },

    number: {
      type: Number,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model('UserWhatapp', userSchema)

module.exports = User
