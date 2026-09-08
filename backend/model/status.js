import mongoose from 'mongoose'

const statusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserWhatapp',
      required: true,
    },

    type: {
      type: String,
      enum: ['text', 'image', 'video'],
      default: 'text',
    },

    content: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    backgroundColor: {
      type: String,
      default: '#000000',
    },

    viewers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  },
)

statusSchema.index({ expiresAt: 1 })

const Status = mongoose.model('StatusWhatapp', statusSchema)

export default Status
