const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const User = require('../model/user')
const Message = require('../model/message')
const { default: mongoose } = require('mongoose')

/* GET users listing. */

// ! signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, number, age } = req.body

    // Check required fields
    if (!name || !email || !password || !number || !age) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      })
    }

    // Check existing email
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      number: number,
      age: age,
    })

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',

      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        number: newUser.number,
        age: newUser.age,
      },
    })
  } catch (error) {
    console.error('Signup Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

// ! login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    console.log('email, password', email, password)

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    // 2. Find user
    const user = await User.findOne({ email })

    console.log('user', user)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password => user',
      })
    }

    console.log('password', typeof password, 'user.password', typeof user.password)

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password =>  isPasswordValid',
      })
    }

    // ! 4. Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        city: 'surat',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    )

    // console.log("token", token);

    // ! 5. Store JWT in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // 6. Response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: user,
    })
  } catch (error) {
    console.error('Login Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    })

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error) {
    console.error('Logout Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Logout failed',
    })
  }
})

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userData = await User.findById(req.user.userId).select('-password')

    // User not found
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'User profile',

      user: userData,
    })
  } catch (error) {
    console.error('Profile Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

// ! check API
router.get('/all', async (req, res) => {
  try {
    const data = await User.find()
    res.status(200).json(data)
  } catch (error) {
    console.log(error)
  }
})

// ! ilter mate maping
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const data = await User.find({
//       _id: { $ne: req.user.userId },
//     })
//     res.status(200).json(data)
//   } catch (error) {
//     console.log(error)
//   }
// })

// ! aavel msg top pr lava mate
router.get('/', authMiddleware, async (req, res) => {
  try {


    console.log("middleware", typeof(req.user.userId));
    const currentUserId = new mongoose.Types.ObjectId(req.user.userId)

    const users = await User.aggregate([
      // 1. Current user ને exclude કરો
      {
        $match: {
          _id: { $ne: currentUserId },
        },
      },

      // 2. દરેક user સાથે latest message શોધો
      {
        $lookup: {
          from: 'messagewhatapps',

          let: {
            otherUserId: '$_id',
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [{ $eq: ['$sender', currentUserId] }, { $eq: ['$receiver', '$$otherUserId'] }],
                    },
                    {
                      $and: [{ $eq: ['$sender', '$$otherUserId'] }, { $eq: ['$receiver', currentUserId] }],
                    },
                  ],
                },
              },
            },

            // Latest message first
            {
              $sort: {
                createdAt: -1,
              },
            },

            // Only latest message
            {
              $limit: 1,
            },
          ],

          as: 'lastMessage',
        },
      },

      // 3. Array ને object બનાવો
      {
        $unwind: {
          path: '$lastMessage',
          preserveNullAndEmptyArrays: true,
        },
      },

      // 4. Latest message વાળો user top પર
      {
        $sort: {
          'lastMessage.createdAt': -1,
        },
      },
    ])

    res.status(200).json(users)
  } catch (error) {
    console.log('Get Users Error:', error)

    res.status(500).json({
      message: 'Failed to get users',
    })
  }
})

// ! all users POST in POSTMAN & password ne hash krva mate
router.post('/', async (req, res) => {
  try {
    const users = await Promise.all(
      req.body.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    )

    const data = await User.insertMany(users)

    res.status(201).json(data)
  } catch (error) {
    console.log(error)

    res.status(500).json(error)
  }
})

router.delete('/', async (req, res) => {
  try {
    const data = await User.deleteMany()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
