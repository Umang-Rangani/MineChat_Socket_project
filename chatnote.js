// import React, { useEffect, useState } from 'react'
// import { axiosInstance } from '../config/axiosConfig'
// import { Search, X } from 'lucide-react'

// export default function UserList() {
//   const [usersData, setUsersData] = useState([])
//   const [search, setSearch] = useState('')
//   const [selectedId, setSelectedId] = useState(null)

//   const getUsersData = async () => {
//     try {
//       const res = await axiosInstance.get('/users')
//       setUsersData(res.data)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     getUsersData()
//   }, [])

//   const filteredUsers = usersData.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))

//   const handleClick = async (userId) => {
//     setSelectedId(userId)

//     try {
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   return (
//     <div className="grid  grid-cols-12 bg-[#111b21] min-h-screen">
//       {/* users */}
//       <div className="col-span-3 h-full overflow-y-auto bg-[#111b21]">
//         {/* ================= SEARCH ================= */}
//         <div className="sticky top-0 z-10 bg-[#111b21] px-3 py-3">
//           <div className="relative flex items-center">
//             <Search size={18} className="absolute left-4 text-[#8696a0]" />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search or start new chat"
//               className="w-full rounded-lg bg-[#202c33] py-2.5 pl-11 pr-10 text-sm text-[#e9edef] outline-none placeholder:text-[#8696a0] focus:ring-1 focus:ring-[#25D366]"
//             />

//             {search && (
//               <button type="button" onClick={() => setSearch('')} className="absolute right-3 text-[#8696a0] transition hover:text-white">
//                 <X size={18} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ================= USERS ================= */}
//         {filteredUsers.map((user) => {
//           return (
//             <div onClick={() => handleClick(user._id)} key={user._id} className="flex cursor-pointer items-center gap-3 border-b border-[#2a3942] px-4 py-3 transition hover:bg-[#202c33]">
//               {/* AVATAR */}
//               <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-lg font-semibold text-[#111b21]">{user.name?.charAt(0).toUpperCase()}</div>

//               {/* USER INFO */}
//               <div className="min-w-0 flex-1">
//                 <div className="flex items-center justify-between">
//                   <h1 className="truncate text-[16px] font-medium text-[#e9edef]">{user.name}</h1>

//                   <span className="text-xs text-[#8696a0]">10:30 AM</span>
//                 </div>

//                 <p className="mt-1 truncate text-sm text-[#8696a0]">Good Morning</p>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* chating */}
//       <div className="col-span-9 bg-green-50">{selectedId ? selectedId : 'Selected User'}</div>
//     </div>
//   )
// }
