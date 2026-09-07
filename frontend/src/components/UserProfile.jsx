import React, { useEffect, useState } from 'react'
import { useUser } from '../context/userProvider'
import { axiosInstance } from '../config/axiosConfig'
import { useNavigate } from 'react-router-dom'

export default function UserProfile() {
  const { user } = useUser()
  const [usersData, setUsersData] = useState([])
  const navigate = useNavigate()

  // ! Users Logic
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

  return (
    <div className="flex h-[calc(100vh-70px)] w-full flex-col overflow-hidden bg-[#f0f2f5]">
      {/* ================= MY PROFILE ================= */}
      <div className="shrink-0 bg-[#111b21] px-6 py-5">
        {/* Profile Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">👤 Profile</h1>

            <p className="mt-1 text-sm text-[#8696a0]">Your personal information</p>
          </div>

          {/* Edit Button */}
          <button onClick={() => navigate("/profile/update")} className="flex items-center gap-2 rounded-lg bg-[#00a884] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#008f72]">✏️ Edit</button>
        </div>

        {/* User Detail */}
        {user && (
          <div className="flex items-center gap-5">
            {/* Profile Image */}
            {!user.image ? (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[#dfe5e7] text-3xl font-semibold text-[#54656f]">{user.name?.charAt(0).toUpperCase()}</div>
            ) : (
              <div className="size-20 shrink-0 overflow-hidden rounded-full bg-[#dfe5e7]">
                <img src={`http://localhost:3000${user.image}`} alt={user.name} className="h-full w-full object-cover" />
              </div>
            )}

            {/* User Info */}
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-white">{user.name}</h2>

              <p className="mt-1 truncate text-sm text-[#8696a0]">📧 {user.email}</p>

              <p className="truncate text-sm text-[#8696a0]">📱 {user.number}</p>

              <p className="truncate text-sm text-[#8696a0]">🎂 Age: {user.age}</p>
            </div>
          </div>
        )}
      </div>

      {/* ================= CONTACT SECTION ================= */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Contact Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#d1d7db] bg-white px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-[#111b21]">👥 My Contacts</h1>

            <p className="mt-1 text-sm text-[#667781]">{usersData.length} contacts</p>
          </div>

          <div className="rounded-full bg-[#e7fcef] px-4 py-2 text-sm text-[#00a884]">💬 MineChat</div>
        </div>

        {/* ================= SCROLL AREA ================= */}
        <div className="whatsapp-scroll min-h-0 flex-1 overflow-y-auto px-5 pb-10">
          <div className="mx-auto grid w-full  grid-cols-1 gap-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
            {usersData.map((contact) => (
              <div key={contact._id} className="group flex min-w-0 cursor-pointer items-center gap-4 rounded-xl border border-[#e9edef] bg-white px-4 py-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                {/* Contact Image */}
                {!contact.image ? (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#dfe5e7] text-xl font-semibold text-[#54656f]">{contact.name?.charAt(0).toUpperCase()}</div>
                ) : (
                  <div className="size-14 shrink-0 overflow-hidden rounded-full">
                    <img src={`http://localhost:3000${contact.image}`} alt={contact.name} className="h-full w-full object-cover" />
                  </div>
                )}

                {/* Contact Details */}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-semibold text-[#111b21]">👤 {contact.name}</h2>

                  <p className="truncate text-sm text-[#667781]">📧 {contact.email}</p>

                  <p className="truncate text-sm text-[#667781]">📱 {contact.number}</p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
