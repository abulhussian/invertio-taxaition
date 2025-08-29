"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import InvoiceTable from "../components/InvoiceTable"
import ReceiptTable from "../components/ReceiptTable"
import PaymentModal from "../components/PaymentModal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { CreditCard, Receipt, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import { getStoredData, setStoredData, seedInvoices, seedReceipts, addActivityLog } from "../data/seed"
import { formatCurrency } from "../utils/validators"

const Payments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [invoices, setInvoices] = useState([])
  const [receipts, setReceipts] = useState([])
  const [paymentModal, setPaymentModal] = useState(null)

  useEffect(() => {
    // Load invoices and receipts from localStorage or use seed data
    setInvoices(getStoredData("invoices", seedInvoices))
    setReceipts(getStoredData("receipts", seedReceipts))
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
    setStoredData("invoices", updatedInvoices)

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
    setStoredData("receipts", updatedReceipts)

    // Add activity log
    addActivityLog("Payment Processed", "Invoice", `Payment of ${formatCurrency(invoice.amount)} for ${invoice.id}`)

    setPaymentModal(null)
  }

  const handleUpdateInvoice = (invoiceId, updates) => {
    const updatedInvoices = invoices.map((inv) => (inv.id === invoiceId ? { ...inv, ...updates } : inv))
    setInvoices(updatedInvoices)
    setStoredData("invoices", updatedInvoices)

    // Add activity log
    addActivityLog("Invoice Updated", "Invoice", `Invoice ${invoiceId} was modified`)
  }

  const handleDeleteInvoice = (invoiceId) => {
    const updatedInvoices = invoices.filter((inv) => inv.id !== invoiceId)
    setInvoices(updatedInvoices)
    setStoredData("invoices", updatedInvoices)

    // Add activity log
    addActivityLog("Invoice Deleted", "Invoice", `Invoice ${invoiceId} was deleted`)
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
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</div>
                    <p className="text-xs text-muted-foreground">{stats.totalInvoices} total invoices</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.unpaidAmount)}</div>
                    <p className="text-xs text-muted-foreground">{stats.unpaidInvoices} unpaid invoices</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</div>
                    <p className="text-xs text-muted-foreground">{stats.paidInvoices} paid invoices</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receipts</CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalReceipts}</div>
                    <p className="text-xs text-muted-foreground">Generated receipts</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="invoices" className="space-y-4">
              <TabsList>
                <TabsTrigger value="invoices" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Invoices ({stats.totalInvoices})
                </TabsTrigger>
                <TabsTrigger value="receipts" className="flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Receipts ({stats.totalReceipts})
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
  )
}

export default Payments
