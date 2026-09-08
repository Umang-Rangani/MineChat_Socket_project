import React, { useEffect, useRef, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { useUser } from '../context/userProvider'
import { Plus, Image, Video, Type, ArrowLeft, X, Send, ArrowRight } from 'lucide-react'
import { uploadFile } from '../utils/uploadFile'

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
  })

  // upload file mate
  const fileInputRef = useRef(null)
  const [pimage, setPimage] = useState(null)

  // img ne select krta create ma btava mte
  const [preview, setPreview] = useState(null)

  // ! get users
  const getUsersData = async () => {
    try {
      const res = await axiosInstance.get('/users')
      setUsersData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  // ! get status
  const getStatusData = async () => {
    try {
      const res = await axiosInstance.get('/status')

      // console.log('Status Data:', res.data)

      setStatusDataList(res.data)
    } catch (error) {
      console.log('Status Error:', error)
    }
  }

  useEffect(() => {
    getUsersData()
    getStatusData()
  }, [])

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
        }

        console.log('Text status data:', data)

        const res = await axiosInstance.post('/status', data)

        console.log('Text Status Created:', res.data)

        handleCloseCreate()
        return
      }

      // IMAGE / VIDEO STATUS
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

  // console.log(statusView);
  console.log("xxxxxx", selectedStatuses[currentStatusIndex]);

  return (
    <div className="flex h-screen w-full bg-[#F5F5F0]">
      {/* LEFT SIDEBAR */}

      <div className="flex w-90 flex-col border-r border-gray-200">
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

      {/* MAIN AREA */}

      <div className="flex flex-1 bg-[#f8f7f6]">
        {/* HOME VIEW */}

        {!selectedStatuses.length > 0 && statusView === 'home' && (
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

        {/* create image & text input jova mate */}
        {!selectedStatuses.length > 0 &&  statusView === 'create' && (
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
              {/* SELECT TYPE */}

              {!statusType && (
                <div className="w-full max-w-3xl">
                  <h3 className="mb-8 text-center text-2xl font-medium">What do you want to share?</h3>

                  <div className="grid grid-cols-2 gap-8">
                    {/* PHOTO / VIDEO BOX */}
                    <button onClick={handleMediaStatus} className="group flex min-h-65 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white transition hover:border-[#00a884] hover:shadow-md">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 transition group-hover:bg-[#d9fdd3]">
                        <Image size={38} className="text-gray-600 group-hover:text-[#00a884]" />
                      </div>

                      <h4 className="text-xl font-medium">Photos & Videos</h4>

                      <p className="mt-2 text-gray-500">Share an image or video</p>
                    </button>

                    {/* TEXT BOX */}
                    <button onClick={handleTextStatus} className="group flex min-h-65 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white transition hover:border-[#00a884] hover:shadow-md">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 transition group-hover:bg-[#d9fdd3]">
                        <Type size={38} className="text-gray-600 group-hover:text-[#00a884]" />
                      </div>

                      <h4 className="text-xl font-medium">Text Status</h4>

                      <p className="mt-2 text-gray-500">Share something with your contacts</p>
                    </button>
                  </div>
                </div>
              )}

              {/* TEXT FORM */}

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

              {/* MEDIA FORM */}

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
                        {pimage?.type?.startsWith('video/') ? <video src={preview} controls className="max-h-100 w-full object-contain" /> : <img src={preview} alt="preview" className="max-h-100 w-full object-contain" />}

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

                  <button
                    onClick={() => {
                      setSelectedStatuses([])
                      setCurrentStatusIndex(0)
                    }}
                    className="rounded-full p-2 hover:bg-white/20"
                  >
                    <X size={25} />
                  </button>
                </div>
              </div>

              {/* status mate nu content */}
              <div className="flex flex-1 items-center justify-center">


                {selectedStatuses[currentStatusIndex]?.type === 'text' ? (
                  <div
                    className="flex h-full w-full items-center justify-center px-10 text-center text-white"
                    style={{
                      backgroundColor: selectedStatuses[currentStatusIndex]?.backgroundColor || '#000000',
                    }}
                  >
                    <div>
                      <p className="text-4xl font-medium">{selectedStatuses[currentStatusIndex]?.content}</p>

                      {selectedStatuses[currentStatusIndex]?.description && <p className="mt-5 text-lg text-gray-300">{selectedStatuses[currentStatusIndex].description}</p>}
                    </div>
                  </div>
                ) : selectedStatuses[currentStatusIndex]?.type === 'image' ? (
                  <div className="relative flex h-140 w-120 items-center justify-center bg-[#111B21]">
                    <img src={`http://localhost:3000${selectedStatuses[currentStatusIndex]?.content}`} alt="status" className="max-h-full max-w-full object-contain" />

                    {selectedStatuses[currentStatusIndex]?.description && <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-lg bg-black/60 px-5 py-3 text-center text-white">{selectedStatuses[currentStatusIndex].description}</div>}
                  </div>
                ) : selectedStatuses[currentStatusIndex]?.type === 'video' ? (
                  <div className="relative flex h-full w-full items-center justify-center bg-black">
                    <video src={`http://localhost:3000${selectedStatuses[currentStatusIndex]?.content}`} controls autoPlay className="max-h-full max-w-full object-contain" />

                    {selectedStatuses[currentStatusIndex]?.description && <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-lg bg-black/60 px-5 py-3 text-center text-white">{selectedStatuses[currentStatusIndex].description}</div>}
                  </div>
                ) : null}


{/*  */}


                
              </div>

              {/* PREVIOUS BUTTON */}
              {currentStatusIndex > 0 && (
                <button onClick={() => setCurrentStatusIndex((prev) => prev - 1)} className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-4 text-white hover:bg-black/70">
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
