import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from './context/userProvider'

export default function ProtectedRoute() {
  const { user, loading } = useUser()

  // Profile API નું result આવે ત્યાં સુધી wait
  if (loading) {
    return <div>Loading...</div>
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
