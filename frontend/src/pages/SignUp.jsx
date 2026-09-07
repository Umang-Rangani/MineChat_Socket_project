import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { User, Phone, Calendar, Mail, Lock, Eye, ArrowLeft, UserPlus, Image } from 'lucide-react'
import { uploadFile } from '../utils/uploadFile'
import { useRef } from 'react'

export default function SignUp() {
  const [signUp, setSignUp] = useState({
    name: '',
    email: '',
    password: '',
    number: '',
    age: '',
    image: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  // ! file input empty mate
  const fileInputRef = useRef(null)

  // !image 1
  const [pimage, setPimage] = useState()

  // ================= CHANGE =================
  const changeHandle = (e) => {
    const { name, value } = e.target

    setSignUp((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError('')
    setSuccess('')
  }

  // !image 2
  const handleImage = (e) => {
    setPimage(e.target.files[0])

    console.log('e.target.files[0]', e.target.files[0])
  }

  // ================= SUBMIT =================
  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      // !image 3
      if (!pimage) {
        throw new Error('Please select a signUp image')
      }
      const filePath = await uploadFile(signUp.name, pimage, 'signUp')

      const productData = { ...signUp, image: filePath }

      const res = await axiosInstance.post('/users/signup', productData)

      // const res = await axiosInstance.post('/users/signup', signUp)

      // console.log('Signup Response:', res.data)

      if (res.data.success) {
        setSuccess('Account created successfully!')

        setSignUp({
          name: '',
          email: '',
          password: '',
          number: '',
          age: '',
          image: '',
        })

        // Clear selected file
        setPimage(null)

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        setTimeout(() => {
          navigate('/login')
        }, 1000)
      }
    } catch (error) {
      console.log(error)

      setError(error.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div onClick={() => navigate('/')} className="fixed inset-0 z-100 flex items-center justify-center bg-[#0b141a] px-4">
      <form onClick={(e) => e.stopPropagation()} onSubmit={submitHandle} className="w-full max-w-md overflow-hidden rounded-2xl bg-[#111b21] shadow-2xl">
        {/* ================= HEADER ================= */}
        <div className="bg-[#202c33] px-6 py-5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate('/')} className="rounded-full p-2 text-gray-300 transition hover:bg-[#2a3942]">
              <ArrowLeft size={21} />
            </button>

            <div>
              <h2 className="text-xl font-semibold text-white">Create Account</h2>

              <p className="text-sm text-gray-400">
                Join <span className="font-semibold text-[#25D366]">TastyBite</span>
              </p>
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="max-h-[85vh] overflow-y-auto p-6">
          {/* ================= ERROR ================= */}
          {error && <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

          {/* ================= SUCCESS ================= */}
          {success && <div className="mb-5 rounded-lg border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-3 text-sm text-[#25D366]">{success}</div>}

          {/* ================= NAME ================= */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">Name</label>

            <div className="relative">
              <User size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                onChange={changeHandle}
                value={signUp.name}
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-[#2a3942] bg-[#202c33] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]"
              />
            </div>
          </div>

          {/* ================= Image ================= */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">Avtar</label>

            <div className="relative">
              <Image size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImage}
                className="w-full rounded-lg border border-[#2a3942] bg-[#202c33] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]"
              />
            </div>
          </div>

          {/* ================= PHONE ================= */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">Phone</label>

            <div className="relative">
              <Phone size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                onChange={changeHandle}
                value={signUp.number}
                type="number"
                name="number"
                placeholder="Enter your number"
                required
                className="w-full rounded-lg border border-[#2a3942] bg-[#202c33] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]"
              />
            </div>
          </div>

          {/* ================= AGE ================= */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">Age</label>

            <div className="relative">
              <Calendar size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                onChange={changeHandle}
                value={signUp.age}
                type="number"
                name="age"
                placeholder="Enter your age"
                required
                className="w-full rounded-lg border border-[#2a3942] bg-[#202c33] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]"
              />
            </div>
          </div>

          {/* ================= EMAIL ================= */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>

            <div className="relative">
              <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                onChange={changeHandle}
                value={signUp.email}
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-[#2a3942] bg-[#202c33] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]"
              />
            </div>
          </div>

          {/* ================= PASSWORD ================= */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Password</label>

            <div className="relative">
              <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                onChange={changeHandle}
                value={signUp.password}
                type="password"
                name="password"
                placeholder="Enter your password"
                minLength={6}
                required
                className="w-full rounded-lg border border-[#2a3942] bg-[#202c33] py-3 pl-11 pr-12 text-white outline-none transition placeholder:text-gray-500 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]"
              />

              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-300">
                <Eye size={19} />
              </button>
            </div>
          </div>

          {/* ================= BUTTON ================= */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 font-semibold text-[#111b21] transition hover:bg-[#20bd5a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#111b21] border-t-transparent" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={19} />
                Create Account
              </>
            )}
          </button>

          {/* ================= LOGIN ================= */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')} className="font-semibold text-[#25D366] transition hover:text-[#20bd5a]">
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
