"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("demoUser")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (user) => {
    setCurrentUser(user)
    localStorage.setItem("demoUser", JSON.stringify(user))
  }

  const logout = async () => {
    try {
      setCurrentUser(null)
      localStorage.removeItem("demoUser")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value = {
    currentUser,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
