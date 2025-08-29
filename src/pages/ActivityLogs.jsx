"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"

const ActivityLogs = () => {
  const { currentUser } = useAuth()
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [filterType, setFilterType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Load activities from localStorage
    const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]")
    const userActivities = storedActivities.filter((activity) => activity.userId === currentUser?.uid)
    setActivities(userActivities)
    setFilteredActivities(userActivities)
  }, [currentUser])

  useEffect(() => {
    let filtered = activities

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((activity) => activity.type === filterType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (activity) =>
          activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.details.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    setFilteredActivities(filtered)
  }, [activities, filterType, searchTerm])

  const getActivityIcon = (type) => {
    switch (type) {
      case "auth":
        return "🔐"
      case "return":
        return "📋"
      case "document":
        return "📄"
      case "payment":
        return "💳"
      case "system":
        return "⚙️"
      default:
        return "📝"
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case "auth":
        return "bg-blue-100 text-blue-800"
      case "return":
        return "bg-green-100 text-green-800"
      case "document":
        return "bg-purple-100 text-purple-800"
      case "payment":
        return "bg-yellow-100 text-yellow-800"
      case "system":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return date.toLocaleDateString() + " at " + date.toLocaleTimeString()
    }
  }

  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "auth", label: "Authentication" },
    { value: "return", label: "Tax Returns" },
    { value: "document", label: "Documents" },
    { value: "payment", label: "Payments" },
    { value: "system", label: "System" },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Logs</h1>
        <p className="text-gray-600">Track all activities and changes in your account</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Activities</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by description or details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border"
      >
        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Start using the system to see your activity history here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor(activity.type)}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{activity.description}</h3>
                      <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                    {activity.metadata && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100">
                          IP: {activity.metadata.ip || "Unknown"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Statistics */}
      {filteredActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {activityTypes.slice(1).map((type) => {
              const count = activities.filter((a) => a.type === type.value).length
              return (
                <div key={type.value} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{type.label}</div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ActivityLogs
