import React, { useEffect, useRef, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { useUser } from '../context/userProvider'
import { Plus, Image, Video, Type, ArrowLeft, X, Send, ArrowRight, Trash2, MessageCircle, CircleDashed } from 'lucide-react'
import { deleteFile, uploadFile } from '../utils/uploadFile'
import UserListShimmer from './UserListShimmer'
import StatusListShimmer from './StatusListShimmer'

export default function StatusList() {
  const { user } = useUser()

  // ! users data contact GET => users
  const [usersData, setUsersData] = useState([])

  // ! status data jova mate GET => status
  const [statusDataList, setStatusDataList] = useState([])

  // ! actual Status Viewer
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)

  // + pr click krta create content open thay
  const [statusView, setStatusView] = useState('home') // home | create

  // model key mate type:text / media
  const [statusType, setStatusType] = useState(null) // null | text | media

  // status input data
  const [statusData, setStatusData] = useState({
    content: '',
    description: '',
    backgroundColor: '#00a884',
    textColor: '#ffffff',
  })

  // upload file mate
  const fileInputRef = useRef(null)
  const [pimage, setPimage] = useState(null)

  // img ne select krta create ma btava mte
  const [preview, setPreview] = useState(null)

  // ! shimmmer
  const [shimmer, setShimmer] = useState(false)

  // ! get users
  const getUsersData = async () => {
    try {
      setShimmer(true)
      const res = await axiosInstance.get('/users')
      setUsersData(res.data)
      setShimmer(false)
    } catch (error) {
      console.log(error)
    }
  }

  // ! get status
  const getStatusData = async () => {
    try {
      setShimmer(true)

      const res = await axiosInstance.get('/status')

      console.log('Status Data:', res.data)

      setStatusDataList(res.data)
      setShimmer(false)
    } catch (error) {
      console.log('Status Error:', error)
    }
  }

  useEffect(() => {
    getUsersData()
    getStatusData()
  }, [])

  const getLoginUserStatus = (userId) => {
    return statusDataList.filter((status) => status.userId?._id === userId)
  }

  const getUserStatus = (userId) => {
    return statusDataList.filter((status) => status.userId?._id === userId)
  }

  // ! open create status
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

  // ! close create status
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

  // ! text status
  const handleTextStatus = () => {
    setStatusType('text')
  }

  // ! media status
  const handleMediaStatus = () => {
    setStatusType('media')

    setTimeout(() => {
      fileInputRef.current?.click()
    }, 0)
  }

  // ! file input mate
  const handleImage = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    setPimage(file)

    // purpose  preview img btava mte
    const imageUrl = URL.createObjectURL(file)
    setPreview(imageUrl)

    console.log('imageUrl', imageUrl)
    console.log('file', file)
  }

  // ! text input mate
  const handleChange = (e) => {
    const { name, value } = e.target

    setStatusData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ! main logic post
  const handlePublish = async () => {
    // console.log('statusType:', statusType)
    try {
      // TEXT STATUS
      if (statusType === 'text') {
        if (!statusData.content.trim()) {
          alert('Please write something')
          return
        }

        const data = {
          type: 'text',
          content: statusData.content,
          description: statusData.description,
          textColor: statusData.textColor,
          backgroundColor: statusData.backgroundColor,
        }

        console.log('Text status data:', data)

        const res = await axiosInstance.post('/status', data)

        console.log('Text Status Created:', res.data)

        handleCloseCreate()
        return
      }

      // IMAGE / VIDEO <STATUS></STATUS>
      if (statusType === 'media') {
        if (!pimage) {
          alert('Please select an image or video')
          return
        }

        const type = pimage.type.startsWith('video/') ? 'video' : 'image'

        const filePath = await uploadFile(pimage.name, pimage, 'status')

        const data = {
          type,
          content: filePath,
          description: statusData.description,
        }

        const res = await axiosInstance.post('/status', data)
        // console.log('Media Status Created:', res.data)

        await getStatusData() //

        handleCloseCreate()
      }
    } catch (error) {
      console.log('Status Error:', error.response?.data || error.message)
    }
  }

  // ! status Trash2 krva mte
  const handleDeleteStatus = async () => {
    const currentStatus = selectedStatuses[currentStatusIndex]

    if (!currentStatus?._id) return

    try {
      // 1. Delete status from MongoDB
      await axiosInstance.delete(`/status/${currentStatus._id}`)

      // 2. Delete uploaded image/video file
      if (currentStatus.type === 'image' || currentStatus.type === 'video') {
        await deleteFile(currentStatus.content)
      }

      // 3. Remove status from main status list
      setStatusDataList((prev) => prev.filter((status) => status._id !== currentStatus._id))

      // 4. Remove status from currently opened statuses
      const updatedStatuses = selectedStatuses.filter((status) => status._id !== currentStatus._id)

      // 5. If no status left, close viewer
      if (updatedStatuses.length === 0) {
        setSelectedStatuses([])
        setCurrentStatusIndex(0)
        return
      }

      // 6. Otherwise show remaining statuses
      setSelectedStatuses(updatedStatuses)

      setCurrentStatusIndex((prev) => (prev >= updatedStatuses.length ? updatedStatuses.length - 1 : prev))

      console.log('Status deleted successfully')
    } catch (error) {
      console.log('Delete Status Error:', error.response?.data || error.message)
    }
  }

  // console.log(statusView);
  // console.log('xxxxxx', selectedStatuses[currentStatusIndex])

  if (shimmer) {
    return <StatusListShimmer />
  }

  return (
    <div className="flex h-screen w-full bg-[#F5F5F0]">
      {/* left sidebar */}
      <div className="flex w-90 flex-col border-r border-gray-200">
        {/* HEADER */}
        <div className="flex h-20 items-center justify-between px-7">
          <h1 className="text-[26px] font-medium">Status</h1>

          {/* PLUS BUTTON */}
          {getLoginUserStatus(user?._id).length > 0 && (
            <button onClick={handleOpenCreate} className="flex bg-green-600 text-white h-8 w-8  items-center justify-center rounded-full transition hover:bg-green-800">
              <Plus size={20} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* my status jova mate */}
        {(() => {
          const myStatuses = getLoginUserStatus(user?._id)

          return (
            <div
              onClick={() => {
                if (myStatuses.length > 0) {
                  setSelectedStatuses(myStatuses)
                  setCurrentStatusIndex(0)
                } else {
                  handleOpenCreate()
                }
              }}
              className="flex cursor-pointer items-center gap-4 px-7 py-3 hover:bg-gray-50"
            >
              <div className="relative">
                {/* Profile */}
                <div className={`h-14 w-14 rounded-full p-0.5 ${myStatuses.length > 0 ? 'border-2 border-green-500' : ''}`}>
                  {!user?.image ? (
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#dfe5e7] text-xl font-semibold text-[#54656f]">{user?.name?.charAt(0).toUpperCase()}</div>
                  ) : (
                    <img src={`http://localhost:3000${user.image}`} alt={user.name} className="size-12 rounded-full object-cover" />
                  )}
                </div>

                {/* Plus */}
                {myStatuses.length === 0 && (
                  <div className="absolute bottom-0 right-0 flex size-5 items-center justify-center rounded-full bg-green-600 text-white">
                    <Plus size={14} />
                  </div>
                )}
              </div>

              <div>
                <p className="text-[17px] font-medium">My status</p>

                <p className="text-[16px] text-gray-500">
                  {myStatuses.length > 0
                    ? `Today at ${new Date(myStatuses[myStatuses.length - 1].createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`
                    : 'Click to add status update'}
                </p>
              </div>
            </div>
          )
        })()}

        {/* RECENT */}
        <div className="mt-5 px-7">
          <p className="text-[16px] text-gray-500">Recent updates</p>
        </div>

        {/* USERS */}
        <div className="flex-1 overflow-y-auto">
          {usersData.map((item) => {
            const userStatuses = getUserStatus(item._id)

            return (
              <div
                key={item._id}
                onClick={() => {
                  if (userStatuses.length > 0) {
                    // console.log('User Status:', userStatuses)
                  }
                }}
                className="flex cursor-pointer items-center gap-4 px-7 py-3 transition hover:bg-gray-50"
              >
                <div
                  onClick={() => {
                    if (userStatuses.length > 0) {
                      setSelectedStatuses(userStatuses)
                      setCurrentStatusIndex(0)
                    }
                  }}
                  className={`h-14 w-14 rounded-full p-0.5 ${userStatuses.length > 0 ? 'border-2 border-green-500' : ''}`}
                >
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

                  <p className="text-[16px] text-gray-500">
                    {userStatuses.length > 0
                      ? `Today at ${new Date(userStatuses[userStatuses.length - 1].createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`
                      : 'No status'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* right sidebar */}
      <div className="flex flex-1 bg-[#f8f7f6]">
        {/* HOME VIEW */}
        {selectedStatuses.length === 0 && statusView === 'home' && (
          <div className="flex min-h-0 flex-1 items-center justify-center bg-[#111b21] px-6">
            <div className="w-full max-w-xl text-center">
              {/* Icon */}
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[#202c33]">
                <CircleDashed size={42} strokeWidth={1.5} className="text-[#8696a0]" />
              </div>

              {/* Title */}
              <h2 className="mb-3 text-2xl font-normal text-[#e9edef] sm:text-[28px]">Share statuses</h2>

              {/* Description */}
              <p className="mx-auto max-w-lg text-sm leading-6 text-[#8696a0] sm:text-base">Share photos, videos and text that disappear after 24 hours.</p>

              {/* Small Bottom Info */}
              <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-[#202c33] px-4 py-2 text-xs text-[#8696a0]">
                <MessageCircle size={15} className="text-[#00a884]" />
                Your status is private
              </div>
            </div>
          </div>
        )}

        {/* create image & text input jova mate */}
        {selectedStatuses.length === 0 && statusView === 'create' && (
          <div className="flex min-h-0 flex-1 flex-col bg-[#f5f7f8]">
            {/* ================= HEADER ================= */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#d1d7db] bg-[#111b21] px-4 text-[#e9edef] sm:px-6">
              <div className="flex items-center gap-3">
                <button onClick={handleCloseCreate} className="flex size-9 items-center justify-center rounded-full text-[#d1d7db] transition hover:bg-[#2a3942] hover:text-white">
                  <ArrowLeft size={21} />
                </button>

                <div>
                  <h2 className="text-base font-medium sm:text-lg">Create status</h2>

                  <p className="text-[11px] text-[#8696a0]">Share with your contacts</p>
                </div>
              </div>

              <button onClick={handleCloseCreate} className="flex size-9 items-center justify-center rounded-full text-[#8696a0] transition hover:bg-[#2a3942] hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* ================= BODY ================= */}
            <div className="whatsapp-scroll min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
              {/* ================= SELECT TYPE ================= */}
              {!statusType && (
                <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center">
                  <div className="mb-7 text-center">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[#d9fdd3]">
                      <MessageCircle size={24} className="text-[#00a884]" />
                    </div>

                    <h3 className="text-xl font-medium text-[#111b21] sm:text-2xl">What do you want to share?</h3>

                    <p className="mt-2 text-sm text-[#667781]">Choose a type to create your status</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* PHOTO / VIDEO */}
                    <button
                      onClick={handleMediaStatus}
                      className="group flex min-h-52 flex-col items-center justify-center rounded-2xl border border-[#d1d7db] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#00a884] hover:shadow-md"
                    >
                      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#f0f2f5] transition group-hover:bg-[#d9fdd3]">
                        <Image size={32} strokeWidth={1.8} className="text-[#667781] transition group-hover:text-[#00a884]" />
                      </div>

                      <h4 className="text-base font-semibold text-[#111b21]">Photos & Videos</h4>

                      <p className="mt-1.5 text-center text-sm text-[#667781]">Share an image or video</p>
                    </button>

                    {/* TEXT */}
                    <button
                      onClick={handleTextStatus}
                      className="group flex min-h-52 flex-col items-center justify-center rounded-2xl border border-[#d1d7db] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#00a884] hover:shadow-md"
                    >
                      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#f0f2f5] transition group-hover:bg-[#d9fdd3]">
                        <Type size={32} strokeWidth={1.8} className="text-[#667781] transition group-hover:text-[#00a884]" />
                      </div>

                      <h4 className="text-base font-semibold text-[#111b21]">Text Status</h4>

                      <p className="mt-1.5 text-center text-sm text-[#667781]">Share something with your contacts</p>
                    </button>
                  </div>
                </div>
              )}

              {/* ================= TEXT STATUS ================= */}
              {statusType === 'text' && (
                <div className="mx-auto flex min-h-full w-full max-w-2xl items-center justify-center">
                  <div className="w-full overflow-hidden rounded-2xl border border-[#e1e7e9] shadow-sm" style={{ backgroundColor: statusData.backgroundColor }}>
                    {/* Form Header */}
                    <div className="flex items-center justify-between border-b border-white/20 bg-black/10 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-white/20">
                          <Type size={18} className="text-white" />
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-white">Create text status</h3>

                          <p className="text-xs text-white/70">Write something to share</p>
                        </div>
                      </div>

                      {/* Colors */}
                      <div className="flex items-center gap-2">
                        {/* Background color */}
                        <label className="relative size-7 cursor-pointer overflow-hidden rounded-full border-2 border-white/70 shadow-sm" style={{ backgroundColor: statusData.backgroundColor }} title="Background color">
                          <input
                            type="color"
                            value={statusData.backgroundColor}
                            onChange={(e) =>
                              setStatusData((prev) => ({
                                ...prev,
                                backgroundColor: e.target.value,
                              }))
                            }
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                        </label>

                        {/* Text color */}
                        <label className="relative flex size-7 cursor-pointer items-center justify-center rounded-full border-2 border-white/70 bg-white shadow-sm" title="Text color">
                          <span className="size-4 rounded-full" style={{ backgroundColor: statusData.textColor }} />

                          <input
                            type="color"
                            value={statusData.textColor}
                            onChange={(e) =>
                              setStatusData((prev) => ({
                                ...prev,
                                textColor: e.target.value,
                              }))
                            }
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                        </label>

                        <button onClick={() => setStatusType(null)} className="ml-1 flex size-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10">
                          <ArrowLeft size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Status Preview / Form Body */}
                    <div
                      className="flex min-h-105 flex-col justify-center p-8"
                      style={{
                        backgroundColor: statusData.backgroundColor,
                        color: statusData.textColor,
                      }}
                    >
                      {/* Text input */}
                      <textarea
                        name="content"
                        value={statusData.content}
                        onChange={handleChange}
                        placeholder="What's on your mind?"
                        style={{
                          color: statusData.textColor,
                          caretColor: statusData.textColor,
                        }}
                        className="min-h-55 w-full resize-none border-none bg-transparent p-6 text-center text-4xl font-semibold leading-tight outline-none placeholder:opacity-50 focus:ring-0"
                      />

                      {/* Description */}
                      <input
                        type="text"
                        name="description"
                        value={statusData.description}
                        onChange={handleChange}
                        placeholder="Add description..."
                        style={{
                          color: statusData.textColor,
                          caretColor: statusData.textColor,
                        }}
                        className="mt-4 h-12 w-full border-none bg-transparent px-4 text-center text-sm outline-none placeholder:opacity-50 focus:ring-0"
                      />

                      {/* Publish */}
                      <button onClick={handlePublish} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black/20 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-black/30">
                        <Send size={18} />
                        Publish Status
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= MEDIA STATUS ================= */}
              {statusType === 'media' && (
                <div className="mx-auto flex w-full max-w-4xl items-start justify-center py-3 sm:py-4">
                  <div className="w-full overflow-hidden rounded-2xl border border-[#d1d7db] bg-white shadow-sm">
                    {/* ================= CREATE STATUS HEADER ================= */}
                    <div className="flex h-14 w-full items-center justify-between border-b border-[#e9edef] bg-[#f7f9fa] px-4 sm:px-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <button
                          onClick={() => {
                            setStatusType(null)
                            setPimage(null)
                            setPreview(null)
                          }}
                          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#54656f] transition hover:bg-[#e9edef] hover:text-[#111b21]"
                        >
                          <ArrowLeft size={20} />
                        </button>

                        <div className="flex min-w-0 items-center gap-2">
                          <Image size={18} className="text-[#00a884]" />

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-[#111b21]">Create media status</h3>

                            <p className="hidden text-[11px] text-[#8696a0] sm:block">Add a photo or video</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setStatusType(null)
                          setPimage(null)
                          setPreview(null)
                        }}
                        className="flex size-8 items-center justify-center rounded-full text-[#8696a0] transition hover:bg-[#e9edef] hover:text-[#111b21]"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* ================= BODY ================= */}
                    <div className="grid w-full grid-cols-1 lg:h-110 lg:grid-cols-2">
                      {/* ================= LEFT : MEDIA ================= */}
                      <div className="flex  items-center justify-center bg-[#111b21] p-3 h-86 sm:h-95 lg:h-full">
                        <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleImage} className="hidden" />

                        {preview ? (
                          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
                            {pimage?.type?.startsWith('video/') ? (
                              <video src={preview} controls className="max-h-102 max-w-full rounded-lg object-contain" />
                            ) : (
                              <img src={preview} alt="preview" className="max-h-102 max-w-full rounded-lg object-contain" />
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setPimage(null)
                                setPreview(null)
                              }}
                              className="absolute right-0 top-0 flex size-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                            >
                              <X size={17} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="group flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#3b4a54] bg-[#18252b] transition hover:border-[#00a884] hover:bg-[#202c33]"
                          >
                            <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-[#2a3942] transition group-hover:bg-[#d9fdd3]">
                              <Image size={28} strokeWidth={1.7} className="text-[#8696a0] transition group-hover:text-[#00a884]" />
                            </div>

                            <p className="text-sm font-semibold text-[#e9edef]">Select photo or video</p>

                            <p className="mt-1 text-xs text-[#8696a0]">Click to choose a file</p>
                          </button>
                        )}
                      </div>

                      {/* ================= RIGHT : DETAILS ================= */}
                      <div className="flex h-87 flex-col bg-[#ffffff] p-5 sm:h-95 sm:p-6 lg:h-full">
                        {/* Heading */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-full bg-[#e7fcef]">
                              <MessageCircle size={17} className="text-[#00a884]" />
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-[#111b21]">Status details</h4>

                              <p className="text-[11px] text-[#8696a0]">Add a description</p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="relative">
                          <MessageCircle size={17} className="absolute left-4 top-4 text-[#8696a0]" />

                          <textarea
                            name="description"
                            value={statusData.description}
                            onChange={handleChange}
                            placeholder="Add description..."
                            rows={4}
                            className="min-h-28 w-full resize-none rounded-xl border border-[#d1d7db] bg-[#f7f9fa] py-3 pl-11 pr-4 text-sm text-[#111b21] outline-none transition placeholder:text-[#8696a0] focus:border-[#00a884] focus:bg-white focus:ring-2 focus:ring-[#00a884]/10"
                          />
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Info */}
                        <div className="mb-3 rounded-xl border border-[#b7ead9] bg-[#e7fcef] p-3">
                          <div className="flex gap-3">
                            <Image size={17} className="mt-0.5 shrink-0 text-[#00a884]" />

                            <div>
                              <p className="text-xs font-semibold text-[#111b21]">Your status</p>

                              <p className="mt-1 text-[11px] leading-4 text-[#667781]">Photos and videos disappear after 24 hours.</p>
                            </div>
                          </div>
                        </div>

                        {/* Publish */}
                        <button type="button" onClick={handlePublish} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00a884] text-sm font-semibold text-white transition hover:bg-[#008f72] hover:shadow-md">
                          <Send size={17} />
                          Publish Status
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* status jova mate */}
        {selectedStatuses.length > 0 && (
          <div className="flex flex-1 items-center justify-center bg-[#111B21]">
            <div className="relative flex h-full w-full max-w-4xl flex-col">
              {/* top name & time */}
              <div className="absolute left-0 right-0 top-0 z-10 bg-[#111B21] p-5 text-white">
                <div className="mb-3 h-1 w-full overflow-hidden rounded bg-gray-500">
                  <div
                    className="h-full bg-white transition-all"
                    style={{
                      width: `${((currentStatusIndex + 1) / selectedStatuses.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedStatuses[currentStatusIndex]?.userId?.name}</p>

                    <p className="text-sm text-gray-300">
                      {new Date(selectedStatuses[currentStatusIndex]?.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedStatuses([])
                        setCurrentStatusIndex(0)
                      }}
                      className="rounded-full p-2 hover:bg-white/20"
                    >
                      <X size={25} />
                    </button>

                    {selectedStatuses[currentStatusIndex].userId._id == user?._id && (
                      <button onClick={handleDeleteStatus} className=" rounded-full p-2 hover:bg-white/20">
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* status mate nu content */}
              <div className="flex flex-1 items-center justify-center">
                {selectedStatuses[currentStatusIndex]?.type === 'text' ? (
                  <div
                    className="flex h-130 w-120 items-center justify-center px-10 text-center"
                    style={{
                      backgroundColor: selectedStatuses[currentStatusIndex]?.backgroundColor || '#000000',
                      color: selectedStatuses[currentStatusIndex]?.textColor || '#ffffff',
                    }}
                  >
                    <div>
                      <p className="text-4xl font-medium">{selectedStatuses[currentStatusIndex]?.content}</p>

                      {selectedStatuses[currentStatusIndex]?.description && (
                        <p
                          className="mt-5 text-lg"
                          style={{
                            color: selectedStatuses[currentStatusIndex]?.textColor || '#ffffff',
                            opacity: 0.75,
                          }}
                        >
                          {selectedStatuses[currentStatusIndex].description}
                        </p>
                      )}
                    </div>
                  </div>
                ) : selectedStatuses[currentStatusIndex]?.type === 'image' ? (
                  <div className="relative flex h-130 w-120 items-center justify-center bg-[#111B21]">
                    <img src={`http://localhost:3000${selectedStatuses[currentStatusIndex]?.content}`} alt="status" className="max-h-full max-w-full object-contain" />

                    {selectedStatuses[currentStatusIndex]?.description && <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-lg bg-black/60 px-5 py-3 text-center text-white">{selectedStatuses[currentStatusIndex].description}</div>}
                  </div>
                ) : selectedStatuses[currentStatusIndex]?.type === 'video' ? (
                  <div className="relative flex  h-130 w-120 items-center justify-center bg-black">
                    <video src={`http://localhost:3000${selectedStatuses[currentStatusIndex]?.content}`} controls={false} autoPlay loop className="max-h-full max-w-full object-contain z-40" />

                    {selectedStatuses[currentStatusIndex]?.description && (
                      <div className="absolute bottom-23 left-1/2 -translate-x-1/2   px-5 py-3 text-center text-white bg-black/20 w-full z-50">{selectedStatuses[currentStatusIndex].description}</div>
                    )}
                  </div>
                ) : null}

                {/*  */}
              </div>

              {/* PREVIOUS BUTTON */}
              {currentStatusIndex > 0 && (
                <button onClick={() => setCurrentStatusIndex((prev) => prev - 1)} className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-4 text-white hover:bg-black/70 ">
                  <ArrowLeft size={25} />
                </button>
              )}

              {/* NEXT BUTTON */}
              {currentStatusIndex < selectedStatuses.length - 1 && (
                <button onClick={() => setCurrentStatusIndex((prev) => prev + 1)} className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-4 text-white hover:bg-black/70">
                  <ArrowRight size={25} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
