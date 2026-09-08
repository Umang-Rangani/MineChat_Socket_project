import React, { useEffect, useRef, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { useUser } from '../context/userProvider'
import { Plus, Image, Video, Type, ArrowLeft, X, Send } from 'lucide-react'
import { uploadFile } from '../utils/uploadFile'

export default function StatusList() {
  const { user } = useUser()

  // USERS
  const [usersData, setUsersData] = useState([])

  // MAIN VIEW
  // home | create
  const [statusView, setStatusView] = useState('home')

  // CREATE TYPE
  // null | text | media
  const [statusType, setStatusType] = useState(null)

  // STATUS DATA
  const [statusData, setStatusData] = useState({
    content: '',
    description: '',
  })

  // FILE
  const fileInputRef = useRef(null)
  const [pimage, setPimage] = useState(null)
  const [preview, setPreview] = useState(null)

  // GET USERS
  const getUsersData = async () => {
    try {
      const res = await axiosInstance.get('/users')
      setUsersData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUsersData()
  }, [])

  // OPEN CREATE STATUS
  const handleOpenCreate = () => {
    setStatusView('create')
    setStatusType(null)
    setPimage(null)
    setPreview(null)

    setStatusData({
      content: '',
      description: '',
    })
  }

  // CLOSE CREATE STATUS
  const handleCloseCreate = () => {
    setStatusView('home')
    setStatusType(null)
    setPimage(null)
    setPreview(null)

    setStatusData({
      content: '',
      description: '',
    })
  }

  // TEXT STATUS
  const handleTextStatus = () => {
    setStatusType('text')
  }

  // MEDIA STATUS
  const handleMediaStatus = () => {
    setStatusType('media')

    setTimeout(() => {
      fileInputRef.current?.click()
    }, 0)
  }

  // FILE SELECT
  const handleImage = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    setPimage(file)

    const imageUrl = URL.createObjectURL(file)
    setPreview(imageUrl)
  }

  // TEXT INPUT
  const handleChange = (e) => {
    const { name, value } = e.target

    setStatusData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // PUBLISH STATUS
  const handlePublish = async () => {
    console.log('statusType:', statusType)

    try {
      // =========================
      // TEXT STATUS
      // =========================
      if (statusType === 'text') {
        if (!statusData.content.trim()) {
          alert('Please write something')
          return
        }

        const data = {
          type: 'text',
          content: statusData.content,
          description: statusData.description,
        }

        console.log('Text status data:', data)

        const res = await axiosInstance.post('/status', data)

        console.log('Text Status Created:', res.data)

        handleCloseCreate()
        return
      }

      // =========================
      // IMAGE / VIDEO STATUS
      // =========================
      if (statusType === 'media') {
        if (!pimage) {
          alert('Please select an image or video')
          return
        }

        // Detect image or video
        const type = pimage.type.startsWith('video/') ? 'video' : 'image'

        // =========================
        // UPLOAD FILE FIRST
        // =========================
        const filePath = await uploadFile(pimage.name, pimage, 'status')

        console.log('Uploaded file path:', filePath)

        // =========================
        // STATUS DATA
        // =========================
        const data = {
          type,
          content: filePath,
          description: statusData.description,
        }

        console.log('Media status data:', data)

        // =========================
        // CREATE STATUS
        // =========================
        const res = await axiosInstance.post('/status', data)

        console.log('Media Status Created:', res.data)

        handleCloseCreate()
      }
    } catch (error) {
      console.log('Status Error:', error.response?.data || error.message)
    }
  }

  return (
    <div className="flex h-screen w-full bg-white">
      {/* ================================================= */}
      {/* LEFT SIDEBAR */}
      {/* ================================================= */}

      <div className="flex w-[405px] flex-col border-r border-gray-200">
        {/* HEADER */}
        <div className="flex h-20 items-center justify-between px-7">
          <h1 className="text-[26px] font-medium">Status</h1>

          {/* PLUS BUTTON */}
          <button onClick={handleOpenCreate} className="flex bg-green-600 text-white h-8 w-8  items-center justify-center rounded-full transition hover:bg-green-800">
            <Plus size={20} strokeWidth={2} />
          </button>
        </div>

        {/* MY STATUS */}
        <div className="flex items-center gap-4 px-7 py-3">
          <div className="relative">
            {!user?.image ? (
              <div className="flex size-14 items-center justify-center rounded-full bg-[#dfe5e7] text-xl font-semibold text-[#54656f]">{user?.name?.charAt(0).toUpperCase()}</div>
            ) : (
              <img src={`http://localhost:3000${user.image}`} alt={user.name} className="size-14 rounded-full object-cover" />
            )}
          </div>

          <div>
            <p className="text-[17px] font-medium">My status</p>

            <p className="text-gray-500">Click to add status update</p>
          </div>
        </div>

        {/* RECENT */}
        <div className="mt-5 px-7">
          <p className="text-[16px] text-gray-500">Recent updates</p>
        </div>

        {/* USERS */}
        <div className="flex-1 overflow-y-auto">
          {usersData.map((item) => (
            <div key={item._id} className="flex cursor-pointer items-center gap-4 px-7 py-3 transition hover:bg-gray-50">
              <div className="h-14 w-14 rounded-full border-2 border-green-500 p-0.5">
                {!item.image ? (
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#dfe5e7] text-lg font-semibold text-[#54656f]">{item.name?.charAt(0).toUpperCase()}</div>
                ) : (
                  <div className="size-12 overflow-hidden rounded-full bg-[#dfe5e7]">
                    <img src={`http://localhost:3000${item.image}`} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-[17px] font-medium">{item.name}</p>

                <p className="text-[16px] text-gray-500">Today at 10:02 am</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================= */}
      {/* MAIN AREA */}
      {/* ================================================= */}

      <div className="flex flex-1 bg-[#f8f7f6]">
        {/* ================================================= */}
        {/* HOME VIEW */}
        {/* ================================================= */}

        {statusView === 'home' && (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border-[7px] border-gray-300">
                <div className="h-7 w-7 rounded-full bg-gray-300" />
              </div>

              <h2 className="mb-4 text-[32px] font-normal">Share statuses</h2>

              <p className="text-[18px] text-gray-500">Share photos, videos and text that disappear after 24 hours.</p>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* CREATE VIEW */}
        {/* ================================================= */}

        {statusView === 'create' && (
          <div className="flex flex-1 flex-col">
            {/* CREATE HEADER */}
            <div className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
              <div className="flex items-center gap-4">
                <button onClick={handleCloseCreate} className="rounded-full p-2 hover:bg-gray-100">
                  <ArrowLeft size={24} />
                </button>

                <h2 className="text-[22px] font-medium">Create status</h2>
              </div>

              <button onClick={handleCloseCreate} className="rounded-full p-2 hover:bg-gray-100">
                <X size={24} />
              </button>
            </div>

            {/* CREATE BODY */}
            <div className="flex flex-1 items-center justify-center overflow-y-auto p-10">
              {/* ================================================= */}
              {/* SELECT TYPE */}
              {/* ================================================= */}

              {!statusType && (
                <div className="w-full max-w-3xl">
                  <h3 className="mb-8 text-center text-2xl font-medium">What do you want to share?</h3>

                  <div className="grid grid-cols-2 gap-8">
                    {/* PHOTO / VIDEO BOX */}
                    <button onClick={handleMediaStatus} className="group flex min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white transition hover:border-[#00a884] hover:shadow-md">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 transition group-hover:bg-[#d9fdd3]">
                        <Image size={38} className="text-gray-600 group-hover:text-[#00a884]" />
                      </div>

                      <h4 className="text-xl font-medium">Photos & Videos</h4>

                      <p className="mt-2 text-gray-500">Share an image or video</p>
                    </button>

                    {/* TEXT BOX */}
                    <button onClick={handleTextStatus} className="group flex min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white transition hover:border-[#00a884] hover:shadow-md">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 transition group-hover:bg-[#d9fdd3]">
                        <Type size={38} className="text-gray-600 group-hover:text-[#00a884]" />
                      </div>

                      <h4 className="text-xl font-medium">Text Status</h4>

                      <p className="mt-2 text-gray-500">Share something with your contacts</p>
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* TEXT FORM */}
              {/* ================================================= */}

              {statusType === 'text' && (
                <div className="w-full max-w-2xl">
                  <div className="rounded-2xl bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-2xl font-medium">Create text status</h3>

                      <button onClick={() => setStatusType(null)} className="rounded-full p-2 hover:bg-gray-100">
                        <ArrowLeft size={22} />
                      </button>
                    </div>

                    <textarea
                      name="content"
                      value={statusData.content}
                      onChange={handleChange}
                      placeholder="What's on your mind?"
                      className="h-52 w-full resize-none rounded-xl border border-gray-200 p-5 text-lg outline-none focus:border-[#00a884]"
                    />

                    <input
                      type="text"
                      name="description"
                      value={statusData.description}
                      onChange={handleChange}
                      placeholder="Add description..."
                      className="mt-4 w-full rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-[#00a884]"
                    />

                    <button onClick={handlePublish} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00a884] py-4 font-medium text-white transition hover:bg-[#008f72]">
                      <Send size={19} />
                      Publish Status
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* MEDIA FORM */}
              {/* ================================================= */}

              {statusType === 'media' && (
                <div className="w-full max-w-2xl">
                  <div className="rounded-2xl bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-2xl font-medium">Create media status</h3>

                      <button
                        onClick={() => {
                          setStatusType(null)
                          setPimage(null)
                          setPreview(null)
                        }}
                        className="rounded-full p-2 hover:bg-gray-100"
                      >
                        <ArrowLeft size={22} />
                      </button>
                    </div>

                    {/* HIDDEN FILE INPUT */}
                    <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleImage} className="hidden" />

                    {/* PREVIEW */}
                    {preview ? (
                      <div className="relative overflow-hidden rounded-xl bg-black">
                        {pimage?.type?.startsWith('video/') ? <video src={preview} controls className="max-h-[400px] w-full object-contain" /> : <img src={preview} alt="preview" className="max-h-[400px] w-full object-contain" />}

                        <button
                          onClick={() => {
                            setPimage(null)
                            setPreview(null)
                          }}
                          className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => fileInputRef.current?.click()} className="flex h-64 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-[#00a884]">
                        <Image size={50} className="mb-4 text-gray-400" />

                        <p className="text-lg font-medium">Select photo or video</p>

                        <p className="mt-2 text-gray-500">Click to choose a file</p>
                      </button>
                    )}

                    {/* DESCRIPTION */}
                    <input
                      type="text"
                      name="description"
                      value={statusData.description}
                      onChange={handleChange}
                      placeholder="Add description..."
                      className="mt-5 w-full rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-[#00a884]"
                    />

                    {/* PUBLISH */}
                    <button onClick={handlePublish} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00a884] py-4 font-medium text-white transition hover:bg-[#008f72]">
                      <Send size={19} />
                      Publish Status
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
