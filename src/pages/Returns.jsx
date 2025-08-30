"use client"
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import ProtectedRoute from "../routes/ProtectedRoute"
import { useAuth } from "../contexts/AuthContext"

// Mock UI components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>{children}</div>
)

const CardHeader = ({ children }) => <div className="mb-4">{children}</div>
const CardTitle = ({ children }) => <h3 className="text-lg font-medium text-gray-900">{children}</h3>
const CardContent = ({ children }) => <div>{children}</div>

const Button = ({ children, onClick, className = "", ...props }) => (
  <button 
    onClick={onClick} 
    className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`} 
    {...props}
  >
    {children}
  </button>
)

const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)
  
  return (
    <div className="space-y-4">
      {children.map(child => 
        child.type === TabsList ? 
          React.cloneElement(child, { activeTab, setActiveTab }) : 
        child.props.value === activeTab ?
          React.cloneElement(child) :
        null
      )}
    </div>
  )
}

const TabsList = ({ children, activeTab, setActiveTab }) => (
  <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
    {React.Children.map(children, child =>
      React.cloneElement(child, {
        active: child.props.value === activeTab,
        onClick: () => setActiveTab(child.props.value)
      })
    )}
  </div>
)

const TabsTrigger = ({ children, active, onClick, value }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      active ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
    }`}
  >
    {children}
  </button>
)

const TabsContent = ({ children, value }) => (
  <div>{children}</div>
)

// Mock icons
const Plus = () => <span>+</span>
const FileText = () => <span>📄</span>
const Clock = () => <span>⏰</span>
const CheckCircle = () => <span>✅</span>

const Returns = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [returns, setReturns] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingReturn, setEditingReturn] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    // Load returns from localStorage
    const storedReturns = JSON.parse(localStorage.getItem("returns") || "[]")
    setReturns(storedReturns)
  }, [])

  const handleAddReturn = (newReturn) => {
    const returnWithId = {
      ...newReturn,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      status: "Pending",
      documentCount: newReturn.documents?.length || 0,
    }

    const updatedReturns = [returnWithId, ...returns]
    setReturns(updatedReturns)
    localStorage.setItem("returns", JSON.stringify(updatedReturns))
    setShowForm(false)
  }

  const handleUpdateReturn = (updatedReturn) => {
    const updatedReturns = returns.map((r) =>
      r.id === updatedReturn.id
        ? {
            ...updatedReturn,
            lastUpdated: new Date().toISOString().split("T")[0],
            documentCount: updatedReturn.documents?.length || 0,
          }
        : r,
    )
    setReturns(updatedReturns)
    localStorage.setItem("returns", JSON.stringify(updatedReturns))
    setEditingReturn(null)
    setShowForm(false)
  }

  const handleStatusChange = (returnId, newStatus) => {
    const updatedReturns = returns.map((r) =>
      r.id === returnId
        ? {
            ...r,
            status: newStatus,
            lastUpdated: new Date().toISOString().split("T")[0],
          }
        : r,
    )
    setReturns(updatedReturns)
    localStorage.setItem("returns", JSON.stringify(updatedReturns))
  }

  const handleDeleteReturn = (returnId) => {
    const updatedReturns = returns.filter((r) => r.id !== returnId)
    setReturns(updatedReturns)
    localStorage.setItem("returns", JSON.stringify(updatedReturns))
  }

  const stats = {
    total: returns.length,
    pending: returns.filter((r) => r.status === "Pending").length,
    inReview: returns.filter((r) => r.status === "In Review").length,
    completed: returns.filter((r) => r.status === "Completed").length,
  }

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
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Tax Returns</h1>
                  <p className="text-gray-600">Manage your tax return filings and track their progress.</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingReturn(null)
                    setShowForm(true)
                  }}
                  className="w-fit"
                >
                  <Plus />
                  <span className="ml-2">New Tax Return</span>
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                      <FileText />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending</CardTitle>
                      <Clock />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">In Review</CardTitle>
                      <Clock />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Completed</CardTitle>
                      <CheckCircle />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="list">
                <TabsList>
                  <TabsTrigger value="list">All Returns</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                  <TabsTrigger value="in-review">In Review ({stats.inReview})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                  <ReturnList
                    returns={returns}
                    onEdit={(returnItem) => {
                      setEditingReturn(returnItem)
                      setShowForm(true)
                    }}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteReturn}
                  />
                </TabsContent>

                <TabsContent value="pending">
                  <ReturnList
                    returns={returns.filter((r) => r.status === "Pending")}
                    onEdit={(returnItem) => {
                      setEditingReturn(returnItem)
                      setShowForm(true)
                    }}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteReturn}
                  />
                </TabsContent>

                <TabsContent value="in-review">
                  <ReturnList
                    returns={returns.filter((r) => r.status === "In Review")}
                    onEdit={(returnItem) => {
                      setEditingReturn(returnItem)
                      setShowForm(true)
                    }}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteReturn}
                  />
                </TabsContent>

                <TabsContent value="completed">
                  <ReturnList
                    returns={returns.filter((r) => r.status === "Completed")}
                    onEdit={(returnItem) => {
                      setEditingReturn(returnItem)
                      setShowForm(true)
                    }}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteReturn}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          </main>
        </div>

        {/* Return Form Modal */}
        {showForm && (
          <ReturnForm
            isOpen={showForm}
            onClose={() => {
              setShowForm(false)
              setEditingReturn(null)
            }}
            onSubmit={editingReturn ? handleUpdateReturn : handleAddReturn}
            editingReturn={editingReturn}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}

// Simple ReturnList component
const ReturnList = ({ returns, onEdit, onStatusChange, onDelete }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border divide-y divide-gray-200">
      {returns.length === 0 ? (
        <div className="p-12 text-center">
          <FileText />
          <h3 className="text-lg font-medium text-gray-900 mt-4">No tax returns found</h3>
          <p className="text-gray-600">Create your first tax return to get started.</p>
        </div>
      ) : (
        returns.map((returnItem) => (
          <div key={returnItem.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Form {returnItem.type}</p>
                  <p className="text-sm text-gray-500">
                    Created {new Date(returnItem.createdDate).toLocaleDateString()} • {returnItem.documentCount || 0} documents
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(returnItem.status)}`}>
                  {returnItem.status}
                </span>
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => onEdit(returnItem)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this tax return?")) {
                      onDelete(returnItem.id)
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// Simple ReturnForm component
const ReturnForm = ({ isOpen, onClose, onSubmit, editingReturn }) => {
  const [formData, setFormData] = useState(
    editingReturn || {
      type: "",
      year: new Date().getFullYear(),
      documents: [],
    }
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">
          {editingReturn ? "Edit Tax Return" : "New Tax Return"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Form Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select form type</option>
              <option value="1040">1040 - Individual</option>
              <option value="1120">1120 - Corporation</option>
              <option value="1065">1065 - Partnership</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {editingReturn ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Returns