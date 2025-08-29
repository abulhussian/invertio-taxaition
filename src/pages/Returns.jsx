"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import ReturnForm from "../components/ReturnForm"
import ReturnList from "../components/ReturnList"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Plus, FileText, Clock, CheckCircle } from "lucide-react"
import { getStoredData, setStoredData, seedReturns, addActivityLog } from "../data/seed"

const Returns = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [returns, setReturns] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingReturn, setEditingReturn] = useState(null)

  useEffect(() => {
    // Load returns from localStorage or use seed data
    const storedReturns = getStoredData("returns", seedReturns)
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
    setStoredData("returns", updatedReturns)

    // Add activity log
    addActivityLog("Tax Return Created", "Tax Return", `New ${newReturn.type} return created`)

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
    setStoredData("returns", updatedReturns)

    // Add activity log
    addActivityLog("Tax Return Updated", "Tax Return", `Return #${updatedReturn.id} was modified`)

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
    setStoredData("returns", updatedReturns)

    // Add activity log
    addActivityLog("Status Updated", "Tax Return", `Return #${returnId} status changed to ${newStatus}`)
  }

  const handleDeleteReturn = (returnId) => {
    const updatedReturns = returns.filter((r) => r.id !== returnId)
    setReturns(updatedReturns)
    setStoredData("returns", updatedReturns)

    // Add activity log
    addActivityLog("Tax Return Deleted", "Tax Return", `Return #${returnId} was deleted`)
  }

  const stats = {
    total: returns.length,
    pending: returns.filter((r) => r.status === "Pending").length,
    inReview: returns.filter((r) => r.status === "In Review").length,
    completed: returns.filter((r) => r.status === "Completed").length,
  }

  return (
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
                <Plus className="w-4 h-4 mr-2" />
                New Tax Return
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
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
                    <Clock className="h-4 w-4 text-yellow-600" />
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
                    <Clock className="h-4 w-4 text-blue-600" />
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
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="list" className="space-y-4">
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
  )
}

export default Returns
