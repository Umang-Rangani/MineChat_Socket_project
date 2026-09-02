import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from './context/userProvider'

export default function GuestRoute() {
  const { user, loading } = useUser()

  if (loading) {
    return <div>Loading...</div>
  }

  return user ? <Navigate to="/" replace /> : <Outlet />
}
