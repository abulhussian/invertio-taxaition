"use client"
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import ProtectedRoute from "../routes/ProtectedRoute"
import { useAuth } from "../contexts/AuthContext"

// Mock UI components (replace with your actual components)
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>{children}</div>
)

const CardHeader = ({ children }) => <div className="mb-4">{children}</div>
const CardTitle = ({ children }) => <h3 className="text-lg font-medium text-gray-900">{children}</h3>
const CardDescription = ({ children }) => <p className="text-sm text-gray-500">{children}</p>
const CardContent = ({ children }) => <div>{children}</div>

const Button = ({ children, asChild, className = "", ...props }) => {
  if (asChild) {
    return <Link className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`} {...props}>{children}</Link>
  }
  return <button className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`} {...props}>{children}</button>
}

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
)

// Mock icons
const FileText = () => <span>📄</span>
const FolderOpen = () => <span>📂</span>
const CreditCard = () => <span>💳</span>
const TrendingUp = () => <span>📈</span>
const Clock = () => <span>⏰</span>
const Plus = () => <span>+</span>
const ArrowRight = () => <span>→</span>
const ActivityIcon = () => <span>🔔</span>

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [returns, setReturns] = useState([])
  const [invoices, setInvoices] = useState([])
  const [activityLogs, setActivityLogs] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    // Load data from localStorage
    const storedReturns = JSON.parse(localStorage.getItem("returns") || "[]")
    const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]")
    
    setReturns(storedReturns)
    setInvoices(storedInvoices)
    setActivityLogs(storedActivities)
  }, [])

  const stats = {
    totalReturns: returns.length,
    pendingReturns: returns.filter((r) => r.status === "Pending").length,
    completedReturns: returns.filter((r) => r.status === "Completed").length,
    totalInvoices: invoices.length,
    unpaidInvoices: invoices.filter((i) => i.status === "Unpaid").length,
    totalAmount: invoices.reduce((sum, invoice) => sum + invoice.amount, 0),
    unpaidAmount: invoices.filter((i) => i.status === "Unpaid").reduce((sum, invoice) => sum + invoice.amount, 0),
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Review":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const recentReturns = returns.slice(0, 3)
  const recentActivity = activityLogs.slice(0, 5)

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || user?.email}!</h1>
                  <p className="text-gray-600">
                    Here's what's happening with your taxation dashboard today.
                  </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Button className="w-fit">
                    <Plus />
                    <span className="ml-2">New Tax Return</span>
                  </Button>
                </motion.div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Total Returns",
                    value: stats.totalReturns,
                    subtitle: `${stats.pendingReturns} pending, ${stats.completedReturns} completed`,
                    icon: FileText,
                    color: "text-blue-600",
                    delay: 0.1,
                  },
                  {
                    title: "Pending Returns",
                    value: stats.pendingReturns,
                    subtitle: "Require attention",
                    icon: Clock,
                    color: "text-yellow-600",
                    delay: 0.2,
                  },
                  {
                    title: "Outstanding Invoices",
                    value: stats.unpaidInvoices,
                    subtitle: `${formatCurrency(stats.unpaidAmount)} due`,
                    icon: CreditCard,
                    color: "text-red-600",
                    delay: 0.3,
                  },
                  {
                    title: "Total Revenue",
                    value: formatCurrency(stats.totalAmount),
                    subtitle: "This year",
                    icon: TrendingUp,
                    color: "text-green-600",
                    delay: 0.4,
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stat.delay }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group"
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                        <stat.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold ${stat.color}`}>
                          {typeof stat.value === "number" ? stat.value : stat.value}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Returns */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Recent Tax Returns</CardTitle>
                        <CardDescription>Your latest tax return filings</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/returns">
                          View All
                          <ArrowRight className="ml-2" />
                        </Link>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentReturns.length > 0 ? (
                          recentReturns.map((returnItem) => (
                            <motion.div
                              key={returnItem.id}
                              whileHover={{ scale: 1.01 }}
                              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FileText />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Form {returnItem.type}</p>
                                  <p className="text-sm text-gray-500">
                                    Created {formatDate(returnItem.createdDate)} • {returnItem.documentCount || 0} documents
                                  </p>
                                </div>
                              </div>
                              <Badge className={getStatusColor(returnItem.status)}>{returnItem.status}</Badge>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <FileText />
                            <p className="text-gray-500 mt-2">No tax returns yet</p>
                            <Button className="mt-2">
                              <Link href="/returns">Create Your First Return</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest updates and changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                          recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <ActivityIcon />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                <p className="text-xs text-gray-500 truncate">{activity.details}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(activity.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <ActivityIcon />
                            <p className="text-sm text-gray-500 mt-2">No recent activity</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks to get you started</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                      asChild
                    >
                      <Link href="/returns">
                        <FileText />
                        <span className="font-medium">New Tax Return</span>
                        <span className="text-xs text-gray-500">Start a new filing</span>
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                      asChild
                    >
                      <Link href="/documents">
                        <FolderOpen />
                        <span className="font-medium">Upload Documents</span>
                        <span className="text-xs text-gray-500">Add supporting files</span>
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                      asChild
                    >
                      <Link href="/payments">
                        <CreditCard />
                        <span className="font-medium">View Invoices</span>
                        <span className="text-xs text-gray-500">Check payment status</span>
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                      asChild
                    >
                      <Link href="/activity-logs">
                        <ActivityIcon />
                        <span className="font-medium">Activity History</span>
                        <span className="text-xs text-gray-500">Track all changes</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Dashboard