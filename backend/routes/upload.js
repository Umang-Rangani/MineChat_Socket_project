const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.uploadFolder || 'common'

    const uploadPath = path.join(__dirname, '..', 'uploads', folder)

    fs.mkdirSync(uploadPath, { recursive: true })

    cb(null, uploadPath)
  },

  filename: (req, file, cb) => {
    const filename = req.body.filename || path.parse(file.originalname).name

    const extension = path.extname(file.originalname)

    cb(null, `${filename}-${Date.now()}${extension}`)
  },
})

const upload = multer({
  storage,
})

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'File is required',
    })
  }

  const folder = req.body.uploadFolder || 'common'

  const filePath = `/uploads/${folder}/${req.file.filename}`

  return res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    filePath,
  })
})

// ===============================
// DELETE - IMAGE
// ===============================

router.delete('/', (req, res) => {
  try {
    const { filePath } = req.body

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'filePath is required',
      })
    }

    const relativePath = filePath.replace(/^\/uploads[\\/]/, '')

    const uploadPath = path.join(__dirname, '..', 'uploads', relativePath)
    // File already doesn't exist
    if (!fs.existsSync(uploadPath)) {
      return res.status(200).json({
        success: true,
        message: 'File not found, but delete skipped',
      })
    }

    fs.unlinkSync(uploadPath)

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message,
    })
  }
})

module.exports = router
