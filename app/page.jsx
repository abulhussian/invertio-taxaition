"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { AuthProvider, useAuth } from "../src/contexts/AuthContext"
import ErrorBoundary from "../src/components/ErrorBoundary"
import { useRouter } from "next/navigation"

// Import all page components
import Login from "../src/pages/Auth/Login"
import Register from "../src/pages/Auth/Register"
import Dashboard from "../src/pages/Dashboard"
import Returns from "../src/pages/Returns"
import Documents from "../src/pages/Documents"
import ActivityLogs from "../src/pages/ActivityLogs"
import Payments from "../src/pages/Payments"
import Settings from "../src/pages/Settings"

const SimpleRouter = () => {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    const pathname = window.location.pathname
    const isAuthPage = pathname === "/login" || pathname === "/register"
    
    if (!user && !isAuthPage) {
      router.push("/login")
      return
    }
    if (user && (pathname === "/" || isAuthPage)) {
      router.push("/dashboard")
      return
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const renderPage = () => {
    const pathname = window.location.pathname
    
    switch (pathname) {
      case "/login":
        return <Login />
      case "/register":
        return <Register />
      case "/dashboard":
        return user ? <Dashboard /> : <Login />
      case "/dashboard/returns":
        return user ? <Returns /> : <Login />
      case "/dashboard/documents":
        return user ? <Documents /> : <Login />
      case "/dashboard/activity-logs":
        return user ? <ActivityLogs /> : <Login />
      case "/dashboard/payments":
        return user ? <Payments /> : <Login />
      case "/dashboard/settings":
        return user ? <Settings /> : <Login />
      default:
        return user ? <Dashboard /> : <Login />
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {renderPage()}
    </motion.div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SimpleRouter />
      </AuthProvider>
    </ErrorBoundary>
  )
}