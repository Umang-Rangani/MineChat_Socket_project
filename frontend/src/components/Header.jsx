import React from 'react'
import { CircleDashed, LogOut, MessageCircle, MoreVertical, Settings } from 'lucide-react'
import { useUser } from '../context/userProvider'

export default function Header() {
  const { logout, user } = useUser()

  

  // console.log(user)
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#2a3942] bg-[#202c33] px-5">
      {/* ================= LOGO ================= */}

      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#00a884]">
          <MessageCircle size={23} className="text-white" strokeWidth={2.5} />
        </div>

        <h1 className="text-xl font-semibold text-[#e9edef]">MineChat</h1>
      </div>

      {/* ================= HEADER MENU ================= */}

      <div className="flex items-center gap-1">
        {/* Chats */}

        <button type="button" className="flex items-center gap-2 rounded-lg px-4 py-2 text-[#e9edef] transition hover:bg-[#2a3942]">
          <MessageCircle size={20} />

          <span className="text-sm font-medium">Chats</span>
        </button>

        {/* Status */}

        <button type="button" className="flex items-center gap-2 rounded-lg px-4 py-2 text-[#aebac1] transition hover:bg-[#2a3942] hover:text-white">
          <CircleDashed size={20} />

          <span className="text-sm font-medium">Status</span>
        </button>

        {/* Settings */}

        <div className="rounded-full p-2.5 text-[#aebac1] transition hover:bg-[#2a3942] hover:text-white">
          {user && (
            <div className=" flex items-center font-mono gap-2 font-medium text-lg">
              <span>👋</span> <h1>{user.name}</h1>
            </div>
          )}
        </div>

        {/* Logout */}

        <button  onClick={logout} type="button" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#aebac1] transition hover:bg-red-500/10 hover:text-red-400">
          <LogOut size={20} />

          <span className="text-sm font-medium">Logout</span>
        </button>

      </div>
    </header>
  )
}
