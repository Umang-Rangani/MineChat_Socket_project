import React, { useEffect, useState } from 'react'
import { useUser } from '../context/userProvider'
import { axiosInstance } from '../config/axiosConfig'
import { Link, useNavigate } from 'react-router-dom'
import UserProfileShimmer from './UserProfileShimmer'
import { Cake, Mail, Pencil, Phone, UserRound } from 'lucide-react'
import { Users, MessageCircle } from 'lucide-react'

export default function UserProfile() {
  const { user } = useUser()
  const [usersData, setUsersData] = useState([])
  const navigate = useNavigate()

  const [shimmer, setShimmer] = useState(false)

  // ! Users Logic
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

  useEffect(() => {
    getUsersData()
  }, [])

  if (shimmer) {
    return <UserProfileShimmer />
  }

  return (
    <div className="flex h-[calc(100vh-70px)] w-full flex-col overflow-hidden bg-[#f0f2f5]">
      {/* ================= MY PROFILE ================= */}
      <div className="shrink-0 bg-[#111b21] px-6 py-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UserRound size={19} className="text-[#00a884]" />

              <h1 className="text-lg font-semibold text-white">Profile</h1>
            </div>

            <p className="mt-0.5 text-xs text-[#8696a0]">Your personal information</p>
          </div>

          {/* Edit Button */}
          <button onClick={() => navigate('/profile/update')} className="flex items-center gap-1.5 rounded-lg bg-[#00a884] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#008f72]">
            <Pencil size={14} />
            Edit
          </button>
        </div>

        {/* User */}
        {user && (
          <div className="flex items-center gap-4 rounded-lg border border-[#202c33] bg-[#18252b] px-4 py-3">
            {/* Profile Image */}
            {!user.image ? (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#dfe5e7] text-2xl font-semibold text-[#54656f]">{user.name?.charAt(0).toUpperCase()}</div>
            ) : (
              <div className="size-16 shrink-0 overflow-hidden rounded-full bg-[#dfe5e7] ring-2 ring-[#00a884]/30">
                <img src={`http://localhost:3000${user.image}`} alt={user.name} className="h-full w-full object-cover" />
              </div>
            )}

            {/* User Info */}
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold text-white">{user.name}</h2>

              <div className="mt-1 flex items-center gap-2">
                <Mail size={13} className="shrink-0 text-[#8696a0]" />
                <span className="truncate text-xs text-[#d1d7db]">{user.email}</span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <Phone size={13} className="shrink-0 text-[#8696a0]" />
                <span className="truncate text-xs text-[#d1d7db]">{user.number}</span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <Cake size={13} className="shrink-0 text-[#8696a0]" />
                <span className="text-xs text-[#d1d7db]">Age: {user.age}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= CONTACT SECTION ================= */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f7f8]">
        {/* Contact Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#d9e0e3] bg-white px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#e7fcef]">
                <Users size={20} className="text-[#00a884]" />
              </div>

              <h1 className="text-xl font-semibold text-[#111b21]">My Contacts</h1>
            </div>

            <p className="mt-1 ml-11 text-sm text-[#667781]">{usersData.length} contacts</p>
          </div>

          {/* MineChat */}
          <div className="flex items-center gap-2 rounded-full border border-[#b7ead9] bg-[#e7fcef] px-4 py-2 text-sm font-medium text-[#008f72]">
            <MessageCircle size={17} />
            MineChat
          </div>
        </div>

        {/* Scroll Area */}
        <div className="whatsapp-scroll min-h-0 flex-1 overflow-y-auto px-5 pb-10">
          <div className="mx-auto grid w-full grid-cols-1 gap-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
            {usersData.map((contact) => (
              <Link
                to={`/?userId=${contact._id}`}
                key={contact._id}
                className="group flex min-w-0 items-center gap-4 rounded-xl border border-[#e1e7e9] bg-white px-4 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b7ead9] hover:bg-[#fbfffd] hover:shadow-md"
              >
                {/* Contact Image */}
                {!contact.image ? (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#dfe5e7] text-xl font-semibold text-[#54656f] ring-2 ring-[#f0f2f5] transition group-hover:ring-[#b7ead9]">
                    {contact.name?.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-[#f0f2f5] transition group-hover:ring-[#b7ead9]">
                    <img src={`http://localhost:3000${contact.image}`} alt={contact.name} className="h-full w-full object-cover" />
                  </div>
                )}

                {/* Contact Details */}
                <div className="min-w-0 flex-1">
                  {/* Name */}
                  <div className="flex items-center gap-2">
                    <UserRound size={15} className="shrink-0 text-[#00a884]" />

                    <h2 className="truncate text-base font-semibold text-[#111b21]">{contact.name}</h2>
                  </div>

                  {/* Email */}
                  <div className="mt-1.5 flex min-w-0 items-center gap-2">
                    <Mail size={14} className="shrink-0 text-[#8696a0]" />

                    <p className="truncate text-sm text-[#667781]">{contact.email}</p>
                  </div>

                  {/* Phone */}
                  <div className="mt-1 flex min-w-0 items-center gap-2">
                    <Phone size={14} className="shrink-0 text-[#8696a0]" />

                    <p className="truncate text-sm text-[#667781]">{contact.number}</p>
                  </div>
                </div>

                {/* Arrow / Accent */}
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] text-[#8696a0] transition group-hover:bg-[#e7fcef] group-hover:text-[#00a884]">→</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
