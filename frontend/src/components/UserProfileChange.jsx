import { Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRef } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { uploadFile, deleteFile } from '../utils/uploadFile'
import { useUser } from '../context/userProvider'
import { ArrowLeft, UserRound, Mail, Phone, CalendarDays, ImagePlus, Trash2, Save } from 'lucide-react'

export default function UserProfileChange() {
  const [product, setProduct] = useState({ name: '', image: '', password: '', email: '', number: '', age: '' })
  const navigate = useNavigate()

  const { logout, user, setUser } = useUser()
  const id = user._id

  // deleteImg 1
  const oldImageRef = useRef('')

  // !image 1
  const [pimage, setPimage] = useState()

  const changeHandle = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  // !image 2
  const handleImage = (e) => {
    setPimage(e.target.files[0])
  }

  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      // ! rit2 uploadFile &  deleteFile
      let imagePath = product.image

      if (pimage) {
        // Delete old image
        if (oldImageRef.current) {
          await deleteFile(oldImageRef.current)
        }

        // Upload new image
        imagePath = await uploadFile(product.name, pimage, 'signUp')
      }
      const productData = { ...product, image: imagePath }

      // console.log('productData', productData)

      const res = await axiosInstance.put(`/users/${id}`, productData)

      setUser(res.data)

      // console.log('user', user)
      // console.log('change', res.data)

      // navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  const getProduct = async () => {
    try {
      const res = await axiosInstance.get(`/users/${id}`)
      setProduct(res.data)
      oldImageRef.current = res.data.image
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProduct()
  }, [id, user])

  console.log('product', product)
  // console.log("pimage", pimage);

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#f5f7f8]">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <button onClick={() => history.back()} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#008f72] transition hover:bg-[#e7fcef]">
            <ArrowLeft size={19} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <UserRound size={22} className="text-[#00a884]" />

            <h1 className="text-xl font-bold text-[#111b21] sm:text-2xl">User Management</h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full overflow-hidden rounded-xl border border-[#e1e7e9] bg-white shadow-sm">
          {/* Card Header */}
          <div className="flex items-center gap-3 border-b border-[#e9edef] bg-[#f7f9fa] px-5 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e7fcef]">
              <UserRound size={20} className="text-[#00a884]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#111b21]">Edit User</h2>

              <p className="mt-0.5 text-xs text-[#667781]">Update user profile and account details</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submitHandle} className="grid w-full grid-cols-1 gap-5 p-5 md:grid-cols-2">
            {/* Profile Image */}
            <div className="col-span-1 rounded-xl border border-dashed border-[#b7ead9] bg-[#f7fffc] p-4 md:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <ImagePlus size={18} className="text-[#00a884]" />

                <span className="text-sm font-semibold text-[#111b21]">Profile Photo</span>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Avatar */}
                {product.image ? (
                  <div className="relative shrink-0">
                    <div className="size-24 overflow-hidden rounded-full border-4 border-white shadow-md">
                      <img src={`http://localhost:3000${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setProduct((prev) => ({
                          ...prev,
                          image: '',
                        }))
                      }
                      className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-[#e53935] text-white shadow-sm transition hover:bg-[#c62828]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-[#dfe5e7] text-3xl font-semibold text-[#54656f]">{product.name?.charAt(0).toUpperCase() || <UserRound size={32} />}</div>
                )}

                {/* Media Input */}
                {!product.image && (
                  <div className="min-w-0 flex-1">
                    <label className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl border border-[#d1d7db] bg-white px-4 text-sm text-[#667781] transition hover:border-[#00a884] hover:bg-[#f7fffc]">
                      <ImagePlus size={19} className="shrink-0 text-[#00a884]" />

                      <span className="truncate">Choose profile image</span>

                      <input type="file" name="image" accept="image/*" onChange={handleImage} className="hidden" />
                    </label>

                    <p className="mt-2 text-xs text-[#8696a0]">JPG, PNG or WEBP • Select a profile photo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Full Name */}
            <div className="w-full">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#54656f]">
                <UserRound size={16} className="text-[#00a884]" />
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={product.name}
                placeholder="Enter full name"
                onChange={changeHandle}
                className="h-12 w-full rounded-xl border border-[#d1d7db] bg-white px-4 text-sm text-[#111b21] outline-none transition placeholder:text-[#8696a0] focus:border-[#00a884] focus:ring-2 focus:ring-[#00a884]/15"
              />
            </div>

            {/* Email */}
            <div className="w-full">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#54656f]">
                <Mail size={16} className="text-[#00a884]" />
                Email
              </label>

              <input
                type="email"
                name="email"
                value={product.email}
                placeholder="Enter email"
                onChange={changeHandle}
                className="h-12 w-full rounded-xl border border-[#d1d7db] bg-white px-4 text-sm text-[#111b21] outline-none transition placeholder:text-[#8696a0] focus:border-[#00a884] focus:ring-2 focus:ring-[#00a884]/15"
              />
            </div>

            {/* Mobile */}
            <div className="w-full">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#54656f]">
                <Phone size={16} className="text-[#00a884]" />
                Mobile Number
              </label>

              <input
                type="tel"
                name="number"
                value={product.number}
                placeholder="Enter mobile number"
                onChange={changeHandle}
                className="h-12 w-full rounded-xl border border-[#d1d7db] bg-white px-4 text-sm text-[#111b21] outline-none transition placeholder:text-[#8696a0] focus:border-[#00a884] focus:ring-2 focus:ring-[#00a884]/15"
              />
            </div>

            {/* Age */}
            <div className="w-full">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#54656f]">
                <CalendarDays size={16} className="text-[#00a884]" />
                Age
              </label>

              <input
                type="number"
                name="age"
                value={product.age}
                placeholder="Enter age"
                onChange={changeHandle}
                className="h-12 w-full rounded-xl border border-[#d1d7db] bg-white px-4 text-sm text-[#111b21] outline-none transition placeholder:text-[#8696a0] focus:border-[#00a884] focus:ring-2 focus:ring-[#00a884]/15"
              />
            </div>

            {/* Update Button */}
            <div className="col-span-1 pt-1 md:col-span-2">
              <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00a884] text-sm font-semibold text-white transition hover:bg-[#008f72] hover:shadow-md">
                <Save size={18} />
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
