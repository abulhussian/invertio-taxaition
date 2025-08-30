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
const CreditCard = () => <span>💳</span>
const Receipt = () => <span>🧾</span>
const DollarSign = () => <span>💰</span>
const CheckCircle = () => <span>✅</span>
const AlertCircle = () => <span>⚠️</span>

const Payments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [invoices, setInvoices] = useState([])
  const [receipts, setReceipts] = useState([])
  const [paymentModal, setPaymentModal] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    // Load invoices and receipts from localStorage
    const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    const storedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]")
    
    setInvoices(storedInvoices)
    setReceipts(storedReceipts)
  }, [])

  const handlePayInvoice = (invoice) => {
    setPaymentModal(invoice)
  }

  const handlePaymentSuccess = (invoice, paymentDetails) => {
    // Update invoice status
    const updatedInvoices = invoices.map((inv) =>
      inv.id === invoice.id
        ? {
            ...inv,
            status: "Paid",
            paidDate: new Date().toISOString().split("T")[0],
            paymentMethod: paymentDetails.method,
          }
        : inv,
    )
    setInvoices(updatedInvoices)
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices))

    // Generate receipt
    const newReceipt = {
      id: `REC-${Date.now()}`,
      invoiceId: invoice.id,
      amount: invoice.amount,
      paidOn: new Date().toISOString().split("T")[0],
      paymentMethod: paymentDetails.method,
      description: invoice.description,
    }

    const updatedReceipts = [newReceipt, ...receipts]
    setReceipts(updatedReceipts)
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts))

    setPaymentModal(null)
  }

  const handleUpdateInvoice = (invoiceId, updates) => {
    const updatedInvoices = invoices.map((inv) => (inv.id === invoiceId ? { ...inv, ...updates } : inv))
    setInvoices(updatedInvoices)
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
  }

  const handleDeleteInvoice = (invoiceId) => {
    const updatedInvoices = invoices.filter((inv) => inv.id !== invoiceId)
    setInvoices(updatedInvoices)
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
  }

  const stats = {
    totalInvoices: invoices.length,
    unpaidInvoices: invoices.filter((inv) => inv.status === "Unpaid").length,
    paidInvoices: invoices.filter((inv) => inv.status === "Paid").length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    unpaidAmount: invoices.filter((inv) => inv.status === "Unpaid").reduce((sum, inv) => sum + inv.amount, 0),
    paidAmount: invoices.filter((inv) => inv.status === "Paid").reduce((sum, inv) => sum + inv.amount, 0),
    totalReceipts: receipts.length,
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payments & Invoices</h1>
                <p className="text-gray-600">Manage your invoices, process payments, and track receipts.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</div>
                      <p className="text-xs text-gray-500">{stats.totalInvoices} total invoices</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                      <AlertCircle />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.unpaidAmount)}</div>
                      <p className="text-xs text-gray-500">{stats.unpaidInvoices} unpaid invoices</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
                      <CheckCircle />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</div>
                      <p className="text-xs text-gray-500">{stats.paidInvoices} paid invoices</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Receipts</CardTitle>
                      <Receipt />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalReceipts}</div>
                      <p className="text-xs text-gray-500">Generated receipts</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="invoices">
                <TabsList>
                  <TabsTrigger value="invoices">
                    <CreditCard />
                    <span className="ml-2">Invoices ({stats.totalInvoices})</span>
                  </TabsTrigger>
                  <TabsTrigger value="receipts">
                    <Receipt />
                    <span className="ml-2">Receipts ({stats.totalReceipts})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="invoices">
                  <Card>
                    <CardHeader>
                      <CardTitle>Invoice Management</CardTitle>
                      <CardDescription>View, filter, and manage your invoices. Process payments online.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <InvoiceTable
                        invoices={invoices}
                        onPay={handlePayInvoice}
                        onUpdate={handleUpdateInvoice}
                        onDelete={handleDeleteInvoice}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="receipts">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Receipts</CardTitle>
                      <CardDescription>View and download your payment receipts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ReceiptTable receipts={receipts} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </main>
        </div>

        {/* Payment Modal */}
        {paymentModal && (
          <PaymentModal
            invoice={paymentModal}
            isOpen={!!paymentModal}
            onClose={() => setPaymentModal(null)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}

// Simple InvoiceTable component
const InvoiceTable = ({ invoices, onPay, onUpdate, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Unpaid":
        return "bg-red-100 text-red-800"
      case "Paid":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Invoice ID</th>
            <th className="text-left py-2">Description</th>
            <th className="text-left py-2">Amount</th>
            <th className="text-left py-2">Due Date</th>
            <th className="text-left py-2">Status</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-8 text-center text-gray-500">
                No invoices found
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{invoice.id}</td>
                <td className="py-3">{invoice.description}</td>
                <td className="py-3">{formatCurrency(invoice.amount)}</td>
                <td className="py-3">{formatDate(invoice.dueDate)}</td>
                <td className="py-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  {invoice.status === "Unpaid" && (
                    <button
                      onClick={() => onPay(invoice)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Pay
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const newDescription = prompt("Enter description", invoice.description)
                      if (newDescription !== null) {
                        onUpdate(invoice.id, { description: newDescription })
                      }
                    }}
                    className="text-gray-600 hover:text-gray-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this invoice?")) {
                        onDelete(invoice.id)
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// Simple ReceiptTable component
const ReceiptTable = ({ receipts }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Receipt ID</th>
            <th className="text-left py-2">Invoice ID</th>
            <th className="text-left py-2">Amount</th>
            <th className="text-left py-2">Paid On</th>
            <th className="text-left py-2">Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {receipts.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-8 text-center text-gray-500">
                No receipts found
              </td>
            </tr>
          ) : (
            receipts.map((receipt) => (
              <tr key={receipt.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{receipt.id}</td>
                <td className="py-3">{receipt.invoiceId}</td>
                <td className="py-3">{formatCurrency(receipt.amount)}</td>
                <td className="py-3">{formatDate(receipt.paidOn)}</td>
                <td className="py-3">{receipt.paymentMethod}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// Simple PaymentModal component
const PaymentModal = ({ invoice, isOpen, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("credit_card")

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSuccess(invoice, { method: paymentMethod })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Pay Invoice #{invoice.id}</h2>
        <div className="mb-4">
          <p className="text-gray-600">Amount: {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(invoice.amount)}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Process Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Payments