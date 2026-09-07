import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './UserLayout'
import GuestRoute from './GuestRoute'
import SignUp from './pages/SignUp'
import ProtectedRoute from './ProtectedRoute'
import UserList from './components/UserList'
import Login from './pages/LogIn'
import UserProfile from './components/UserProfile'
import UserProfileChange from './components/UserProfileChange'

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            {/* ================= GUEST ROUTES ================= */}

            <Route element={<GuestRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
            </Route>

            {/* ================= PROTECTED ROUTES ================= */}

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<UserList />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/update" element={<UserProfileChange />} />
            </Route>
          </Route>

          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
