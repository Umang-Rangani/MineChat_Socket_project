import { createContext, useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // GET CURRENT USER
  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get('/users/profile')

      setUser(response.data.user)
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null)
        return
      }

      console.error('PROFILE ERROR:', error.response?.data || error.message)

      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // CHECK LOGIN ON REFRESH
  useEffect(() => {
    console.log('AUTH CONTEXT LOADED')

    getCurrentUser()
  }, [])

  // LOGOUT
  const logout = async () => {
    try {
      await axiosInstance.post('/users/logout')

      setUser(null)
    } catch (error) {
      console.error('Logout Error:', error.response?.data || error.message)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
