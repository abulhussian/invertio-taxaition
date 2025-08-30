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
const CardDescription = ({ children }) => <p className="text-sm text-gray-500">{children}</p>
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

const Input = ({ value, onChange, placeholder, className = "", ...props }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
)

// Mock icons
const Plus = () => <span>+</span>
const FolderOpen = () => <span>📂</span>
const FileText = () => <span>📄</span>
const ImageIcon = () => <span>🖼️</span>
const File = () => <span>📝</span>
const Search = () => <span>🔍</span>

const Documents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [documents, setDocuments] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showUpload, setShowUpload] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Load documents from localStorage
    const storedDocuments = JSON.parse(localStorage.getItem("documents") || "[]")
    setDocuments(storedDocuments)
  }, [])

  const handleFileUpload = (files) => {
    const newDocuments = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.includes("pdf") ? "pdf" : file.type.includes("image") ? "image" : "docx",
      size: file.size,
      uploadDate: new Date().toISOString().split("T")[0],
      comments: "",
      source: "Standalone",
    }))

    const updatedDocuments = [...documents, ...newDocuments]
    setDocuments(updatedDocuments)
    localStorage.setItem("documents", JSON.stringify(updatedDocuments))
    setShowUpload(false)
  }

  const handleUpdateDocument = (documentId, updates) => {
    const updatedDocuments = documents.map((doc) => 
      doc.id === documentId ? { ...doc, ...updates } : doc
    )
    setDocuments(updatedDocuments)
    localStorage.setItem("documents", JSON.stringify(updatedDocuments))
  }

  const handleDeleteDocument = (documentId) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== documentId)
    setDocuments(updatedDocuments)
    localStorage.setItem("documents", JSON.stringify(updatedDocuments))
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.comments && doc.comments.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterType === "all" || doc.type === filterType
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: documents.length,
    pdf: documents.filter((doc) => doc.type === "pdf").length,
    docx: documents.filter((doc) => doc.type === "docx").length,
    images: documents.filter((doc) => doc.type === "image").length,
    totalSize: documents.reduce((sum, doc) => sum + (doc.size || 0), 0),
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
                  <h1 className="text-2xl font-bold text-gray-900">Document Library</h1>
                  <p className="text-gray-600">Manage and organize all your uploaded documents in one place.</p>
                </div>
                <Button onClick={() => setShowUpload(true)} className="w-fit">
                  <Plus />
                  <span className="ml-2">Upload Documents</span>
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                      <FolderOpen />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <p className="text-xs text-gray-500">{formatFileSize(stats.totalSize)} total</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">PDF Files</CardTitle>
                      <FileText />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{stats.pdf}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Word Documents</CardTitle>
                      <File />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{stats.docx}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Images</CardTitle>
                      <ImageIcon />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{stats.images}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Search />
                  </div>
                  <Input
                    placeholder="Search documents by name or comments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${
                      filterType === "all" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    onClick={() => setFilterType("all")}
                  >
                    All ({stats.total})
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${
                      filterType === "pdf" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    onClick={() => setFilterType("pdf")}
                  >
                    PDF ({stats.pdf})
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${
                      filterType === "docx" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    onClick={() => setFilterType("docx")}
                  >
                    Word ({stats.docx})
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${
                      filterType === "image" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    onClick={() => setFilterType("image")}
                  >
                    Images ({stats.images})
                  </button>
                </div>
              </div>

              {/* Document List */}
              <div className="bg-white rounded-lg shadow-sm border">
                {filteredDocuments.length === 0 ? (
                  <div className="p-12 text-center">
                    <FolderOpen />
                    <h3 className="text-lg font-medium text-gray-900 mt-4">No documents found</h3>
                    <p className="text-gray-600">
                      {searchTerm || filterType !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "Upload your first document to get started."}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredDocuments.map((doc) => (
                      <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              {doc.type === "pdf" ? <FileText /> : doc.type === "image" ? <ImageIcon /> : <File />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(doc.size)} • {doc.uploadDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                const newComment = prompt("Enter comments", doc.comments || "")
                                if (newComment !== null) {
                                  handleUpdateDocument(doc.id, { comments: newComment })
                                }
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this document?")) {
                                  handleDeleteDocument(doc.id)
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        {doc.comments && (
                          <p className="text-sm text-gray-600 mt-2">{doc.comments}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </main>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowUpload(false)}
            />
            <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Upload Documents</h2>
                <button onClick={() => setShowUpload(false)}>×</button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <FolderOpen />
                  <h3 className="text-lg font-medium">Drag files here or click to upload</h3>
                  <p className="text-sm text-gray-500">Supports PDF, Word documents, and images</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

export default Documents