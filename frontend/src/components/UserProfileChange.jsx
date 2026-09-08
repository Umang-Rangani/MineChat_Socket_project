import { ArrowLeft, Trash, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRef } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { uploadFile, deleteFile } from '../utils/uploadFile'
import { useUser } from '../context/userProvider'

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

  console.log("product", product)
  // console.log("pimage", pimage);

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-5xl px-6 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => history.back()} className="flex items-center gap-2 font-medium text-[#318616] hover:text-[#256d12]">
            <ArrowLeft size={20} />
            Back
          </button>

          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        </div>

        {/* Card */}
        <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm pb-20">
          {/* Card Header */}
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>

            <p className="mt-1 text-sm text-gray-500">Update user profile and account details.</p>
          </div>

          {/* Form */}
          <form onSubmit={submitHandle} className="grid w-full grid-cols-1 gap-5 p-6 md:grid-cols-2">
            {/* Profile Image - Full Width */}
            <div className="col-span-1 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 md:col-span-2">
              <div className="flex items-center gap-5">
                {product.image ? (
                  <div className="relative">
                    <div className="size-24 overflow-hidden rounded-full border-4 border-white shadow">
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
                      className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-[#dfe5e7] text-3xl font-semibold text-[#54656f]">{product.name?.charAt(0).toUpperCase()}</div>
                )}

                {!product.image && 
                <input 
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={handleImage} 
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#318616]" />}
              </div>
            </div>

            {/* Name */}
            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>

              <input
                type="text"
                name="name"
                value={product.name}
                placeholder="Enter full name"
                onChange={changeHandle}
                className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-[#318616] focus:ring-2 focus:ring-[#318616]/20"
              />
            </div>

            {/* Email */}
            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>

              <input
                type="email"
                name="email"
                value={product.email}
                placeholder="Enter email"
                onChange={changeHandle}
                className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-[#318616] focus:ring-2 focus:ring-[#318616]/20"
              />
            </div>

            {/* Mobile */}
            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-700">Mobile Number</label>

              <input
                type="tel"
                name="number"
                value={product.number}
                placeholder="Enter mobile number"
                onChange={changeHandle}
                className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-[#318616] focus:ring-2 focus:ring-[#318616]/20"
              />
            </div>

            {/* Age */}
            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-700">Age</label>

              <input
                type="number"
                name="age"
                value={product.age}
                placeholder="Enter age"
                onChange={changeHandle}
                className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-[#318616] focus:ring-2 focus:ring-[#318616]/20"
              />
            </div>

            {/* Button - Full Width */}
            <div className="col-span-1 pt-2 md:col-span-2">
              <button type="submit" className="h-12 w-full rounded-xl bg-[#318616] font-semibold text-white transition hover:bg-[#256d12] hover:shadow-md">
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
