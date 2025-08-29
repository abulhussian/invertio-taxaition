"use client"

import { useAuth } from "../contexts/AuthContext"
import { navigate } from "../utils/navigation"
import { useEffect } from "react"

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login")
    }
  }, [currentUser, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return currentUser ? children : null
}

export default ProtectedRoute
