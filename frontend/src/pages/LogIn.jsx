import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/userProvider'
import { axiosInstance } from '../config/axiosConfig'
import { Mail, Lock, Eye, ArrowLeft, LogIn, UserPlus } from 'lucide-react'

export default function Login() {
  const [logIns, setLogIn] = useState({
    email: '',
    password: '',
  })

  const { setUser } = useUser()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ================= CHANGE =================
  const changeHandle = (e) => {
    const { name, value } = e.target

    setLogIn((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  console.log("logIns", logIns);

  // ================= SUBMIT =================
  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const res = await axiosInstance.post('/users/login', logIns)

      setUser(res.data.user)

      console.log('Login Response:', res.data)

      // !
      if (res.data.success) {
        return navigate('/')
      }

      // if (response.data.user.role === 'admin') {
      //   navigate('/admin/dashboard', {
      //     replace: true,
      //   })

      //   return
      // }
    } catch (error) {
      console.log(error)

      setError(error.response?.data?.message || 'Login failed. Please try again.')
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
              <h2 className="text-xl font-semibold text-white">Welcome Back</h2>

              <p className="text-sm text-gray-400">
                Login to continue to <span className="font-semibold text-[#25D366]">TastyBite</span>
              </p>
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="p-6">
          {/* ================= ERROR ================= */}
          {error && <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

          {/* ================= EMAIL ================= */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>

            <div className="relative">
              <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                onChange={changeHandle}
                value={logIns.email}
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
                value={logIns.password}
                type="password"
                name="password"
                placeholder="Enter your password"
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
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={19} />
                Login
              </>
            )}
          </button>

          {/* ================= SIGNUP ================= */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate('/signup')} className="inline-flex items-center gap-1 font-semibold text-[#25D366] transition hover:text-[#20bd5a]">
              <UserPlus size={16} />
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
