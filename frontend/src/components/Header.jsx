import React from 'react'
import { CircleDashed, LogOut, MessageCircle, MoreVertical, Settings } from 'lucide-react'
import { useUser } from '../context/userProvider'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const { logout, user } = useUser()
  const navigate = useNavigate()

  const userHandle = () => {
    navigate('/profile')
  }

  // console.log("HeaderUser",user) 
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#2a3942] bg-[#202c33] px-5">
      {/* ================= LOGO ================= */}

      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#00a884]">
          <MessageCircle size={23} className="text-white" strokeWidth={2.5} />
        </div>

        <Link to={"/"} className="text-xl font-semibold text-[#e9edef]">MineChat</Link>
      </div>

      {/* ================= HEADER MENU ================= */}

      <div className="flex items-center gap-1">
        {/* Chats */}

        <button onClick={() => navigate("/")} type="button" className="flex items-center gap-2 rounded-lg px-4 py-2 text-[#e9edef] transition hover:bg-[#2a3942]">
          <MessageCircle size={20} />

          <span className="text-sm font-medium">Chats</span>
        </button>

        {/* Status */}

        <Link to={"/status"} type="button" className="flex items-center gap-2 rounded-lg px-4 py-2 text-[#aebac1] transition hover:bg-[#2a3942] hover:text-white">
          <CircleDashed size={20} />

          <span className="text-sm font-medium">Status</span>
        </Link>

        {/* Settings */}

        <div onClick={userHandle} className="rounded-full p-2.5 text-[#aebac1] transition hover:bg-[#2a3942] hover:text-white">
          {user && (
            <div className="flex items-center gap-3">
              {/* Profile Image */}
              {!user.image ? (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dfe5e7] text-lg font-semibold text-[#54656f]">{user.name?.charAt(0).toUpperCase()}</div>
              ) : (
                
                <div className="size-12 shrink-0 overflow-hidden rounded-full bg-[#dfe5e7]">
                  <img src={`http://localhost:3000${user.image}`} alt={user.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                </div>
              )}

              {/* User Info */}
              <div className="flex min-w-0 flex-col">
                <h1 className="truncate text-base font-semibold text-white">{user.name}</h1>

                <p className="truncate text-sm font-normal text-[#8696a0]">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}

        <button onClick={logout} type="button" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#aebac1] transition hover:bg-red-500/10 hover:text-red-400">
          <LogOut size={20} />

          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  )
}
