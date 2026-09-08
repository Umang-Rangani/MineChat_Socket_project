import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Search, X, Video, Phone, Smile, Paperclip, Mic, Send, CheckCheck, ArrowLeft, MoreVertical } from 'lucide-react'
import { useUser } from '../context/userProvider'
import { io } from 'socket.io-client'
import { useSearchParams } from 'react-router-dom'

// ! socket
const socket = io('http://localhost:3000', {
  withCredentials: true,
})

export default function UserList() {
  const { user } = useUser()

  const [usersData, setUsersData] = useState([])
  const [search, setSearch] = useState('')

  const [messages, setMessages] = useState([])

  // 2nd person
  // const [chatUserId, setSelectedId] = useState(null)

  const [message, setMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState([])


  // ! hook used list card & profile card pr click krta chat aave 
  const [searchParams, setSearchParams] = useSearchParams()
  const chatUserId = searchParams.get('userId') //click krta 2nd person id

  // ! users Logic
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

  // ! users ma input searching kre
  const filteredUsers = usersData.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
  // console.log('filteredUsers', filteredUsers)

  // ! chating Logic
  // ! SOCKET CONNECT + JOIN
  useEffect(() => {
    if (!user?._id) return

    // RECEIVE MESSAGE
    const receiveMessage = (data) => {
      console.log('Message received:', data)

      setMessages((prev) => {
        // duplicate message avoid
        if (prev.some((msg) => msg._id === data._id)) {
          return prev
        }

        return [...prev, data]
      })
    }

    // ALL ONLINE USERS
    const handleOnlineUsers = ({ users }) => {
      // console.log('Online users:', users)
      setOnlineUsers(users)
    }

    // USER ONLINE
    const handleUserOnline = ({ userId }) => {
      console.log('User online:', userId)

      setOnlineUsers((prev) => {
        if (prev.includes(userId)) {
          return prev
        }

        return [...prev, userId]
      })
    }

    // USER OFFLINE
    const handleUserOffline = ({ userId, lastSeen }) => {
      console.log('User offline:', userId, lastSeen)

      setOnlineUsers((prev) => prev.filter((id) => id !== userId))

      setUsersData((prev) => prev.map((u) => (u._id === userId ? { ...u, lastSeen } : u)))
    }

    // IMPORTANT: listeners first
    socket.on('privateMessage', receiveMessage)
    socket.on('onlineUsers', handleOnlineUsers)
    socket.on('userOnline', handleUserOnline)
    socket.on('userOffline', handleUserOffline)

    // THEN join
    socket.emit('joinChat', user._id)

    return () => {
      socket.off('privateMessage', receiveMessage)
      socket.off('onlineUsers', handleOnlineUsers)
      socket.off('userOnline', handleUserOnline)
      socket.off('userOffline', handleUserOffline)
    }
  }, [user?._id])


  // ! list card & profile card pr click krta chat aave
  useEffect(() => {
    if (!chatUserId || !user?._id) return

    const getMessages = async () => {
      try {
        const res = await axiosInstance.get(`/message/${user._id}/${chatUserId}`)

        setMessages(res.data)
      } catch (error) {
        console.log('Get Messages Error:', error)
      }
    }

    getMessages()
  }, [chatUserId, user?._id])
  // SELECT USER
  const handleClick = (userId) => {
    setSearchParams({ userId })
    setMessage('')
  }



  // SEND MESSAGE
  const sendMessage = async (e) => {
    e.preventDefault()

    // console.log('sending')

    if (!message.trim()) return
    if (!chatUserId) return
    if (!user?._id) return

    // ! privateMessage send => POST

    socket.emit('privateMessage', {
      sender: user._id,
      receiver: chatUserId,
      content: message.trim(),
    })

    getUsersData()

    setMessage('')
  }

  // CURRENT CHAT MESSAGES
  const currentMessages = messages.filter((msg) => {
    return (msg.sender === user?._id && msg.receiver === chatUserId) || (msg.sender === chatUserId && msg.receiver === user?._id)
  })

  // SELECTED USER
  const selectedUser = usersData.find((user) => user._id === chatUserId)

  return (
    <div className="flex h-[calc(100vh-64px)] w-full">
      {/* LEFT - USERS */}

      <div className="flex h-full w-90 shrink-0 flex-col border-r border-[#d1d7db] bg-white">
        {/* LEFT HEADER */}

        <div className="flex h-18 shrink-0 items-center justify-between bg-[#f0f2f5] px-5">
          <h1 className="text-[22px] font-medium text-[#111b21]">Chats</h1>
        </div>

        {/* SEARCH */}

        <div className="shrink-0 bg-white px-3 py-2">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4 text-[#54656f]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search or start a new chat"
              className="h-10 w-full rounded-lg bg-[#f0f2f5] pl-11 pr-10 text-sm text-[#111b21] outline-none placeholder:text-[#667781]"
            />

            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 text-[#54656f]">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* USERS SCROLL */}

        <div className="whatsapp-scroll min-h-0 flex-1 overflow-y-auto pb-10">
          {filteredUsers.map((user) => {
            // console.log(user._id === chatUserId ? "black" : "green");
            // console.log(user)
            return (
              <div key={user._id} onClick={() => handleClick(user._id)} className={`flex h-18 cursor-pointer items-center gap-3 px-4 transition ${chatUserId === user._id ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f6f6]'}`}>
                <div className="relative">
                  {!user.image ? (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#dfe5e7] text-lg font-semibold text-[#54656f]">{user.name?.charAt(0).toUpperCase()}</div>
                  ) : (
                    <div className="size-12 shrink-0 overflow-hidden rounded-full bg-[#dfe5e7]">
                      <img src={`http://localhost:3000${user.image}`} alt={user.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                    </div>
                  )}

                  {onlineUsers.includes(user._id) && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-[#00a884]" />}
                </div>

                <div className="min-w-0 flex-1 border-b border-[#e9edef] py-3 ">
                  <div className="flex items-center justify-between">
                    <h2 className={`truncate text-[16px] ${!chatUserId === user._id && user.lastMessage?.content ? 'text-green-500 font-bold' : 'text-[#111b21]'}`}>{user.name}</h2>

                    {/* <span className="text-[11px] text-[#667781]">10:30 AM</span> */}
                    <span className={`text-[11px] text-[#667781]`}>
                      {user.lastMessage?.createdAt
                        ? new Date(user.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                  </div>

                  {/* <p className="mt-1 truncate text-sm text-[#667781]">Good Morning</p> */}
                  <p className={`mt-1 truncate text-sm text-[#667781]`}>{user.lastMessage?.content || 'No messages yet'}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* RIGHT - CHAT */}

      <div className="flex min-w-0 flex-1 flex-col bg-[#efeae2] pb-10">
        {!chatUserId ? (
          /* ================= EMPTY CHAT ================= */

          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-[#202c33]">
                <Send size={35} className="text-[#25D366]" />
              </div>

              <h2 className="text-xl font-medium text-[#e9edef]">Select a chat</h2>

              <p className="mt-2 text-sm text-[#8696a0]">Select a user to start chatting</p>
            </div>
          </div>
        ) : (
          <>
            {/* CHAT HEADER */}
            <div className="flex h-18 shrink-0 items-center justify-between border-b border-[#d1d7db] bg-[#f0f2f5] px-4">
              <div className="flex min-w-0 items-center gap-3">
                {/* <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#dfe5e7] text-lg font-semibold text-[#54656f]">{selectedUser?.name?.charAt(0).toUpperCase()}</div> */}

                {!selectedUser?.image ? (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dfe5e7] text-lg font-semibold text-[#54656f]">{selectedUser?.name?.charAt(0).toUpperCase()}</div>
                ) : (
                  <div className="size-12 shrink-0 overflow-hidden rounded-full bg-[#dfe5e7]">
                    <img src={`http://localhost:3000${selectedUser.image}`} alt={selectedUser.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                  </div>
                )}

                <div>
                  <h2 className="truncate text-[17px] font-medium text-[#111b21]">{selectedUser?.name}</h2>

                  <p className={`text-xs ${onlineUsers.includes(chatUserId) ? 'text-[#00a884]' : 'text-[#667781]'}`}>
                    {onlineUsers.includes(chatUserId)
                      ? 'online'
                      : selectedUser?.lastSeen
                        ? `last seen ${new Date(selectedUser.lastSeen).toLocaleString([], {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`
                        : 'offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* MESSAGES ONLY SCROLL */}
            <div className="chat-scroll min-h-0 flex-1 overflow-y-auto px-8 py-6">
              <div className="mx-auto flex max-w-5xl flex-col gap-2">
                <div className="my-3 flex justify-center">
                  <span className="rounded-lg bg-white px-3 py-1 text-xs text-[#667781] shadow-sm">TODAY</span>
                </div>

                {currentMessages.map((msg, index) => {
                  const isMine = msg.sender === user?._id

                  return (
                    <div key={msg._id || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[65%] rounded-lg px-3 py-2 shadow-sm ${isMine ? 'bg-[#d9fdd3]' : 'bg-white'}`}>
                        <div className="flex items-end gap-2">
                          <p className="wrap-break-words text-[14px] leading-5 text-[#111b21]">{msg.content}</p>

                          <div className="flex shrink-0 items-center gap-1">
                            <span className="text-[10px] text-[#667781]">10.30 AM</span>

                            {isMine && <CheckCheck size={15} className="text-[#53bdeb]" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* MESSAGE INPUT FIXED */}
            <div className="shrink-0 bg-[#f0f2f5] px-4 py-3">
              <form onSubmit={sendMessage} className="flex items-center gap-3">
                <button type="button" className="shrink-0 text-[#54656f] hover:text-[#111b21]">
                  <Smile size={25} />
                </button>

                <button type="button" className="shrink-0 text-[#54656f] hover:text-[#111b21]">
                  <Paperclip size={22} />
                </button>

                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" className="h-11 flex-1 rounded-lg bg-white px-4 text-sm text-[#111b21] outline-none placeholder:text-[#667781]" />

                {message.trim() ? (
                  <button type="submit" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white transition hover:bg-[#008f72]">
                    <Send size={19} />
                  </button>
                ) : (
                  <button type="button" className="flex size-11 shrink-0 items-center justify-center rounded-full text-[#54656f]">
                    <Mic size={22} />
                  </button>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
