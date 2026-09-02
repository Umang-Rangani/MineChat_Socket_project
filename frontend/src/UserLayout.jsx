import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'

export default function UserLayout() {
  return (
    <div className="h-screen overflow-hidden bg-[#111b21]">
      <Header />

      <main className="flex h-[calc(100vh-64px)] w-full">
        <Outlet />
      </main>
    </div>
  )
}
